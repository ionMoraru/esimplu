import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { handleApiError, jsonError, readJson } from "@/lib/api/respond"
import { getEmailService, tplAdminNewSellerRequest } from "@/lib/services/email"

const ALLOWED_COUNTRIES = ["fr", "de", "it", "uk", "md", "ro"]
// H2 fix: slug accepte 1 à 50 chars (lettres minuscules, chiffres, tirets), pas
// de tiret en début/fin. Permet displayName de 2 chars sans rejet incompréhensible.
const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{0,48}[a-z0-9])?$/

// H3 fix: caps explicites pour éviter l'accumulation silencieuse en DB.
const MAX_DISPLAY_NAME = 80
const MAX_CITY = 80
const MAX_PHONE = 30
const MAX_IBAN = 34 // norme ISO 13616
const MAX_DESCRIPTION = 2000

// H4 fix: regex IBAN structurelle. Ne valide PAS la checksum mod-97 (à faire
// au moment du payout), mais bloque les valeurs garbage type "<script>".
const IBAN_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/

interface RegisterBody {
  displayName: string
  slug?: string
  city: string
  country: string
  phone?: string
  iban?: string
  description?: string
}

function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50)
  // H2 fix: si le résultat est vide ou < 2 chars (ex: displayName "@@"),
  // fallback sur un slug aléatoire pour ne pas casser l'inscription.
  if (base.length < 2) {
    return `vendeur-${Math.random().toString(36).slice(2, 8)}`
  }
  return base
}

export async function POST(request: Request) {
  try {
    const user = await requireUser()

    // Un user ne peut avoir qu'un seul SellerProfile.
    const existing = await prisma.sellerProfile.findUnique({ where: { userId: user.id } })
    if (existing) {
      return jsonError("Vous avez déjà un profil vendeur en cours de validation.", 409)
    }

    const body = await readJson<RegisterBody>(request)

    const displayName = body.displayName?.trim()
    if (!displayName || displayName.length < 2 || displayName.length > MAX_DISPLAY_NAME) {
      return jsonError(`Nom commercial requis (2 à ${MAX_DISPLAY_NAME} caractères)`, 400)
    }
    const city = body.city?.trim()
    if (!city) return jsonError("Ville requise", 400)
    if (city.length > MAX_CITY) {
      return jsonError(`Ville trop longue (max ${MAX_CITY} caractères)`, 400)
    }
    const country = body.country?.trim().toLowerCase()
    if (!country || !ALLOWED_COUNTRIES.includes(country)) {
      return jsonError(`Pays non supporté. Acceptés : ${ALLOWED_COUNTRIES.join(", ")}`, 400)
    }
    const phone = body.phone?.trim() || null
    if (phone && phone.length > MAX_PHONE) {
      return jsonError(`Téléphone trop long (max ${MAX_PHONE} caractères)`, 400)
    }
    const iban = body.iban?.trim().replace(/\s+/g, "").toUpperCase() || null
    if (iban) {
      if (iban.length > MAX_IBAN) {
        return jsonError(`IBAN trop long (max ${MAX_IBAN} caractères)`, 400)
      }
      if (!IBAN_REGEX.test(iban)) {
        return jsonError("Format IBAN invalide (ex: FR76...)", 400)
      }
    }
    const description = body.description?.trim() || null
    if (description && description.length > MAX_DESCRIPTION) {
      return jsonError(`Description trop longue (max ${MAX_DESCRIPTION} caractères)`, 400)
    }

    let slug = body.slug?.trim().toLowerCase()
    if (!slug) slug = slugify(displayName)
    if (!SLUG_REGEX.test(slug)) {
      return jsonError("Slug invalide (lettres minuscules, chiffres, tirets uniquement)", 400)
    }
    // Unicité slug : si déjà pris, on suffixe avec un compteur.
    let candidate = slug
    let attempt = 1
    // Limite raisonnable pour éviter une boucle pathologique.
    while (attempt < 100 && (await prisma.sellerProfile.findUnique({ where: { slug: candidate } }))) {
      attempt += 1
      candidate = `${slug}-${attempt}`
    }
    slug = candidate

    const seller = await prisma.sellerProfile.create({
      data: {
        userId: user.id,
        displayName,
        slug,
        city,
        country,
        phone,
        iban,
        description,
        approved: false,
      },
    })

    // H1 fix: ne JAMAIS rétrograder un ADMIN ou un COURIER existant.
    // Bascule SELLER uniquement pour les CUSTOMER (rôle par défaut).
    // L'accès aux routes seller reste de toute façon bloqué tant que
    // approved=false (cf. requireSeller).
    if (user.role === "CUSTOMER") {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "SELLER" },
      })
    }

    // Notifie l'admin (mode console pour l'instant). En prod, l'email
    // partira via le mailer configuré quand on aura un EmailService réel.
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "https://esimplu.com"
      const reviewUrl = `${baseUrl}/dashboard/admin/sellers/${seller.id}/edit`
      const adminEmail = process.env.ADMIN_NOTIFICATIONS_EMAIL
      if (adminEmail) {
        const tpl = tplAdminNewSellerRequest({
          sellerEmail: user.email ?? "(no email)",
          displayName,
          city,
          country,
          reviewUrl,
        })
        await getEmailService().send({ ...tpl, to: adminEmail })
      } else {
        // Pas d'email admin configuré : log brut.
         
        console.log(`[seller-register] Nouveau vendeur en attente : ${displayName} (${user.email}) — ${reviewUrl}`)
      }
    } catch (err) {
      console.error("[seller-register] notification admin échouée", err)
    }

    return NextResponse.json({ seller }, { status: 201 })
  } catch (err) {
    return handleApiError(err)
  }
}
