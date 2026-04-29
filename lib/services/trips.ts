import { prisma } from "@/lib/prisma"
import type { Trip, VehicleType } from "@/lib/generated/prisma/client"

const ALLOWED_COUNTRIES = ["fr", "de", "it", "uk", "md", "ro", "be", "es", "pt", "at", "ch", "nl", "lu", "gr", "pl", "bg", "hu", "sk", "cz"]
const MAX_CITY = 80
const MAX_NOTES = 1000
const MAX_CAPACITY_KG = 5000
const MAX_PASSENGER_SEATS = 50
const MAX_PRICE_CENTS = 50_000_00 // 50k €
const ALLOWED_VEHICLES: VehicleType[] = ["CAR", "VAN", "BUS", "PLANE", "TRAIN", "OTHER"]

export interface CreateTripInput {
  originCity: string
  originCountry: string
  destinationCity: string
  destinationCountry: string
  departureDate: Date
  arrivalDate?: Date | null
  vehicleType: VehicleType
  passengerSeatsOffered?: number
  parcelCapacityKg?: number
  pricePerSeatCents?: number | null
  pricePerKgCents?: number | null
  notes?: string | null
}

export class TripValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "TripValidationError"
  }
}

function checkCity(label: string, value: string): string {
  const v = value.trim()
  if (!v) throw new TripValidationError(`${label} requis`)
  if (v.length > MAX_CITY) throw new TripValidationError(`${label} trop long (max ${MAX_CITY})`)
  return v
}

function checkCountry(label: string, value: string): string {
  const v = value.trim().toLowerCase()
  if (!ALLOWED_COUNTRIES.includes(v)) {
    throw new TripValidationError(`${label} non supporté (acceptés : ${ALLOWED_COUNTRIES.join(", ")})`)
  }
  return v
}

export function validateCreateTripInput(input: CreateTripInput): CreateTripInput {
  const originCity = checkCity("Ville de départ", input.originCity)
  const originCountry = checkCountry("Pays de départ", input.originCountry)
  const destinationCity = checkCity("Ville d'arrivée", input.destinationCity)
  const destinationCountry = checkCountry("Pays d'arrivée", input.destinationCountry)

  if (originCity.toLowerCase() === destinationCity.toLowerCase() && originCountry === destinationCountry) {
    throw new TripValidationError("Origine et destination identiques")
  }

  const departureDate = new Date(input.departureDate)
  if (Number.isNaN(departureDate.getTime())) {
    throw new TripValidationError("Date de départ invalide")
  }
  if (departureDate.getTime() < Date.now() - 60 * 60 * 1000) {
    throw new TripValidationError("La date de départ ne peut pas être dans le passé")
  }
  let arrivalDate: Date | null = null
  if (input.arrivalDate) {
    arrivalDate = new Date(input.arrivalDate)
    if (Number.isNaN(arrivalDate.getTime())) {
      throw new TripValidationError("Date d'arrivée invalide")
    }
    if (arrivalDate < departureDate) {
      throw new TripValidationError("La date d'arrivée doit être après la date de départ")
    }
  }

  if (!ALLOWED_VEHICLES.includes(input.vehicleType)) {
    throw new TripValidationError("Type de véhicule invalide")
  }

  const passengerSeatsOffered = Math.max(0, input.passengerSeatsOffered ?? 0)
  const parcelCapacityKg = Math.max(0, input.parcelCapacityKg ?? 0)
  if (passengerSeatsOffered === 0 && parcelCapacityKg === 0) {
    throw new TripValidationError("Indiquez au moins une capacité passager OU colis")
  }
  if (passengerSeatsOffered > MAX_PASSENGER_SEATS) {
    throw new TripValidationError(`Trop de places (max ${MAX_PASSENGER_SEATS})`)
  }
  if (parcelCapacityKg > MAX_CAPACITY_KG) {
    throw new TripValidationError(`Capacité colis trop élevée (max ${MAX_CAPACITY_KG} kg)`)
  }

  function checkPrice(label: string, v: number | null | undefined): number | null {
    if (v === null || v === undefined) return null
    if (!Number.isInteger(v) || v < 0) throw new TripValidationError(`${label} doit être un entier positif (en cents)`)
    if (v > MAX_PRICE_CENTS) throw new TripValidationError(`${label} dépasse le maximum`)
    return v
  }
  const pricePerSeatCents = checkPrice("Prix passager", input.pricePerSeatCents)
  const pricePerKgCents = checkPrice("Prix par kg", input.pricePerKgCents)

  let notes: string | null = null
  if (input.notes !== undefined && input.notes !== null) {
    const n = input.notes.trim()
    if (n.length > MAX_NOTES) throw new TripValidationError(`Notes trop longues (max ${MAX_NOTES})`)
    notes = n || null
  }

  return {
    originCity,
    originCountry,
    destinationCity,
    destinationCountry,
    departureDate,
    arrivalDate,
    vehicleType: input.vehicleType,
    passengerSeatsOffered,
    parcelCapacityKg,
    pricePerSeatCents,
    pricePerKgCents,
    notes,
  }
}

export async function createTripForCourier(courierId: string, input: CreateTripInput): Promise<Trip> {
  const validated = validateCreateTripInput(input)
  return prisma.trip.create({
    data: {
      courierId,
      originCity: validated.originCity,
      originCountry: validated.originCountry,
      destinationCity: validated.destinationCity,
      destinationCountry: validated.destinationCountry,
      departureDate: validated.departureDate,
      arrivalDate: validated.arrivalDate,
      vehicleType: validated.vehicleType,
      passengerSeatsOffered: validated.passengerSeatsOffered ?? 0,
      parcelCapacityKg: validated.parcelCapacityKg ?? 0,
      pricePerSeatCents: validated.pricePerSeatCents,
      pricePerKgCents: validated.pricePerKgCents,
      notes: validated.notes,
      status: "PUBLISHED",
    },
  })
}

export interface SearchTripsFilters {
  originCity?: string
  destinationCity?: string
  fromDate?: Date
  toDate?: Date
  type?: "PASSENGER" | "PARCEL"
}

export async function searchPublishedTrips(filters: SearchTripsFilters): Promise<Trip[]> {
  const where: Record<string, unknown> = {
    status: "PUBLISHED",
    departureDate: { gte: filters.fromDate ?? new Date() },
  }
  if (filters.originCity) {
    where.originCity = { equals: filters.originCity.trim(), mode: "insensitive" }
  }
  if (filters.destinationCity) {
    where.destinationCity = { equals: filters.destinationCity.trim(), mode: "insensitive" }
  }
  if (filters.toDate) {
    (where.departureDate as Record<string, Date>).lte = filters.toDate
  }
  if (filters.type === "PASSENGER") {
    where.passengerSeatsOffered = { gt: 0 }
  }
  if (filters.type === "PARCEL") {
    where.parcelCapacityKg = { gt: 0 }
  }
  return prisma.trip.findMany({
    where,
    orderBy: { departureDate: "asc" },
    take: 100,
    include: { courier: true },
  })
}
