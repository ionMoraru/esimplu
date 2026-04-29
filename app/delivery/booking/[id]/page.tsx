import Link from "next/link"
import { notFound } from "next/navigation"
import { requireUserSession } from "@/lib/auth/server-guards"
import { prisma } from "@/lib/prisma"
import { CustomerCancelBookingButton } from "@/components/delivery/customer-cancel-booking"

export const dynamic = "force-dynamic"

const STATUS_LABELS: Record<string, string> = {
  PENDING: "În așteptare validare",
  CONFIRMED: "Confirmată",
  REJECTED: "Refuzată",
  CANCELLED: "Anulată",
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

  const showContact = booking.status === "CONFIRMED"

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <nav className="text-sm text-muted-foreground">
        <Link href="/delivery" className="hover:text-foreground transition-colors">
          ← Caută alte curse
        </Link>
      </nav>

      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Rezervarea mea</h1>
        <p className="text-sm text-muted-foreground">
          {booking.trip.originCity} → {booking.trip.destinationCity} ·{" "}
          {new Date(booking.trip.departureDate).toLocaleString("ro-RO")}
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
            Transportatorul are 48 h să-ți răspundă. Vei fi notificat(ă) pe email.
          </p>
        )}
        {booking.status === "REJECTED" && booking.rejectionReason && (
          <p className="text-sm mt-1">Motiv: {booking.rejectionReason}</p>
        )}
      </section>

      {showContact && (
        <section className="rounded border p-4 space-y-2">
          <h2 className="font-medium">Date de contact transportator</h2>
          <p className="text-sm">
            <strong>{booking.trip.courier.displayName}</strong> ({booking.trip.courier.user.name ?? ""})
          </p>
          <p className="text-sm">📞 {booking.trip.courier.phone}</p>
          {booking.trip.courier.user.email && (
            <p className="text-sm">✉️ {booking.trip.courier.user.email}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Contactează-l direct pentru a stabili detaliile (locul de întâlnire, plata). eSimplu
            nu intervine nici în plată, nici în livrare.
          </p>
        </section>
      )}

      <section className="rounded border p-4 space-y-2 text-sm">
        <h2 className="font-medium">Detalii cerere</h2>
        <div>
          Tip: {booking.type === "PASSENGER" ? "Pasageri" : "Colet"} · Cantitate: {booking.quantity}
          {booking.type === "PASSENGER" ? " loc(uri)" : " kg"}
        </div>
        {booking.type === "PARCEL" && (
          <>
            <div>Colet: {booking.parcelDescription}</div>
            <div>Ridicare: {booking.pickupAddress}</div>
            <div>Livrare: {booking.dropoffAddress}</div>
          </>
        )}
        {booking.customerMessage && (
          <div>Mesaj trimis: {booking.customerMessage}</div>
        )}
      </section>

      {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
        <CustomerCancelBookingButton bookingId={booking.id} />
      )}
    </main>
  )
}
