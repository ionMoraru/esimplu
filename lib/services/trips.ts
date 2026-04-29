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
  if (!v) throw new TripValidationError(`${label} este obligatoriu`)
  if (v.length > MAX_CITY) throw new TripValidationError(`${label} prea lung (maxim ${MAX_CITY})`)
  return v
}

function checkCountry(label: string, value: string): string {
  const v = value.trim().toLowerCase()
  if (!ALLOWED_COUNTRIES.includes(v)) {
    throw new TripValidationError(`${label} nu este acceptată (acceptate: ${ALLOWED_COUNTRIES.join(", ")})`)
  }
  return v
}

export function validateCreateTripInput(input: CreateTripInput): CreateTripInput {
  const originCity = checkCity("Orașul de plecare", input.originCity)
  const originCountry = checkCountry("Țara de plecare", input.originCountry)
  const destinationCity = checkCity("Orașul de sosire", input.destinationCity)
  const destinationCountry = checkCountry("Țara de sosire", input.destinationCountry)

  if (originCity.toLowerCase() === destinationCity.toLowerCase() && originCountry === destinationCountry) {
    throw new TripValidationError("Plecarea și sosirea sunt identice")
  }

  const departureDate = new Date(input.departureDate)
  if (Number.isNaN(departureDate.getTime())) {
    throw new TripValidationError("Data de plecare nevalidă")
  }
  if (departureDate.getTime() < Date.now() - 60 * 60 * 1000) {
    throw new TripValidationError("Data de plecare nu poate fi în trecut")
  }
  let arrivalDate: Date | null = null
  if (input.arrivalDate) {
    arrivalDate = new Date(input.arrivalDate)
    if (Number.isNaN(arrivalDate.getTime())) {
      throw new TripValidationError("Data de sosire nevalidă")
    }
    if (arrivalDate < departureDate) {
      throw new TripValidationError("Data de sosire trebuie să fie după data de plecare")
    }
  }

  if (!ALLOWED_VEHICLES.includes(input.vehicleType)) {
    throw new TripValidationError("Tip de vehicul nevalid")
  }

  const passengerSeatsOffered = Math.max(0, input.passengerSeatsOffered ?? 0)
  const parcelCapacityKg = Math.max(0, input.parcelCapacityKg ?? 0)
  if (passengerSeatsOffered === 0 && parcelCapacityKg === 0) {
    throw new TripValidationError("Indică cel puțin o capacitate pentru pasageri SAU pentru colete")
  }
  if (passengerSeatsOffered > MAX_PASSENGER_SEATS) {
    throw new TripValidationError(`Prea multe locuri (maxim ${MAX_PASSENGER_SEATS})`)
  }
  if (parcelCapacityKg > MAX_CAPACITY_KG) {
    throw new TripValidationError(`Capacitate colete prea mare (maxim ${MAX_CAPACITY_KG} kg)`)
  }

  function checkPrice(label: string, v: number | null | undefined): number | null {
    if (v === null || v === undefined) return null
    if (!Number.isInteger(v) || v < 0) throw new TripValidationError(`${label} trebuie să fie un întreg pozitiv (în cenți)`)
    if (v > MAX_PRICE_CENTS) throw new TripValidationError(`${label} depășește maximul`)
    return v
  }
  const pricePerSeatCents = checkPrice("Preț pasager", input.pricePerSeatCents)
  const pricePerKgCents = checkPrice("Preț per kg", input.pricePerKgCents)

  let notes: string | null = null
  if (input.notes !== undefined && input.notes !== null) {
    const n = input.notes.trim()
    if (n.length > MAX_NOTES) throw new TripValidationError(`Note prea lungi (maxim ${MAX_NOTES})`)
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
