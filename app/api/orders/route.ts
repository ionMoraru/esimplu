import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/roles"
import { createOrder } from "@/lib/services/orders"
import { getPaymentProvider } from "@/lib/services/payment"
import { getEmailService, tplCustomerOrderConfirmation } from "@/lib/services/email"
import { handleApiError, readJson } from "@/lib/api/respond"

interface CreateOrderBody {
  customerName?: string
  customerPhone: string
  deliveryAddress: string
  deliveryCity: string
  deliveryCountry: string
  notes?: string | null
  items: Array<{ productId: string; quantity?: number }>
}

export async function POST(request: Request) {
  try {
    const user = await requireUser()
    if (!user.email) {
      return handleApiError(new Error("Compte sans email valide"))
    }
    const body = await readJson<CreateOrderBody>(request)

    // H5 fix: customerEmail vient TOUJOURS de la session, jamais du body, pour
    // éviter qu'un user authentifié déclenche des emails au nom d'un tiers.
    const customerName = (body.customerName ?? "").trim() || user.name || user.email

    const order = await createOrder({
      customerId: user.id,
      customerName,
      customerEmail: user.email,
      customerPhone: body.customerPhone,
      deliveryAddress: body.deliveryAddress,
      deliveryCity: body.deliveryCity,
      deliveryCountry: body.deliveryCountry,
      notes: body.notes ?? null,
      items: body.items,
    })

    const provider = getPaymentProvider()
    const checkout = await provider.createCheckout(order)

    const email = getEmailService()
    const totalEur = (order.productsCents / 100).toFixed(2).replace(".", ",")
    const tpl = tplCustomerOrderConfirmation({
      orderId: order.id,
      productsLine: `${body.items.length} produit(s)`,
      totalEur,
      customerName,
    })
    await email.send({ ...tpl, to: user.email })

    return NextResponse.json({ order, checkout })
  } catch (err) {
    return handleApiError(err)
  }
}
