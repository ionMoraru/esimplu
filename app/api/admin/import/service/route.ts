import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireImportToken, ImportAuthError, importAuthErrorResponse } from "@/lib/api/import-auth"
import { logImport } from "@/lib/api/import-log"
import { createServiceDraft } from "@/lib/services/claim"

const ALLOWED_COUNTRIES = ["fr", "de", "it", "uk"]

interface ImportServiceBody {
  title: string
  categorySlug: string
  description: string
  city: string
  country: string
  phone: string
  languages?: string[]
  whatsapp?: string | null
  email?: string | null
  sourceUrl?: string | null
  contactName?: string | null
}

function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status })
}

function validateBody(body: Partial<ImportServiceBody>): string | null {
  if (!body.title?.trim()) return "title required"
  if (body.title.trim().length > 200) return "title too long (max 200)"
  if (!body.categorySlug?.trim()) return "categorySlug required"
  if (!body.description?.trim()) return "description required"
  if (body.description.length > 5000) return "description too long (max 5000)"
  if (!body.city?.trim()) return "city required"
  if (body.city.length > 80) return "city too long (max 80)"
  if (!body.country?.trim()) return "country required"
  if (!ALLOWED_COUNTRIES.includes(body.country.toLowerCase())) {
    return `country must be one of: ${ALLOWED_COUNTRIES.join(", ")}`
  }
  if (!body.phone?.trim()) return "phone required"
  if (body.phone.length > 30) return "phone too long (max 30)"
  return null
}

export async function POST(request: Request) {
  let body: Partial<ImportServiceBody> = {}
  try {
    requireImportToken(request)
    body = (await request.json()) as Partial<ImportServiceBody>

    const err = validateBody(body)
    if (err) {
      await logImport({ type: "service", action: "duplicate", payload: body, request, status: 400 })
      return jsonError(err, 400)
    }

    const title = body.title!.trim()
    const city = body.city!.trim()
    const country = body.country!.toLowerCase()

    // Idempotence : un service "vivant" avec mêmes title/city/country est
    // considéré comme un doublon. On retourne l'existant en 200, sans toucher.
    const existing = await prisma.serviceListing.findFirst({
      where: {
        title: { equals: title, mode: "insensitive" },
        city: { equals: city, mode: "insensitive" },
        countries: { has: country },
        status: "PENDING",
        deletedAt: null,
      },
      select: { id: true, title: true, city: true, status: true },
    })
    if (existing) {
      await logImport({
        type: "service",
        action: "duplicate",
        targetId: existing.id,
        targetSlug: `${existing.title}|${existing.city}|${country}`,
        payload: body,
        request,
        status: 200,
      })
      return NextResponse.json(
        { service: existing, alreadyExists: true },
        { status: 200 },
      )
    }

    const result = await createServiceDraft({
      title,
      categorySlug: body.categorySlug!.trim(),
      description: body.description!.trim(),
      city,
      country,
      phone: body.phone!.trim(),
      languages: body.languages,
      whatsapp: body.whatsapp ?? null,
      email: body.email ?? null,
      sourceUrl: body.sourceUrl ?? null,
      contactName: body.contactName ?? null,
    })

    await logImport({
      type: "service",
      action: "created",
      targetId: result.service.id,
      targetSlug: `${title}|${city}|${country}`,
      payload: body,
      request,
      status: 201,
    })

    return NextResponse.json(
      {
        service: result.service,
        invitation: { token: result.invitation.token, expiresAt: result.expiresAt },
        claimUrl: result.claimUrl,
        alreadyExists: false,
      },
      { status: 201 },
    )
  } catch (e) {
    if (e instanceof ImportAuthError) return importAuthErrorResponse(e)
    const message = e instanceof Error ? e.message : "unknown error"
    await logImport({ type: "service", action: "duplicate", payload: body, request, status: 500 })
    return jsonError(message, 500)
  }
}
