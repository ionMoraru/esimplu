import { NextResponse } from "next/server"
import { requireCourier } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { handleApiError, readJson } from "@/lib/api/respond"
import { createTripForCourier, TripValidationError } from "@/lib/services/trips"
import type { VehicleType } from "@/lib/generated/prisma/client"

interface CreateBody {
  originCity: string
  originCountry: string
  destinationCity: string
  destinationCountry: string
  departureDate: string
  arrivalDate?: string | null
  vehicleType: VehicleType
  passengerSeatsOffered?: number
  parcelCapacityKg?: number
  pricePerSeatCents?: number | null
  pricePerKgCents?: number | null
  notes?: string | null
}

export async function GET() {
  try {
    const { courier } = await requireCourier()
    const trips = await prisma.trip.findMany({
      where: { courierId: courier.id },
      orderBy: { departureDate: "desc" },
      include: { _count: { select: { bookings: true } } },
    })
    return NextResponse.json({ trips })
  } catch (err) {
    return handleApiError(err)
  }
}

export async function POST(request: Request) {
  try {
    const { courier } = await requireCourier()
    const body = await readJson<CreateBody>(request)
    const trip = await createTripForCourier(courier.id, {
      originCity: body.originCity,
      originCountry: body.originCountry,
      destinationCity: body.destinationCity,
      destinationCountry: body.destinationCountry,
      departureDate: new Date(body.departureDate),
      arrivalDate: body.arrivalDate ? new Date(body.arrivalDate) : null,
      vehicleType: body.vehicleType,
      passengerSeatsOffered: body.passengerSeatsOffered,
      parcelCapacityKg: body.parcelCapacityKg,
      pricePerSeatCents: body.pricePerSeatCents,
      pricePerKgCents: body.pricePerKgCents,
      notes: body.notes,
    })
    return NextResponse.json({ trip }, { status: 201 })
  } catch (err) {
    if (err instanceof TripValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    return handleApiError(err)
  }
}
