import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { handleApiError, jsonError, readJson } from "@/lib/api/respond"

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
      data.displayName = trimmed
    }
    if (body.city !== undefined) data.city = body.city?.trim() || null
    if (body.country !== undefined) {
      const c = body.country.trim().toLowerCase()
      if (c.length !== 2) return jsonError("country doit être un code ISO à 2 lettres (ex: fr, md, ro)", 400)
      data.country = c
    }
    if (body.phone !== undefined) data.phone = body.phone?.trim() || null
    if (body.iban !== undefined) data.iban = body.iban?.trim().replace(/\s+/g, "") || null
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
