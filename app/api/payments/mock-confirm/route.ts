import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/roles"
import { markPaid } from "@/lib/services/orders"
import { getEmailService, tplSellerNewOrder } from "@/lib/services/email"
import { prisma } from "@/lib/prisma"
import { handleApiError, jsonError, readJson } from "@/lib/api/respond"

export async function POST(request: Request) {
  try {
    if (process.env.PAYMENT_PROVIDER && process.env.PAYMENT_PROVIDER !== "mock") {
      return jsonError("Mock confirmation is only available in mock mode", 400)
    }
    const user = await requireUser()
    const { orderId } = await readJson<{ orderId: string }>(request)

    const existing = await prisma.order.findUnique({ where: { id: orderId } })
    if (!existing) return jsonError("Order not found", 404)
    if (existing.customerId !== user.id) {
      return jsonError("You are not the customer of this order", 403)
    }

    const order = await markPaid(orderId, `mock_${orderId}`, "mock", user)

    // Notify seller
    const seller = await prisma.sellerProfile.findUnique({
      where: { id: order.sellerId },
      include: { user: true },
    })
    const items = await prisma.orderItem.findMany({ where: { orderId } })
    if (seller?.user.email) {
      const email = getEmailService()
      const totalEur = (order.productsCents / 100).toFixed(2).replace(".", ",")
      const tpl = tplSellerNewOrder({
        orderId,
        productsLine: items.map((i) => `${i.productName} x${i.quantity}`).join(", "),
        totalEur,
        customerName: order.customerName,
      })
      await email.send({ ...tpl, to: seller.user.email })
    }

    return NextResponse.json({ order })
  } catch (err) {
    return handleApiError(err)
  }
}
