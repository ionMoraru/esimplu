import { NextResponse } from "next/server"
import { requireCourier } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/api/respond"
import { acceptBookingAsCourier, BookingStateError } from "@/lib/services/bookings"
import { getEmailService, tplCustomerBookingConfirmed } from "@/lib/services/email"

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user, courier } = await requireCourier()
    const { id } = await params
    const booking = await acceptBookingAsCourier(id, user.id)

    // Notification client avec coordonnées du transporteur.
    try {
      const fullBooking = await prisma.booking.findUnique({
        where: { id },
        include: { trip: true, customer: true },
      })
      if (fullBooking?.customer.email) {
        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000"
        const tpl = tplCustomerBookingConfirmed({
          bookingId: id,
          originCity: fullBooking.trip.originCity,
          destinationCity: fullBooking.trip.destinationCity,
          departureDate: fullBooking.trip.departureDate.toLocaleString("fr-FR"),
          courierName: courier.displayName,
          courierPhone: courier.phone,
          trackingUrl: `${baseUrl}/delivery/booking/${id}`,
        })
        await getEmailService().send({ ...tpl, to: fullBooking.customer.email })
      }
    } catch (err) {
      console.error("[booking-accept] email échoué", err)
    }

    return NextResponse.json({ booking })
  } catch (err) {
    if (err instanceof BookingStateError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    return handleApiError(err)
  }
}
