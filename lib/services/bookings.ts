import { prisma } from "@/lib/prisma"
import type { Booking, BookingType } from "@/lib/generated/prisma/client"

const MAX_PHONE = 30
const MAX_MESSAGE = 1000
const MAX_DESCRIPTION = 500
const MAX_ADDRESS = 200
const MAX_QUANTITY_PASSENGER = 50
const MAX_QUANTITY_PARCEL_KG = 5000

export class BookingValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "BookingValidationError"
  }
}

export class BookingStateError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "BookingStateError"
  }
}

export interface CreateBookingInput {
  tripId: string
  customerId: string
  type: BookingType
  quantity: number
  customerPhone: string
  customerMessage?: string | null
  parcelDescription?: string | null
  pickupAddress?: string | null
  dropoffAddress?: string | null
}

function trimMax(label: string, v: string | undefined | null, max: number, required: boolean): string | null {
  const t = (v ?? "").trim()
  if (!t) {
    if (required) throw new BookingValidationError(`${label} requis`)
    return null
  }
  if (t.length > max) throw new BookingValidationError(`${label} trop long (max ${max})`)
  return t
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const trip = await prisma.trip.findUnique({ where: { id: input.tripId } })
  if (!trip) throw new BookingValidationError("Trajet introuvable")
  if (trip.status !== "PUBLISHED") {
    throw new BookingValidationError(`Trajet non disponible (status : ${trip.status})`)
  }
  if (trip.departureDate.getTime() < Date.now()) {
    throw new BookingValidationError("Trajet déjà parti")
  }

  if (input.type === "PASSENGER") {
    if (trip.passengerSeatsOffered <= 0) {
      throw new BookingValidationError("Ce trajet ne propose pas de places passager")
    }
    if (!Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > MAX_QUANTITY_PASSENGER) {
      throw new BookingValidationError(`Nombre de passagers invalide (1-${MAX_QUANTITY_PASSENGER})`)
    }
    if (input.quantity > trip.passengerSeatsOffered) {
      throw new BookingValidationError(`Pas assez de places (offertes : ${trip.passengerSeatsOffered})`)
    }
  } else if (input.type === "PARCEL") {
    if (trip.parcelCapacityKg <= 0) {
      throw new BookingValidationError("Ce trajet ne propose pas de transport de colis")
    }
    if (!Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > MAX_QUANTITY_PARCEL_KG) {
      throw new BookingValidationError(`Poids invalide (1-${MAX_QUANTITY_PARCEL_KG} kg)`)
    }
    if (input.quantity > trip.parcelCapacityKg) {
      throw new BookingValidationError(`Capacité insuffisante (max : ${trip.parcelCapacityKg} kg)`)
    }
  } else {
    throw new BookingValidationError("Type de réservation invalide")
  }

  // Empêche un user de booker plusieurs fois le même trip pour le même type
  // tant qu'une demande est en PENDING/CONFIRMED.
  const existing = await prisma.booking.findFirst({
    where: {
      tripId: input.tripId,
      customerId: input.customerId,
      type: input.type,
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  })
  if (existing) {
    throw new BookingValidationError("Vous avez déjà une demande active sur ce trajet pour ce type de service")
  }

  const customerPhone = trimMax("Téléphone", input.customerPhone, MAX_PHONE, true)!
  const customerMessage = trimMax("Message", input.customerMessage, MAX_MESSAGE, false)
  const parcelDescription = input.type === "PARCEL"
    ? trimMax("Description du colis", input.parcelDescription, MAX_DESCRIPTION, true)
    : null
  const pickupAddress = input.type === "PARCEL"
    ? trimMax("Adresse de retrait", input.pickupAddress, MAX_ADDRESS, true)
    : null
  const dropoffAddress = input.type === "PARCEL"
    ? trimMax("Adresse de livraison", input.dropoffAddress, MAX_ADDRESS, true)
    : null

  return prisma.booking.create({
    data: {
      tripId: input.tripId,
      customerId: input.customerId,
      type: input.type,
      quantity: input.quantity,
      customerPhone,
      customerMessage,
      parcelDescription,
      pickupAddress,
      dropoffAddress,
      status: "PENDING",
    },
  })
}

export async function acceptBookingAsCourier(bookingId: string, courierUserId: string): Promise<Booking> {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { trip: { include: { courier: true } } },
    })
    if (!booking) throw new BookingStateError("Réservation introuvable")
    if (booking.trip.courier.userId !== courierUserId) {
      throw new BookingStateError("Vous n'êtes pas le transporteur de ce trajet")
    }
    if (booking.status !== "PENDING") {
      throw new BookingStateError(`Réservation déjà ${booking.status}`)
    }
    return tx.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED", confirmedAt: new Date() },
    })
  })
}

export async function rejectBookingAsCourier(
  bookingId: string,
  courierUserId: string,
  reason?: string,
): Promise<Booking> {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { trip: { include: { courier: true } } },
    })
    if (!booking) throw new BookingStateError("Réservation introuvable")
    if (booking.trip.courier.userId !== courierUserId) {
      throw new BookingStateError("Vous n'êtes pas le transporteur de ce trajet")
    }
    if (booking.status !== "PENDING") {
      throw new BookingStateError(`Réservation déjà ${booking.status}`)
    }
    const trimmedReason = reason?.trim().slice(0, MAX_MESSAGE) || null
    return tx.booking.update({
      where: { id: bookingId },
      data: {
        status: "REJECTED",
        rejectedAt: new Date(),
        rejectionReason: trimmedReason,
      },
    })
  })
}

export async function cancelBookingAsCustomer(bookingId: string, customerUserId: string): Promise<Booking> {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({ where: { id: bookingId } })
    if (!booking) throw new BookingStateError("Réservation introuvable")
    if (booking.customerId !== customerUserId) {
      throw new BookingStateError("Vous n'êtes pas le client de cette réservation")
    }
    if (booking.status === "REJECTED" || booking.status === "CANCELLED") {
      throw new BookingStateError(`Réservation déjà ${booking.status}`)
    }
    return tx.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    })
  })
}
