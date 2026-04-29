import { NextResponse } from "next/server"
import { requireCourier } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/api/respond"

export async function GET() {
  try {
    const { courier } = await requireCourier()
    const bookings = await prisma.booking.findMany({
      where: { trip: { courierId: courier.id } },
      orderBy: { createdAt: "desc" },
      include: { trip: true, customer: { select: { name: true, email: true } } },
    })
    return NextResponse.json({ bookings })
  } catch (err) {
    return handleApiError(err)
  }
}
