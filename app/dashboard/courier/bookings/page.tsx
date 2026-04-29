import Link from "next/link"
import { requireCourierSession } from "@/lib/auth/server-guards"
import { prisma } from "@/lib/prisma"
import { CourierBookingActions } from "@/components/delivery/courier-booking-actions"

export const dynamic = "force-dynamic"

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente de votre validation",
  CONFIRMED: "Confirmée",
  REJECTED: "Refusée",
  CANCELLED: "Annulée par le client",
}

export default async function CourierBookingsPage() {
  const { courier } = await requireCourierSession()
  const bookings = await prisma.booking.findMany({
    where: { trip: { courierId: courier.id } },
    orderBy: { createdAt: "desc" },
    include: {
      trip: true,
      customer: { select: { name: true, email: true } },
    },
  })

  const pending = bookings.filter((b) => b.status === "PENDING")
  const others = bookings.filter((b) => b.status !== "PENDING")

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Demandes reçues</h1>
        <Link href="/dashboard/courier/trips" className="text-sm text-emerald-700 underline">
          ← Mes trajets
        </Link>
      </header>

      <section>
        <h2 className="text-lg font-medium mb-3">À traiter ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune demande en attente.</p>
        ) : (
          <ul className="space-y-3">
            {pending.map((b) => (
              <li key={b.id} className="rounded border p-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">
                      {b.trip.originCity} → {b.trip.destinationCity}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(b.trip.departureDate).toLocaleString("fr-FR")}
                    </div>
                  </div>
                  <div className="text-sm text-right">
                    <div className="font-medium">
                      {b.type === "PASSENGER"
                        ? `${b.quantity} passager(s)`
                        : `${b.quantity} kg`}
                    </div>
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="font-medium">Client :</span>{" "}
                    {b.customer.name ?? b.customer.email} — {b.customerPhone}
                  </div>
                  {b.customerMessage && (
                    <div>
                      <span className="font-medium">Message :</span> {b.customerMessage}
                    </div>
                  )}
                  {b.type === "PARCEL" && (
                    <div className="text-xs text-muted-foreground">
                      <div>Colis : {b.parcelDescription}</div>
                      <div>De : {b.pickupAddress}</div>
                      <div>Vers : {b.dropoffAddress}</div>
                    </div>
                  )}
                </div>
                <CourierBookingActions bookingId={b.id} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {others.length > 0 && (
        <section>
          <h2 className="text-lg font-medium mb-3">Historique</h2>
          <ul className="space-y-1 text-sm">
            {others.map((b) => (
              <li key={b.id} className="flex justify-between text-muted-foreground border-b py-2">
                <span>
                  {b.trip.originCity} → {b.trip.destinationCity} · {b.type === "PASSENGER" ? "passager" : "colis"}
                </span>
                <span>{STATUS_LABELS[b.status]}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
