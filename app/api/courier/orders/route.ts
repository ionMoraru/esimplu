import { NextResponse } from "next/server"
import { requireCourier } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/api/respond"

export async function GET() {
  try {
    const { courier } = await requireCourier()
    const orders = await prisma.order.findMany({
      where: { courierId: courier.id },
      orderBy: { createdAt: "desc" },
      include: { items: true, seller: true },
    })
    return NextResponse.json({ orders })
  } catch (err) {
    return handleApiError(err)
  }
}
