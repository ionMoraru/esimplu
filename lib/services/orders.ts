import { prisma } from "@/lib/prisma"
import { ForbiddenError } from "@/lib/auth/roles"
import type { Order, OrderStatus, User, Prisma } from "@/lib/generated/prisma/client"

export interface CreateOrderItemInput {
  productId: string
  quantity?: number
}

export interface CreateOrderInput {
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: string
  deliveryCity: string
  deliveryCountry: string
  notes?: string | null
  items: CreateOrderItemInput[]
}

export class OrderStateError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "OrderStateError"
  }
}

function computeTotals(productsCents: number, commissionPct: number) {
  const commissionCents = Math.floor((productsCents * commissionPct) / 100)
  const payoutCents = productsCents - commissionCents
  return { commissionCents, payoutCents }
}

// H4 fix: whitelist pays autorisés au niveau de la création de commande aussi.
const ALLOWED_DELIVERY_COUNTRIES = ["fr", "de", "it", "uk"] as const

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  if (input.items.length === 0) throw new Error("Order must have at least one item")

  // H4 fix
  if (!ALLOWED_DELIVERY_COUNTRIES.includes(input.deliveryCountry as (typeof ALLOWED_DELIVERY_COUNTRIES)[number])) {
    throw new Error(`Pays de livraison non supporté : ${input.deliveryCountry}`)
  }

  // M4 fix: limite la taille des notes (DB TEXT illimité sinon).
  if (input.notes && input.notes.length > 1000) {
    throw new Error("Les notes ne peuvent pas dépasser 1000 caractères")
  }

  // MVP: 1 order = 1 seller. Validate that all items come from the same seller.
  const products = await prisma.product.findMany({
    where: { id: { in: input.items.map((i) => i.productId) } },
    include: { seller: true },
  })
  if (products.length !== input.items.length) throw new Error("One or more products not found")
  const sellerIds = new Set(products.map((p) => p.sellerId))
  if (sellerIds.size > 1) {
    throw new Error("MVP: orders must contain products from a single seller only")
  }
  const seller = products[0].seller
  if (!seller.approved) throw new Error("Seller is not approved")

  // H3 fix: un seller ne peut pas commander chez son propre profil. Bloque
  // l'auto-commerce / abus du réseau courier.
  if (seller.userId === input.customerId) {
    throw new Error("Vous ne pouvez pas commander chez votre propre compte vendeur")
  }

  // Compute pricing
  let productsCents = 0
  const itemRows = input.items.map((i) => {
    const p = products.find((x) => x.id === i.productId)!
    if (!p.isPublished) throw new Error(`Product ${p.name} is not published`)
    if (!p.countriesAvailable.includes(input.deliveryCountry)) {
      throw new Error(`Product ${p.name} is not available in ${input.deliveryCountry}`)
    }
    const qty = i.quantity ?? 1
    if (qty < 1) throw new Error("Quantity must be >= 1")
    if (p.stock < qty) throw new Error(`Product ${p.name} has insufficient stock`)
    const lineCents = p.priceCents * qty
    productsCents += lineCents
    return {
      productId: p.id,
      productName: p.name,
      unitPriceCents: p.priceCents,
      quantity: qty,
    }
  })

  const { commissionCents, payoutCents } = computeTotals(productsCents, seller.commissionPct)

  return prisma.order.create({
    data: {
      customerId: input.customerId,
      sellerId: seller.id,
      status: "PENDING_PAYMENT",
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      deliveryAddress: input.deliveryAddress,
      deliveryCity: input.deliveryCity,
      deliveryCountry: input.deliveryCountry,
      notes: input.notes ?? null,
      productsCents,
      commissionCents,
      payoutCents,
      items: {
        create: itemRows,
      },
      events: {
        create: {
          type: "CREATED",
          actorUserId: input.customerId,
          payload: { itemCount: itemRows.length, productsCents },
        },
      },
    },
  })
}

async function transitionStatus(
  orderId: string,
  expected: OrderStatus[],
  next: OrderStatus,
  eventType: string,
  actor: User | null,
  extra: Prisma.OrderUpdateInput = {},
): Promise<Order> {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId } })
    if (!order) throw new OrderStateError("Order not found")
    if (!expected.includes(order.status)) {
      throw new OrderStateError(
        `Order ${orderId} is in status ${order.status}, expected one of ${expected.join(", ")}`,
      )
    }
    const updated = await tx.order.update({
      where: { id: orderId },
      data: { status: next, ...extra },
    })
    await tx.orderEvent.create({
      data: {
        orderId,
        type: eventType,
        actorUserId: actor?.id ?? null,
        payload: { from: order.status, to: next },
      },
    })
    return updated
  })
}

export async function markPaid(orderId: string, paymentRef: string, providerName: string, actor: User | null): Promise<Order> {
  return transitionStatus(orderId, ["PENDING_PAYMENT"], "PAID", "PAID", actor, {
    paymentProvider: providerName,
    paymentRef,
    paidAt: new Date(),
  })
}

export async function assignCourier(orderId: string, courierId: string, admin: User): Promise<Order> {
  // H1 fix: re-vérifier l'approbation du courier DANS la transaction pour
  // éviter une race condition (admin retire l'approval entre lecture et update).
  return prisma.$transaction(async (tx) => {
    const courier = await tx.courierProfile.findUnique({ where: { id: courierId } })
    if (!courier) throw new Error("Courier not found")
    if (!courier.approved) throw new ForbiddenError("Courier is not approved")
    const order = await tx.order.findUnique({ where: { id: orderId } })
    if (!order) throw new OrderStateError("Order not found")
    if (order.status !== "PAID" && order.status !== "HANDED_OVER") {
      throw new OrderStateError(`Order must be PAID or HANDED_OVER to assign a courier (current: ${order.status})`)
    }
    const updated = await tx.order.update({
      where: { id: orderId },
      data: { courierId },
    })
    await tx.orderEvent.create({
      data: {
        orderId,
        type: "COURIER_ASSIGNED",
        actorUserId: admin.id,
        payload: { courierId },
      },
    })
    return updated
  })
}

export async function handover(orderId: string, courierUserId: string): Promise<Order> {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { courier: true } })
  if (!order) throw new OrderStateError("Order not found")
  if (!order.courier || order.courier.userId !== courierUserId) {
    throw new ForbiddenError("You are not the courier for this order")
  }
  return transitionStatus(orderId, ["PAID"], "HANDED_OVER", "HANDED_OVER", { id: courierUserId } as User, {
    courierConfirmedAt: new Date(),
  })
}

export async function confirmDeliveryByCourier(orderId: string, courierUserId: string): Promise<Order> {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { courier: true } })
  if (!order) throw new OrderStateError("Order not found")
  if (!order.courier || order.courier.userId !== courierUserId) {
    throw new ForbiddenError("You are not the courier for this order")
  }
  // Two-stage: courier marks delivered → COURIER_DELIVERED, then customer confirms → DELIVERED.
  const updated = await transitionStatus(
    orderId,
    ["HANDED_OVER"],
    "COURIER_DELIVERED",
    "COURIER_DELIVERED",
    { id: courierUserId } as User,
    {},
  )
  return updated
}

export async function confirmDeliveryByCustomer(orderId: string, customerUserId: string): Promise<Order> {
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) throw new OrderStateError("Order not found")
  if (order.customerId !== customerUserId) {
    throw new ForbiddenError("You are not the customer for this order")
  }
  return transitionStatus(orderId, ["COURIER_DELIVERED"], "DELIVERED", "CUSTOMER_CONFIRMED", { id: customerUserId } as User, {
    customerConfirmedAt: new Date(),
  })
}

export async function settleOrder(orderId: string, admin: User): Promise<Order> {
  return transitionStatus(orderId, ["DELIVERED"], "SETTLED", "SETTLED", admin, {
    settledAt: new Date(),
  })
}

export async function cancelOrder(orderId: string, actor: User, reason?: string): Promise<Order> {
  return transitionStatus(
    orderId,
    ["PENDING_PAYMENT", "PAID"],
    "CANCELLED",
    "CANCELLED",
    actor,
    {},
  ).then(async (order) => {
    if (reason) {
      await prisma.orderEvent.create({
        data: { orderId, type: "CANCELLED_REASON", payload: { reason }, actorUserId: actor.id },
      })
    }
    return order
  })
}

export async function getOrderForUser(orderId: string, viewer: User): Promise<Order | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
      events: { orderBy: { createdAt: "asc" } },
      seller: true,
      courier: true,
    },
  })
  if (!order) return null

  if (viewer.role === "ADMIN") return order
  if (order.customerId === viewer.id) return order

  const isSeller = order.seller && (await prisma.sellerProfile.findFirst({
    where: { id: order.sellerId, userId: viewer.id },
  }))
  if (isSeller) return order

  if (order.courier && order.courier.userId === viewer.id) return order

  return null
}
