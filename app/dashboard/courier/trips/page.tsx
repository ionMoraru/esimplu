import Link from "next/link"
import { requireCourierSession } from "@/lib/auth/server-guards"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Ciornă",
  PUBLISHED: "Publicată",
  FULL: "Complet",
  DEPARTED: "Plecată",
  COMPLETED: "Finalizată",
  CANCELLED: "Anulată",
}

export default async function CourierTripsPage() {
  const { courier } = await requireCourierSession()
  const trips = await prisma.trip.findMany({
    where: { courierId: courier.id },
    orderBy: { departureDate: "desc" },
    include: { _count: { select: { bookings: true } } },
  })

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cursele mele</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/courier/bookings">
            <Button variant="outline">Cereri primite</Button>
          </Link>
          <Link href="/dashboard/courier/trips/new">
            <Button>Publică o cursă</Button>
          </Link>
        </div>
      </header>

      {trips.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nicio cursă deocamdată. Apasă pe „Publică o cursă” pentru a începe.
        </p>
      ) : (
        <ul className="divide-y border rounded">
          {trips.map((t) => (
            <li key={t.id} className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-medium">
                  {t.originCity} → {t.destinationCity}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(t.departureDate).toLocaleString("ro-RO")} ·{" "}
                  {t.passengerSeatsOffered > 0 && `${t.passengerSeatsOffered} loc(uri)`}
                  {t.passengerSeatsOffered > 0 && t.parcelCapacityKg > 0 && " · "}
                  {t.parcelCapacityKg > 0 && `${t.parcelCapacityKg} kg`}
                </div>
                <div className="text-xs text-emerald-700">
                  {STATUS_LABELS[t.status]} · {t._count.bookings} cerere/cereri
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
