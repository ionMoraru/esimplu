import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/roles"
import { assignCourier } from "@/lib/services/orders"
import { getEmailService, tplCourierNewAssignment } from "@/lib/services/email"
import { prisma } from "@/lib/prisma"
import { handleApiError, readJson } from "@/lib/api/respond"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    const { id } = await params
    const { courierId } = await readJson<{ courierId: string }>(request)
    const order = await assignCourier(id, courierId, admin)

    const courier = await prisma.courierProfile.findUnique({
      where: { id: courierId },
      include: { user: true },
    })
    const fullOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true, seller: true },
    })
    if (courier?.user.email && fullOrder) {
      const email = getEmailService()
      const totalEur = (fullOrder.productsCents / 100).toFixed(2).replace(".", ",")
      const tpl = tplCourierNewAssignment({
        orderId: fullOrder.id,
        productsLine: `${fullOrder.items.length} produit(s)`,
        totalEur,
        customerName: fullOrder.customerName,
        pickupSeller: fullOrder.seller.displayName,
        deliveryAddress: `${fullOrder.deliveryAddress}, ${fullOrder.deliveryCity}, ${fullOrder.deliveryCountry}`,
      })
      await email.send({ ...tpl, to: courier.user.email })
    }

    return NextResponse.json({ order })
  } catch (err) {
    return handleApiError(err)
  }
}
