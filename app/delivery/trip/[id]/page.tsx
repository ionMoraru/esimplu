import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

const VEHICLE_LABELS: Record<string, string> = {
  CAR: "🚗 Automobil",
  VAN: "🚐 Microbuz",
  BUS: "🚌 Autocar",
  PLANE: "✈️ Avion",
  TRAIN: "🚆 Tren",
  OTHER: "Altul",
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
          ← Toate cursele
        </Link>
      </nav>

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">
          {trip.originCity} → {trip.destinationCity}
        </h1>
        <p className="text-sm text-muted-foreground">
          {VEHICLE_LABELS[trip.vehicleType]} · Plecare{" "}
          {new Date(trip.departureDate).toLocaleString("ro-RO")}
          {trip.arrivalDate && ` · Sosire ${new Date(trip.arrivalDate).toLocaleString("ro-RO")}`}
        </p>
        <p className="text-sm text-muted-foreground">
          Transportator: <span className="text-foreground">{trip.courier.displayName}</span>
          {trip.courier.baseCity && ` · ${trip.courier.baseCity}`}
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2">
        {trip.passengerSeatsOffered > 0 && (
          <div className="rounded border p-4">
            <h2 className="font-medium mb-2">Pasageri</h2>
            <p className="text-sm">
              <strong>{trip.passengerSeatsOffered}</strong> loc(uri) disponibil(e)
            </p>
            {trip.pricePerSeatCents != null && (
              <p className="text-sm text-muted-foreground mt-1">
                Preț orientativ: {(trip.pricePerSeatCents / 100).toFixed(2).replace(".", ",")} € / loc
              </p>
            )}
            <Link href={`/delivery/book/${trip.id}?type=PASSENGER`}>
              <Button size="sm" className="mt-3">
                Rezervă un loc
              </Button>
            </Link>
          </div>
        )}
        {trip.parcelCapacityKg > 0 && (
          <div className="rounded border p-4">
            <h2 className="font-medium mb-2">Colete</h2>
            <p className="text-sm">
              <strong>{trip.parcelCapacityKg}</strong> kg capacitate disponibilă
            </p>
            {trip.pricePerKgCents != null && (
              <p className="text-sm text-muted-foreground mt-1">
                Preț orientativ: {(trip.pricePerKgCents / 100).toFixed(2).replace(".", ",")} € / kg
              </p>
            )}
            <Link href={`/delivery/book/${trip.id}?type=PARCEL`}>
              <Button size="sm" className="mt-3">
                Trimite un colet
              </Button>
            </Link>
          </div>
        )}
      </section>

      {trip.notes && (
        <section className="rounded border bg-muted/30 p-4">
          <h2 className="font-medium mb-2">Note de la transportator</h2>
          <p className="text-sm whitespace-pre-line">{trip.notes}</p>
        </section>
      )}

      <section className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-medium">eSimplu = punere în legătură</p>
        <p className="mt-1">
          Platforma nu percepe niciun comision și nu intervine în plată. Detaliile financiare și
          logistice se rezolvă direct cu transportatorul, după confirmarea rezervării.
        </p>
      </section>
    </main>
  )
}
