import Link from "next/link"
import { searchPublishedTrips } from "@/lib/services/trips"

export const dynamic = "force-dynamic"

interface SearchParams {
  originCity?: string
  destinationCity?: string
  fromDate?: string
  type?: string
}

const VEHICLE_LABELS: Record<string, string> = {
  CAR: "🚗",
  VAN: "🚐",
  BUS: "🚌",
  PLANE: "✈️",
  TRAIN: "🚆",
  OTHER: "•",
}

export default async function DeliverySearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const type = sp.type === "PASSENGER" || sp.type === "PARCEL" ? sp.type : undefined
  const trips = await searchPublishedTrips({
    originCity: sp.originCity,
    destinationCity: sp.destinationCity,
    fromDate: sp.fromDate ? new Date(sp.fromDate) : undefined,
    type,
  })

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Trouver un trajet</h1>
        <p className="text-sm text-muted-foreground">
          Voyage entre la diaspora et le pays. Transport de passagers ou colis.
        </p>
      </header>

      <form className="rounded border p-4 grid gap-3 sm:grid-cols-[1fr_1fr_180px_180px_auto]" method="get">
        <div>
          <label className="block text-xs mb-1">Départ</label>
          <input
            name="originCity"
            defaultValue={sp.originCity ?? ""}
            placeholder="Paris"
            className="w-full rounded border px-3 py-2 text-sm bg-background"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Arrivée</label>
          <input
            name="destinationCity"
            defaultValue={sp.destinationCity ?? ""}
            placeholder="Chișinău"
            className="w-full rounded border px-3 py-2 text-sm bg-background"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">À partir de</label>
          <input
            type="date"
            name="fromDate"
            defaultValue={sp.fromDate ?? ""}
            className="w-full rounded border px-3 py-2 text-sm bg-background"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Type</label>
          <select
            name="type"
            defaultValue={type ?? ""}
            className="w-full rounded border px-3 py-2 text-sm bg-background"
          >
            <option value="">Tous</option>
            <option value="PASSENGER">Passagers</option>
            <option value="PARCEL">Colis</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
          >
            Rechercher
          </button>
        </div>
      </form>

      <section>
        <h2 className="text-lg font-medium mb-3">{trips.length} trajet(s) trouvé(s)</h2>
        {trips.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun trajet ne correspond à votre recherche. Essayez d&apos;élargir les critères.
          </p>
        ) : (
          <ul className="space-y-3">
            {trips.map((t) => {
              const courier = (t as typeof t & { courier?: { displayName: string; baseCity?: string } }).courier
              return (
                <li key={t.id} className="rounded border p-4 hover:shadow-sm transition-shadow">
                  <Link href={`/delivery/trip/${t.id}`} className="block space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium">
                          {VEHICLE_LABELS[t.vehicleType] ?? "•"} {t.originCity} → {t.destinationCity}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(t.departureDate).toLocaleString("fr-FR")}
                          {courier && ` · par ${courier.displayName}`}
                        </div>
                      </div>
                      <div className="text-sm text-right shrink-0">
                        {t.passengerSeatsOffered > 0 && (
                          <div>
                            {t.passengerSeatsOffered} place(s)
                            {t.pricePerSeatCents != null &&
                              ` · ${(t.pricePerSeatCents / 100).toFixed(2).replace(".", ",")} €`}
                          </div>
                        )}
                        {t.parcelCapacityKg > 0 && (
                          <div>
                            {t.parcelCapacityKg} kg
                            {t.pricePerKgCents != null &&
                              ` · ${(t.pricePerKgCents / 100).toFixed(2).replace(".", ",")} €/kg`}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </main>
  )
}
