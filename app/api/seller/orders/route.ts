import { NextResponse } from "next/server"
import { requireSeller } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/api/respond"

export async function GET() {
  try {
    const { seller } = await requireSeller()
    const orders = await prisma.order.findMany({
      where: { sellerId: seller.id },
      orderBy: { createdAt: "desc" },
      include: { items: true, courier: true },
    })
    return NextResponse.json({ orders })
  } catch (err) {
    return handleApiError(err)
  }
}
