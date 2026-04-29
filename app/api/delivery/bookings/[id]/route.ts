import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { handleApiError, jsonError } from "@/lib/api/respond"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser()
    const { id } = await params
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        trip: {
          include: {
            // Coordonnées courier exposées seulement au customer ET seulement
            // si le booking a été confirmé. Sinon on cache phone/email.
            courier: { include: { user: { select: { name: true, email: true } } } },
          },
        },
      },
    })
    if (!booking) return jsonError("Réservation introuvable", 404)
    if (booking.customerId !== user.id && user.role !== "ADMIN") {
      return jsonError("Accès refusé", 403)
    }

    // Sanitize : ne JAMAIS exposer le téléphone du courier tant que le
    // booking n'est pas CONFIRMED. Sinon n'importe qui pourrait spammer
    // le courier en créant une fausse réservation et en l'annulant.
    const safe = {
      ...booking,
      trip: {
        ...booking.trip,
        courier:
          booking.status === "CONFIRMED"
            ? booking.trip.courier
            : {
                id: booking.trip.courier.id,
                displayName: booking.trip.courier.displayName,
                baseCity: booking.trip.courier.baseCity,
                baseCountry: booking.trip.courier.baseCountry,
                user: { name: booking.trip.courier.user.name, email: null },
                phone: null,
              },
      },
    }

    return NextResponse.json({ booking: safe })
  } catch (err) {
    return handleApiError(err)
  }
}
