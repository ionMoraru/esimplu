import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

const VEHICLE_LABELS: Record<string, string> = {
  CAR: "🚗 Voiture",
  VAN: "🚐 Camionnette",
  BUS: "🚌 Bus",
  PLANE: "✈️ Avion",
  TRAIN: "🚆 Train",
  OTHER: "Autre",
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      courier: {
        select: { displayName: true, baseCity: true, baseCountry: true, approved: true },
      },
    },
  })
  if (!trip || trip.status !== "PUBLISHED" || !trip.courier?.approved) {
    notFound()
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <nav className="text-sm text-muted-foreground">
        <Link href="/delivery" className="hover:text-foreground transition-colors">
          ← Tous les trajets
        </Link>
      </nav>

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">
          {trip.originCity} → {trip.destinationCity}
        </h1>
        <p className="text-sm text-muted-foreground">
          {VEHICLE_LABELS[trip.vehicleType]} · Départ{" "}
          {new Date(trip.departureDate).toLocaleString("fr-FR")}
          {trip.arrivalDate && ` · Arrivée ${new Date(trip.arrivalDate).toLocaleString("fr-FR")}`}
        </p>
        <p className="text-sm text-muted-foreground">
          Transporteur : <span className="text-foreground">{trip.courier.displayName}</span>
          {trip.courier.baseCity && ` · ${trip.courier.baseCity}`}
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2">
        {trip.passengerSeatsOffered > 0 && (
          <div className="rounded border p-4">
            <h2 className="font-medium mb-2">Passagers</h2>
            <p className="text-sm">
              <strong>{trip.passengerSeatsOffered}</strong> place(s) disponible(s)
            </p>
            {trip.pricePerSeatCents != null && (
              <p className="text-sm text-muted-foreground mt-1">
                Tarif indicatif : {(trip.pricePerSeatCents / 100).toFixed(2).replace(".", ",")} € / place
              </p>
            )}
            <Link href={`/delivery/book/${trip.id}?type=PASSENGER`}>
              <Button size="sm" className="mt-3">
                Réserver une place
              </Button>
            </Link>
          </div>
        )}
        {trip.parcelCapacityKg > 0 && (
          <div className="rounded border p-4">
            <h2 className="font-medium mb-2">Colis</h2>
            <p className="text-sm">
              <strong>{trip.parcelCapacityKg}</strong> kg de capacité disponible
            </p>
            {trip.pricePerKgCents != null && (
              <p className="text-sm text-muted-foreground mt-1">
                Tarif indicatif : {(trip.pricePerKgCents / 100).toFixed(2).replace(".", ",")} € / kg
              </p>
            )}
            <Link href={`/delivery/book/${trip.id}?type=PARCEL`}>
              <Button size="sm" className="mt-3">
                Envoyer un colis
              </Button>
            </Link>
          </div>
        )}
      </section>

      {trip.notes && (
        <section className="rounded border bg-muted/30 p-4">
          <h2 className="font-medium mb-2">Notes du transporteur</h2>
          <p className="text-sm whitespace-pre-line">{trip.notes}</p>
        </section>
      )}

      <section className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-medium">eSimplu = mise en relation</p>
        <p className="mt-1">
          La plateforme ne perçoit aucune commission et n&apos;intervient pas dans le paiement.
          Les arrangements financiers et logistiques se font directement avec le transporteur
          après confirmation de la réservation.
        </p>
      </section>
    </main>
  )
}
