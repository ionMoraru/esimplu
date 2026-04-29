import { NextResponse } from "next/server"
import { requireCourier } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { handleApiError, jsonError } from "@/lib/api/respond"
import type { TripStatus } from "@/lib/generated/prisma/client"

interface PatchBody {
  status?: TripStatus
}

const ALLOWED_TRANSITIONS: Record<TripStatus, TripStatus[]> = {
  DRAFT: ["PUBLISHED", "CANCELLED"],
  PUBLISHED: ["FULL", "DEPARTED", "CANCELLED"],
  FULL: ["DEPARTED", "PUBLISHED", "CANCELLED"],
  DEPARTED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { courier } = await requireCourier()
    const { id } = await params
    const body = (await request.json().catch(() => ({}))) as PatchBody

    const trip = await prisma.trip.findUnique({ where: { id } })
    if (!trip) return jsonError("Trajet introuvable", 404)
    if (trip.courierId !== courier.id) return jsonError("Vous n'êtes pas le transporteur de ce trajet", 403)

    if (body.status) {
      const allowed = ALLOWED_TRANSITIONS[trip.status]
      if (!allowed.includes(body.status)) {
        return jsonError(`Transition ${trip.status} → ${body.status} interdite`, 400)
      }
    }

    const updated = await prisma.trip.update({
      where: { id },
      data: { status: body.status },
    })
    return NextResponse.json({ trip: updated })
  } catch (err) {
    return handleApiError(err)
  }
}
