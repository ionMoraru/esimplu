import { NextResponse } from "next/server"
import { requireCourier } from "@/lib/auth/roles"
import { confirmDeliveryByCourier } from "@/lib/services/orders"
import { getEmailService, tplCustomerCourierDelivered } from "@/lib/services/email"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/api/respond"

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user } = await requireCourier()
    const { id } = await params
    const order = await confirmDeliveryByCourier(id, user.id)

    const fullOrder = await prisma.order.findUnique({ where: { id }, include: { items: true } })
    if (fullOrder) {
      const email = getEmailService()
      const totalEur = (fullOrder.productsCents / 100).toFixed(2).replace(".", ",")
      const trackingUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/orders/${fullOrder.id}`
      const tpl = tplCustomerCourierDelivered({
        orderId: fullOrder.id,
        productsLine: `${fullOrder.items.length} produit(s)`,
        totalEur,
        customerName: fullOrder.customerName,
        trackingUrl,
      })
      await email.send({ ...tpl, to: fullOrder.customerEmail })
    }

    return NextResponse.json({ order })
  } catch (err) {
    return handleApiError(err)
  }
}
