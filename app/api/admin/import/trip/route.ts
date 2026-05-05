import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireImportToken, ImportAuthError, importAuthErrorResponse } from "@/lib/api/import-auth"
import { logImport } from "@/lib/api/import-log"
import { createTripForCourier, TripValidationError } from "@/lib/services/trips"
import type { VehicleType } from "@/lib/generated/prisma/client"

interface ImportTripBody {
  courierEmail: string
  originCity: string
  originCountry: string
  destinationCity: string
  destinationCountry: string
  departureDate: string // ISO 8601
  arrivalDate?: string | null
  vehicleType: VehicleType
  passengerSeatsOffered?: number
  parcelCapacityKg?: number
  pricePerSeatCents?: number | null
  pricePerKgCents?: number | null
  notes?: string | null
}

function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status })
}

function validateBody(b: Partial<ImportTripBody>): string | null {
  if (!b.courierEmail?.trim()) return "courierEmail required"
  if (!b.originCity?.trim()) return "originCity required"
  if (!b.originCountry?.trim()) return "originCountry required"
  if (!b.destinationCity?.trim()) return "destinationCity required"
  if (!b.destinationCountry?.trim()) return "destinationCountry required"
  if (!b.departureDate) return "departureDate required (ISO 8601)"
  if (!b.vehicleType) return "vehicleType required"
  return null
}

export async function POST(request: Request) {
  let body: Partial<ImportTripBody> = {}
  try {
    requireImportToken(request)
    body = (await request.json()) as Partial<ImportTripBody>

    const err = validateBody(body)
    if (err) {
      await logImport({ type: "trip", action: "duplicate", payload: body, request, status: 400 })
      return jsonError(err, 400)
    }

    const email = body.courierEmail!.trim().toLowerCase()
    const user = await prisma.user.findUnique({
      where: { email },
      include: { courierProfile: true },
    })
    if (!user?.courierProfile) {
      await logImport({ type: "trip", action: "duplicate", payload: body, request, status: 404 })
      return jsonError(`courier profile not found for ${email}`, 404)
    }
    if (!user.courierProfile.approved) {
      await logImport({ type: "trip", action: "duplicate", payload: body, request, status: 409 })
      return jsonError(`courier ${email} is not approved yet`, 409)
    }

    const departureDate = new Date(body.departureDate!)
    if (Number.isNaN(departureDate.getTime())) {
      await logImport({ type: "trip", action: "duplicate", payload: body, request, status: 400 })
      return jsonError("departureDate must be a valid ISO 8601 string", 400)
    }

    // Idempotence : un trip du même courier avec mêmes villes + même date de
    // départ (à la minute près) est considéré doublon.
    const minuteWindowStart = new Date(departureDate.getTime() - 60_000)
    const minuteWindowEnd = new Date(departureDate.getTime() + 60_000)
    const existing = await prisma.trip.findFirst({
      where: {
        courierId: user.courierProfile.id,
        originCity: { equals: body.originCity!.trim(), mode: "insensitive" },
        destinationCity: { equals: body.destinationCity!.trim(), mode: "insensitive" },
        departureDate: { gte: minuteWindowStart, lte: minuteWindowEnd },
      },
    })
    if (existing) {
      await logImport({
        type: "trip",
        action: "duplicate",
        targetId: existing.id,
        targetSlug: `${email}|${existing.originCity}->${existing.destinationCity}`,
        payload: body,
        request,
        status: 200,
      })
      return NextResponse.json({ trip: existing, alreadyExists: true }, { status: 200 })
    }

    const trip = await createTripForCourier(user.courierProfile.id, {
      originCity: body.originCity!,
      originCountry: body.originCountry!,
      destinationCity: body.destinationCity!,
      destinationCountry: body.destinationCountry!,
      departureDate,
      arrivalDate: body.arrivalDate ? new Date(body.arrivalDate) : null,
      vehicleType: body.vehicleType!,
      passengerSeatsOffered: body.passengerSeatsOffered,
      parcelCapacityKg: body.parcelCapacityKg,
      pricePerSeatCents: body.pricePerSeatCents,
      pricePerKgCents: body.pricePerKgCents,
      notes: body.notes,
    })

    await logImport({
      type: "trip",
      action: "created",
      targetId: trip.id,
      targetSlug: `${email}|${trip.originCity}->${trip.destinationCity}`,
      payload: body,
      request,
      status: 201,
    })

    return NextResponse.json({ trip, alreadyExists: false }, { status: 201 })
  } catch (e) {
    if (e instanceof ImportAuthError) return importAuthErrorResponse(e)
    if (e instanceof TripValidationError) {
      await logImport({ type: "trip", action: "duplicate", payload: body, request, status: 400 })
      return jsonError(e.message, 400)
    }
    const message = e instanceof Error ? e.message : "unknown error"
    await logImport({ type: "trip", action: "duplicate", payload: body, request, status: 500 })
    return jsonError(message, 500)
  }
}
