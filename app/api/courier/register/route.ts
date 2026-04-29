import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { handleApiError, jsonError, readJson } from "@/lib/api/respond"
import { getEmailService, tplAdminNewSellerRequest } from "@/lib/services/email"

const ALLOWED_COUNTRIES = ["fr", "de", "it", "uk", "md", "ro"]

// H3 fix: caps explicites pour éviter le stockage abusif.
const MAX_DISPLAY_NAME = 80
const MAX_CITY = 80
const MAX_PHONE = 30

interface RegisterBody {
  displayName: string
  phone: string
  baseCity?: string
  baseCountry: string
}

export async function POST(request: Request) {
  try {
    const user = await requireUser()

    const existing = await prisma.courierProfile.findUnique({ where: { userId: user.id } })
    if (existing) {
      return jsonError("Vous avez déjà un profil livreur en cours de validation.", 409)
    }

    const body = await readJson<RegisterBody>(request)

    const displayName = body.displayName?.trim()
    if (!displayName || displayName.length < 2 || displayName.length > MAX_DISPLAY_NAME) {
      return jsonError(`Nom commercial requis (2 à ${MAX_DISPLAY_NAME} caractères)`, 400)
    }
    const phone = body.phone?.trim()
    if (!phone || phone.length < 6) {
      return jsonError("Téléphone requis (au moins 6 caractères)", 400)
    }
    if (phone.length > MAX_PHONE) {
      return jsonError(`Téléphone trop long (max ${MAX_PHONE} caractères)`, 400)
    }
    const baseCity = body.baseCity?.trim() || null
    if (baseCity && baseCity.length > MAX_CITY) {
      return jsonError(`Ville trop longue (max ${MAX_CITY} caractères)`, 400)
    }
    const baseCountry = body.baseCountry?.trim().toLowerCase()
    if (!baseCountry || !ALLOWED_COUNTRIES.includes(baseCountry)) {
      return jsonError(`Pays non supporté. Acceptés : ${ALLOWED_COUNTRIES.join(", ")}`, 400)
    }

    const courier = await prisma.courierProfile.create({
      data: {
        userId: user.id,
        displayName,
        phone,
        baseCity,
        baseCountry,
        approved: false,
      },
    })

    // Si l'utilisateur n'est pas déjà SELLER ou ADMIN, on bascule sur COURIER
    // (l'accès aux routes courier reste bloqué tant que approved=false).
    if (user.role !== "SELLER" && user.role !== "ADMIN") {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "COURIER" },
      })
    }

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "https://esimplu.com"
      const reviewUrl = `${baseUrl}/dashboard/admin/couriers`
      const adminEmail = process.env.ADMIN_NOTIFICATIONS_EMAIL
      if (adminEmail) {
        // On réutilise le template seller (générique) en attendant un dédié.
        const tpl = tplAdminNewSellerRequest({
          sellerEmail: user.email ?? "(no email)",
          displayName: `[LIVREUR] ${displayName}`,
          city: body.baseCity?.trim() || "—",
          country: baseCountry,
          reviewUrl,
        })
        await getEmailService().send({ ...tpl, to: adminEmail })
      } else {
         
        console.log(`[courier-register] Nouveau livreur en attente : ${displayName} (${user.email}) — ${reviewUrl}`)
      }
    } catch (err) {
      console.error("[courier-register] notification admin échouée", err)
    }

    return NextResponse.json({ courier }, { status: 201 })
  } catch (err) {
    return handleApiError(err)
  }
}
