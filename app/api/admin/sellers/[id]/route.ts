import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { handleApiError, jsonError, readJson } from "@/lib/api/respond"

// Mêmes caps qu'au register (H3 fix).
const MAX_DISPLAY_NAME = 80
const MAX_CITY = 80
const MAX_PHONE = 30
const MAX_IBAN = 34
const IBAN_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/

interface PatchBody {
  displayName?: string
  city?: string | null
  country?: string
  phone?: string | null
  iban?: string | null
  commissionPct?: number
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await readJson<PatchBody>(request)

    const data: Record<string, unknown> = {}

    if (body.displayName !== undefined) {
      const trimmed = body.displayName.trim()
      if (trimmed.length === 0) return jsonError("displayName ne peut pas être vide", 400)
      if (trimmed.length > MAX_DISPLAY_NAME) {
        return jsonError(`displayName trop long (max ${MAX_DISPLAY_NAME})`, 400)
      }
      data.displayName = trimmed
    }
    if (body.city !== undefined) {
      const c = body.city?.trim() || null
      if (c && c.length > MAX_CITY) return jsonError(`Ville trop longue (max ${MAX_CITY})`, 400)
      data.city = c
    }
    if (body.country !== undefined) {
      const c = body.country.trim().toLowerCase()
      if (c.length !== 2) return jsonError("country doit être un code ISO à 2 lettres (ex: fr, md, ro)", 400)
      data.country = c
    }
    if (body.phone !== undefined) {
      const p = body.phone?.trim() || null
      if (p && p.length > MAX_PHONE) return jsonError(`Téléphone trop long (max ${MAX_PHONE})`, 400)
      data.phone = p
    }
    if (body.iban !== undefined) {
      const i = body.iban?.trim().replace(/\s+/g, "").toUpperCase() || null
      if (i) {
        if (i.length > MAX_IBAN) return jsonError(`IBAN trop long (max ${MAX_IBAN})`, 400)
        if (!IBAN_REGEX.test(i)) return jsonError("Format IBAN invalide (ex: FR76...)", 400)
      }
      data.iban = i
    }
    if (body.commissionPct !== undefined) {
      if (!Number.isInteger(body.commissionPct) || body.commissionPct < 0 || body.commissionPct > 50) {
        return jsonError("commissionPct doit être un entier entre 0 et 50", 400)
      }
      data.commissionPct = body.commissionPct
    }

    const seller = await prisma.sellerProfile.update({
      where: { id },
      data,
      include: { user: true },
    })

    return NextResponse.json({ seller })
  } catch (err) {
    return handleApiError(err)
  }
}
