import { randomBytes } from "node:crypto"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireImportToken, ImportAuthError, importAuthErrorResponse } from "@/lib/api/import-auth"
import { logImport } from "@/lib/api/import-log"
import { generateResetToken, resetUrl } from "@/lib/password-reset"

const ALLOWED_COUNTRIES = ["fr", "de", "it", "uk", "md", "ro"]
const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{0,48}[a-z0-9])?$/
const IBAN_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/
const MAX_DISPLAY_NAME = 80
const MAX_CITY = 80
const MAX_PHONE = 30
const MAX_IBAN = 34
const MAX_DESCRIPTION = 2000

// 30 jours pour permettre d'envoyer le lien par mail / SMS sans être pressé.
// Le PasswordResetToken standard est à 30 min ; on l'étend ici parce que le
// vendeur peut ne pas réagir tout de suite.
const SELLER_CLAIM_TTL_DAYS = 30

interface ImportSellerBody {
  userEmail: string
  userName?: string
  displayName: string
  slug?: string
  city: string
  country: string
  phone?: string
  iban?: string
  description?: string
}

function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status })
}

function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50)
  if (base.length < 2) return `vendeur-${randomBytes(3).toString("hex")}`
  return base
}

function validateBody(b: Partial<ImportSellerBody>): string | null {
  if (!b.userEmail?.trim()) return "userEmail required"
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(b.userEmail.trim())) return "userEmail invalid"
  if (!b.displayName?.trim() || b.displayName.length > MAX_DISPLAY_NAME) {
    return `displayName required (max ${MAX_DISPLAY_NAME})`
  }
  if (!b.city?.trim() || b.city.length > MAX_CITY) return `city required (max ${MAX_CITY})`
  if (!b.country || !ALLOWED_COUNTRIES.includes(b.country.toLowerCase())) {
    return `country must be one of: ${ALLOWED_COUNTRIES.join(", ")}`
  }
  if (b.phone && b.phone.length > MAX_PHONE) return `phone too long (max ${MAX_PHONE})`
  if (b.iban) {
    const cleaned = b.iban.replace(/\s+/g, "").toUpperCase()
    if (cleaned.length > MAX_IBAN) return `iban too long (max ${MAX_IBAN})`
    if (!IBAN_REGEX.test(cleaned)) return "iban format invalid"
  }
  if (b.description && b.description.length > MAX_DESCRIPTION) {
    return `description too long (max ${MAX_DESCRIPTION})`
  }
  return null
}

async function buildClaimUrl(userId: string): Promise<string> {
  const token = generateResetToken()
  const expiresAt = new Date(Date.now() + SELLER_CLAIM_TTL_DAYS * 24 * 60 * 60 * 1000)
  await prisma.passwordResetToken.create({
    data: { token, userId, expiresAt },
  })
  return resetUrl(token)
}

export async function POST(request: Request) {
  let body: Partial<ImportSellerBody> = {}
  try {
    requireImportToken(request)
    body = (await request.json()) as Partial<ImportSellerBody>

    const err = validateBody(body)
    if (err) {
      await logImport({ type: "seller", action: "duplicate", payload: body, request, status: 400 })
      return jsonError(err, 400)
    }

    const email = body.userEmail!.trim().toLowerCase()
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { sellerProfile: true },
    })

    // Cas 1 : User + SellerProfile existent déjà → 200 idempotent.
    if (existingUser?.sellerProfile) {
      await logImport({
        type: "seller",
        action: "duplicate",
        targetId: existingUser.sellerProfile.id,
        targetSlug: existingUser.sellerProfile.slug,
        payload: body,
        request,
        status: 200,
      })
      return NextResponse.json(
        { seller: existingUser.sellerProfile, alreadyExists: true },
        { status: 200 },
      )
    }

    // Calcul du slug avec dé-duplication numérique.
    const desiredSlug = body.slug?.trim().toLowerCase() ?? slugify(body.displayName!)
    if (!SLUG_REGEX.test(desiredSlug)) {
      await logImport({ type: "seller", action: "duplicate", payload: body, request, status: 400 })
      return jsonError("slug invalid (lowercase letters, digits, hyphens)", 400)
    }
    let finalSlug = desiredSlug
    let attempt = 1
    while (
      attempt < 100 &&
      (await prisma.sellerProfile.findUnique({ where: { slug: finalSlug } }))
    ) {
      attempt += 1
      finalSlug = `${desiredSlug}-${attempt}`
    }

    const ibanClean = body.iban?.replace(/\s+/g, "").toUpperCase() ?? null

    // Création User (si nouveau) + SellerProfile dans une transaction.
    const seller = await prisma.$transaction(async (tx) => {
      const user =
        existingUser ??
        (await tx.user.create({
          data: {
            email,
            name: body.userName?.trim() ?? null,
            // Pas de password — le claim URL servira à le poser via /reset-password.
            password: null,
            role: "SELLER",
          },
        }))

      // H1 fix register/route.ts : ne JAMAIS rétrograder un ADMIN/COURIER.
      if (existingUser && existingUser.role === "CUSTOMER") {
        await tx.user.update({ where: { id: user.id }, data: { role: "SELLER" } })
      }

      return tx.sellerProfile.create({
        data: {
          userId: user.id,
          displayName: body.displayName!.trim(),
          slug: finalSlug,
          city: body.city!.trim(),
          country: body.country!.toLowerCase(),
          phone: body.phone?.trim() ?? null,
          iban: ibanClean,
          description: body.description?.trim() ?? null,
          approved: false,
        },
      })
    })

    // Génère un claim URL longue durée (30 j) pour que le vendeur pose son
    // mot de passe et active son compte.
    const claimUrl = await buildClaimUrl(seller.userId)

    await logImport({
      type: "seller",
      action: "created",
      targetId: seller.id,
      targetSlug: seller.slug,
      payload: body,
      request,
      status: 201,
    })

    return NextResponse.json(
      { seller, claimUrl, alreadyExists: false },
      { status: 201 },
    )
  } catch (e) {
    if (e instanceof ImportAuthError) return importAuthErrorResponse(e)
    const message = e instanceof Error ? e.message : "unknown error"
    await logImport({ type: "seller", action: "duplicate", payload: body, request, status: 500 })
    return jsonError(message, 500)
  }
}
