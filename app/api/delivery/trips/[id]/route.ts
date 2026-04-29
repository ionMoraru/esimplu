import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError, jsonError } from "@/lib/api/respond"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        courier: {
          // Coordonnées courier non exposées tant que le booking n'est pas
          // confirmé : on ne renvoie que displayName et baseCity.
          select: { id: true, displayName: true, baseCity: true, baseCountry: true, approved: true },
        },
      },
    })
    if (!trip || trip.status !== "PUBLISHED" || !trip.courier?.approved) {
      return jsonError("Trajet introuvable ou indisponible", 404)
    }
    return NextResponse.json({ trip })
  } catch (err) {
    return handleApiError(err)
  }
}
