import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { handleApiError, readJson } from "@/lib/api/respond"
import { createBooking, BookingValidationError } from "@/lib/services/bookings"
import { getEmailService, tplCourierNewBookingRequest } from "@/lib/services/email"
import type { BookingType } from "@/lib/generated/prisma/client"

interface CreateBody {
  tripId: string
  type: BookingType
  quantity: number
  customerPhone: string
  customerMessage?: string
  parcelDescription?: string
  pickupAddress?: string
  dropoffAddress?: string
}

export async function POST(request: Request) {
  try {
    const user = await requireUser()
    const body = await readJson<CreateBody>(request)
    const booking = await createBooking({
      tripId: body.tripId,
      customerId: user.id,
      type: body.type,
      quantity: body.quantity,
      customerPhone: body.customerPhone,
      customerMessage: body.customerMessage,
      parcelDescription: body.parcelDescription,
      pickupAddress: body.pickupAddress,
      dropoffAddress: body.dropoffAddress,
    })

    // Notification courier (le transporteur reçoit la demande par email).
    try {
      const fullBooking = await prisma.booking.findUnique({
        where: { id: booking.id },
        include: {
          trip: { include: { courier: { include: { user: true } } } },
          customer: true,
        },
      })
      if (fullBooking?.trip.courier.user.email) {
        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000"
        const tpl = tplCourierNewBookingRequest({
          bookingId: booking.id,
          tripId: fullBooking.tripId,
          type: fullBooking.type,
          quantity: fullBooking.quantity,
          originCity: fullBooking.trip.originCity,
          destinationCity: fullBooking.trip.destinationCity,
          departureDate: fullBooking.trip.departureDate.toLocaleString("fr-FR"),
          customerName: fullBooking.customer.name ?? fullBooking.customer.email ?? "Client",
          customerPhone: fullBooking.customerPhone,
          customerMessage: fullBooking.customerMessage,
          reviewUrl: `${baseUrl}/dashboard/courier/bookings`,
        })
        await getEmailService().send({ ...tpl, to: fullBooking.trip.courier.user.email })
      }
    } catch (err) {
      console.error("[booking-create] email courier échoué", err)
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (err) {
    if (err instanceof BookingValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    return handleApiError(err)
  }
}
