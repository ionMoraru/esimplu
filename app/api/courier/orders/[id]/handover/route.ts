import { NextResponse } from "next/server"
import { requireCourier } from "@/lib/auth/roles"
import { handover } from "@/lib/services/orders"
import { getEmailService, tplCustomerHandedOver } from "@/lib/services/email"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/api/respond"

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user, courier } = await requireCourier()
    const { id } = await params
    const order = await handover(id, user.id)

    const fullOrder = await prisma.order.findUnique({ where: { id }, include: { items: true } })
    if (fullOrder) {
      const email = getEmailService()
      const totalEur = (fullOrder.productsCents / 100).toFixed(2).replace(".", ",")
      const tpl = tplCustomerHandedOver({
        orderId: fullOrder.id,
        productsLine: `${fullOrder.items.length} produit(s)`,
        totalEur,
        customerName: fullOrder.customerName,
        courierName: courier.displayName,
      })
      await email.send({ ...tpl, to: fullOrder.customerEmail })
    }

    return NextResponse.json({ order })
  } catch (err) {
    return handleApiError(err)
  }
}
