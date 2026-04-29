import { randomBytes } from "crypto"
import { prisma } from "@/lib/prisma"

export const CLAIM_TTL_DAYS = 60
export const SYSTEM_USER_EMAIL = "system@esimplu.com"

export function generateClaimToken(): string {
  return randomBytes(24).toString("base64url")
}

export function claimUrl(token: string, baseUrl?: string): string {
  const base = baseUrl ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000"
  return `${base.replace(/\/$/, "")}/services/claim/${token}`
}

export function claimExpiry(now: Date = new Date()): Date {
  const d = new Date(now)
  d.setDate(d.getDate() + CLAIM_TTL_DAYS)
  return d
}

export type DraftInput = {
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
}

export async function createServiceDraft(input: DraftInput) {
  const systemUser = await prisma.user.findUnique({
    where: { email: SYSTEM_USER_EMAIL },
  })
  if (!systemUser) {
    throw new Error(
      `System user not found (${SYSTEM_USER_EMAIL}). Run seed first.`
    )
  }

  const category = await prisma.serviceCategory.findUnique({
    where: { slug: input.categorySlug },
  })
  if (!category) {
    throw new Error(`Category not found: ${input.categorySlug}`)
  }

  const token = generateClaimToken()
  const expiresAt = claimExpiry()

  const service = await prisma.serviceListing.create({
    data: {
      userId: systemUser.id,
      categoryId: category.id,
      title: input.title,
      description: input.description,
      languages: input.languages ?? ["ro"],
      city: input.city,
      countries: [input.country],
      phone: input.phone,
      email: input.email ?? null,
      whatsapp: input.whatsapp ?? null,
      photo: null,
      status: "DRAFT",
      claimToken: token,
      claimExpiresAt: expiresAt,
      sourceUrl: input.sourceUrl ?? null,
      events: {
        create: {
          type: "draft_created",
          payload: { sourceUrl: input.sourceUrl ?? null },
        },
      },
    },
  })

  return { service, claimUrl: claimUrl(token), expiresAt }
}
