import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { BookingForm } from "@/components/delivery/booking-form"

export const dynamic = "force-dynamic"

export default async function BookTripPage({
  params,
  searchParams,
}: {
  params: Promise<{ tripId: string }>
  searchParams: Promise<{ type?: string }>
}) {
  const user = await getCurrentUser()
  const { tripId } = await params
  const sp = await searchParams

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { courier: { select: { displayName: true, approved: true } } },
  })
  if (!trip || trip.status !== "PUBLISHED" || !trip.courier?.approved) notFound()

  if (!user) {
    const cb = `/delivery/book/${tripId}${sp.type ? `?type=${sp.type}` : ""}`
    redirect(`/login?callbackUrl=${encodeURIComponent(cb)}`)
  }

  const requestedType = sp.type === "PASSENGER" || sp.type === "PARCEL" ? sp.type : undefined
  const defaultType =
    requestedType === "PASSENGER" && trip.passengerSeatsOffered > 0
      ? "PASSENGER"
      : requestedType === "PARCEL" && trip.parcelCapacityKg > 0
        ? "PARCEL"
        : trip.passengerSeatsOffered > 0
          ? "PASSENGER"
          : "PARCEL"

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Rezervă</h1>
        <p className="text-sm text-muted-foreground">
          {trip.originCity} → {trip.destinationCity} ·{" "}
          {new Date(trip.departureDate).toLocaleString("ro-RO")} · de {trip.courier.displayName}
        </p>
      </header>

      <BookingForm
        tripId={trip.id}
        defaultType={defaultType}
        passengerSeatsOffered={trip.passengerSeatsOffered}
        parcelCapacityKg={trip.parcelCapacityKg}
      />
    </main>
  )
}
