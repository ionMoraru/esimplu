import { NextResponse } from "next/server"
import { requireCourier } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { handleApiError, readJson } from "@/lib/api/respond"
import { rejectBookingAsCourier, BookingStateError } from "@/lib/services/bookings"
import { getEmailService, tplCustomerBookingRejected } from "@/lib/services/email"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user } = await requireCourier()
    const { id } = await params
    let reason: string | undefined
    try {
      const body = await readJson<{ reason?: string }>(request)
      reason = body?.reason
    } catch {
      // pas de body — OK
    }
    const booking = await rejectBookingAsCourier(id, user.id, reason)

    try {
      const fullBooking = await prisma.booking.findUnique({
        where: { id },
        include: { trip: true, customer: true },
      })
      if (fullBooking?.customer.email) {
        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000"
        const tpl = tplCustomerBookingRejected({
          bookingId: id,
          originCity: fullBooking.trip.originCity,
          destinationCity: fullBooking.trip.destinationCity,
          reason: booking.rejectionReason,
          trackingUrl: `${baseUrl}/delivery/booking/${id}`,
        })
        await getEmailService().send({ ...tpl, to: fullBooking.customer.email })
      }
    } catch (err) {
      console.error("[booking-reject] email échoué", err)
    }

    return NextResponse.json({ booking })
  } catch (err) {
    if (err instanceof BookingStateError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    return handleApiError(err)
  }
}
