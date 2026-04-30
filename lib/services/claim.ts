import { prisma } from "@/lib/prisma"
import { claimUrl, createInvitation, INVITATION_TTL_DAYS } from "@/lib/invitations"

export const SYSTEM_USER_EMAIL = "system@esimplu.com"

// Ré-exports historiques (utilisés par scripts/admin) — l'invitation est désormais
// le source of truth, plus le ServiceListing.
export { claimUrl, INVITATION_TTL_DAYS as CLAIM_TTL_DAYS }

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
  contactName?: string | null
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

  const { service, invitation } = await prisma.$transaction(async (tx) => {
    const service = await tx.serviceListing.create({
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
        status: "PENDING",
      },
    })

    const invitation = await createInvitation(tx, {
      targetType: "SERVICE",
      targetId: service.id,
      sourceUrl: input.sourceUrl ?? null,
      contactPhone: input.phone,
      contactEmail: input.email ?? null,
      contactName: input.contactName ?? null,
    })

    await tx.invitationEvent.create({
      data: {
        invitationId: invitation.id,
        type: "draft_created",
        payload: { sourceUrl: input.sourceUrl ?? null },
      },
    })

    return { service, invitation }
  })

  return {
    service,
    invitation,
    claimUrl: claimUrl(invitation.token),
    expiresAt: invitation.expiresAt,
  }
}
