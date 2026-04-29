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
        <h1 className="text-2xl font-semibold">Caută o cursă</h1>
        <p className="text-sm text-muted-foreground">
          Călătorie între diaspora și țară. Transport pentru pasageri sau colete.
        </p>
      </header>

      <form className="rounded border p-4 grid gap-3 sm:grid-cols-[1fr_1fr_180px_180px_auto]" method="get">
        <div>
          <label className="block text-xs mb-1">Plecare</label>
          <input
            name="originCity"
            defaultValue={sp.originCity ?? ""}
            placeholder="Paris"
            className="w-full rounded border px-3 py-2 text-sm bg-background"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Sosire</label>
          <input
            name="destinationCity"
            defaultValue={sp.destinationCity ?? ""}
            placeholder="Chișinău"
            className="w-full rounded border px-3 py-2 text-sm bg-background"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Începând de la</label>
          <input
            type="date"
            name="fromDate"
            defaultValue={sp.fromDate ?? ""}
            className="w-full rounded border px-3 py-2 text-sm bg-background"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Tip</label>
          <select
            name="type"
            defaultValue={type ?? ""}
            className="w-full rounded border px-3 py-2 text-sm bg-background"
          >
            <option value="">Toate</option>
            <option value="PASSENGER">Pasageri</option>
            <option value="PARCEL">Colete</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
          >
            Caută
          </button>
        </div>
      </form>

      <section>
        <h2 className="text-lg font-medium mb-3">{trips.length} cursă(e) găsită(e)</h2>
        {trips.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nu există curse care să corespundă căutării tale. Încearcă să lărgești criteriile.
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
                          {new Date(t.departureDate).toLocaleString("ro-RO")}
                          {courier && ` · de ${courier.displayName}`}
                        </div>
                      </div>
                      <div className="text-sm text-right shrink-0">
                        {t.passengerSeatsOffered > 0 && (
                          <div>
                            {t.passengerSeatsOffered} loc(uri)
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
