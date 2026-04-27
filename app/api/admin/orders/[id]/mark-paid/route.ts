import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/roles"
import { markPaid } from "@/lib/services/orders"
import { getEmailService, tplSellerNewOrder } from "@/lib/services/email"
import { prisma } from "@/lib/prisma"
import { handleApiError, readJson } from "@/lib/api/respond"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    const { id } = await params
    let paymentRef = `manual_${id}`
    try {
      const body = await readJson<{ paymentRef?: string }>(request)
      if (body?.paymentRef) paymentRef = body.paymentRef
    } catch {
      // ignore — empty body is fine for manual mode
    }
    const order = await markPaid(id, paymentRef, "manual", admin)

    const seller = await prisma.sellerProfile.findUnique({
      where: { id: order.sellerId },
      include: { user: true },
    })
    const items = await prisma.orderItem.findMany({ where: { orderId: id } })
    if (seller?.user.email) {
      const email = getEmailService()
      const totalEur = (order.productsCents / 100).toFixed(2).replace(".", ",")
      const tpl = tplSellerNewOrder({
        orderId: id,
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
