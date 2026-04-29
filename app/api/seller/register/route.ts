import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { handleApiError, jsonError, readJson } from "@/lib/api/respond"
import { getEmailService, tplAdminNewSellerRequest } from "@/lib/services/email"

const ALLOWED_COUNTRIES = ["fr", "de", "it", "uk", "md", "ro"]
const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{1,48}[a-z0-9])?$/

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
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50)
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
    if (!displayName || displayName.length < 2 || displayName.length > 80) {
      return jsonError("Nom commercial requis (2 à 80 caractères)", 400)
    }
    const city = body.city?.trim()
    if (!city) return jsonError("Ville requise", 400)
    const country = body.country?.trim().toLowerCase()
    if (!country || !ALLOWED_COUNTRIES.includes(country)) {
      return jsonError(`Pays non supporté. Acceptés : ${ALLOWED_COUNTRIES.join(", ")}`, 400)
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
        phone: body.phone?.trim() || null,
        iban: body.iban?.trim().replace(/\s+/g, "") || null,
        description: body.description?.trim() || null,
        approved: false,
      },
    })

    // On bascule le rôle SELLER tout de suite — l'accès aux routes seller
    // reste bloqué tant que `approved=false` (cf. requireSeller).
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "SELLER" },
    })

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
