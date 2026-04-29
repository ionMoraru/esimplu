import Link from "next/link"
import { notFound } from "next/navigation"
import { requireUserSession } from "@/lib/auth/server-guards"
import { prisma } from "@/lib/prisma"
import { CustomerCancelBookingButton } from "@/components/delivery/customer-cancel-booking"

export const dynamic = "force-dynamic"

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente de validation",
  CONFIRMED: "Confirmée",
  REJECTED: "Refusée",
  CANCELLED: "Annulée",
}

export default async function BookingTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireUserSession()
  const { id } = await params
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      trip: {
        include: {
          courier: { include: { user: { select: { name: true, email: true } } } },
        },
      },
    },
  })
  if (!booking) notFound()
  if (booking.customerId !== user.id && user.role !== "ADMIN") notFound()

  // Coordonnées courier visibles seulement après CONFIRMED.
  const showContact = booking.status === "CONFIRMED"

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <nav className="text-sm text-muted-foreground">
        <Link href="/delivery" className="hover:text-foreground transition-colors">
          ← Rechercher d&apos;autres trajets
        </Link>
      </nav>

      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Ma réservation</h1>
        <p className="text-sm text-muted-foreground">
          {booking.trip.originCity} → {booking.trip.destinationCity} ·{" "}
          {new Date(booking.trip.departureDate).toLocaleString("fr-FR")}
        </p>
      </header>

      <section
        className={`rounded border p-4 ${
          booking.status === "CONFIRMED"
            ? "border-emerald-300 bg-emerald-50 text-emerald-900"
            : booking.status === "REJECTED" || booking.status === "CANCELLED"
              ? "border-red-300 bg-red-50 text-red-900"
              : "border-amber-300 bg-amber-50 text-amber-900"
        }`}
      >
        <p className="font-medium">{STATUS_LABELS[booking.status]}</p>
        {booking.status === "PENDING" && (
          <p className="text-sm mt-1">
            Le transporteur a 48 h pour vous répondre. Vous serez notifié(e) par email.
          </p>
        )}
        {booking.status === "REJECTED" && booking.rejectionReason && (
          <p className="text-sm mt-1">Raison : {booking.rejectionReason}</p>
        )}
      </section>

      {showContact && (
        <section className="rounded border p-4 space-y-2">
          <h2 className="font-medium">Coordonnées du transporteur</h2>
          <p className="text-sm">
            <strong>{booking.trip.courier.displayName}</strong> ({booking.trip.courier.user.name ?? ""})
          </p>
          <p className="text-sm">📞 {booking.trip.courier.phone}</p>
          {booking.trip.courier.user.email && (
            <p className="text-sm">✉️ {booking.trip.courier.user.email}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Contactez-le directement pour finaliser les détails (lieu de RDV, paiement). eSimplu
            n&apos;intervient ni dans le paiement ni dans la livraison.
          </p>
        </section>
      )}

      <section className="rounded border p-4 space-y-2 text-sm">
        <h2 className="font-medium">Détails de la demande</h2>
        <div>
          Type : {booking.type === "PASSENGER" ? "Passagers" : "Colis"} · Quantité : {booking.quantity}
          {booking.type === "PASSENGER" ? " place(s)" : " kg"}
        </div>
        {booking.type === "PARCEL" && (
          <>
            <div>Colis : {booking.parcelDescription}</div>
            <div>Retrait : {booking.pickupAddress}</div>
            <div>Livraison : {booking.dropoffAddress}</div>
          </>
        )}
        {booking.customerMessage && (
          <div>Message envoyé : {booking.customerMessage}</div>
        )}
      </section>

      {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
        <CustomerCancelBookingButton bookingId={booking.id} />
      )}
    </main>
  )
}
