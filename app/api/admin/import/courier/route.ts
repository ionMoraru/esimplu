import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireImportToken, ImportAuthError, importAuthErrorResponse } from "@/lib/api/import-auth"
import { logImport } from "@/lib/api/import-log"
import { generateResetToken, resetUrl } from "@/lib/password-reset"

const ALLOWED_COUNTRIES = ["fr", "de", "it", "uk", "md", "ro"]
const MAX_DISPLAY_NAME = 80
const MAX_CITY = 80
const MAX_PHONE = 30
const COURIER_CLAIM_TTL_DAYS = 30

interface ImportCourierBody {
  userEmail: string
  userName?: string
  displayName: string
  phone: string
  baseCity?: string
  baseCountry: string
}

function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status })
}

function validateBody(b: Partial<ImportCourierBody>): string | null {
  if (!b.userEmail?.trim()) return "userEmail required"
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(b.userEmail.trim())) return "userEmail invalid"
  if (!b.displayName?.trim() || b.displayName.length > MAX_DISPLAY_NAME) {
    return `displayName required (max ${MAX_DISPLAY_NAME})`
  }
  if (!b.phone?.trim() || b.phone.length < 6 || b.phone.length > MAX_PHONE) {
    return `phone required (6-${MAX_PHONE} chars)`
  }
  if (b.baseCity && b.baseCity.length > MAX_CITY) return `baseCity too long (max ${MAX_CITY})`
  if (!b.baseCountry || !ALLOWED_COUNTRIES.includes(b.baseCountry.toLowerCase())) {
    return `baseCountry must be one of: ${ALLOWED_COUNTRIES.join(", ")}`
  }
  return null
}

async function buildClaimUrl(userId: string): Promise<string> {
  const token = generateResetToken()
  const expiresAt = new Date(Date.now() + COURIER_CLAIM_TTL_DAYS * 24 * 60 * 60 * 1000)
  await prisma.passwordResetToken.create({
    data: { token, userId, expiresAt },
  })
  return resetUrl(token)
}

export async function POST(request: Request) {
  let body: Partial<ImportCourierBody> = {}
  try {
    requireImportToken(request)
    body = (await request.json()) as Partial<ImportCourierBody>

    const err = validateBody(body)
    if (err) {
      await logImport({ type: "courier", action: "duplicate", payload: body, request, status: 400 })
      return jsonError(err, 400)
    }

    const email = body.userEmail!.trim().toLowerCase()
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { courierProfile: true },
    })

    if (existingUser?.courierProfile) {
      await logImport({
        type: "courier",
        action: "duplicate",
        targetId: existingUser.courierProfile.id,
        targetSlug: email,
        payload: body,
        request,
        status: 200,
      })
      return NextResponse.json(
        { courier: existingUser.courierProfile, alreadyExists: true },
        { status: 200 },
      )
    }

    const courier = await prisma.$transaction(async (tx) => {
      const user =
        existingUser ??
        (await tx.user.create({
          data: {
            email,
            name: body.userName?.trim() ?? null,
            password: null,
            role: "COURIER",
          },
        }))

      // Pas de rétrogradation d'un SELLER/ADMIN existant.
      if (existingUser && existingUser.role !== "SELLER" && existingUser.role !== "ADMIN") {
        await tx.user.update({ where: { id: user.id }, data: { role: "COURIER" } })
      }

      return tx.courierProfile.create({
        data: {
          userId: user.id,
          displayName: body.displayName!.trim(),
          phone: body.phone!.trim(),
          baseCity: body.baseCity?.trim() ?? null,
          baseCountry: body.baseCountry!.toLowerCase(),
          approved: false,
        },
      })
    })

    const claimUrl = await buildClaimUrl(courier.userId)

    await logImport({
      type: "courier",
      action: "created",
      targetId: courier.id,
      targetSlug: email,
      payload: body,
      request,
      status: 201,
    })

    return NextResponse.json(
      { courier, claimUrl, alreadyExists: false },
      { status: 201 },
    )
  } catch (e) {
    if (e instanceof ImportAuthError) return importAuthErrorResponse(e)
    const message = e instanceof Error ? e.message : "unknown error"
    await logImport({ type: "courier", action: "duplicate", payload: body, request, status: 500 })
    return jsonError(message, 500)
  }
}
