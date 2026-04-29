"use server"

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function logEvent(
  serviceId: string,
  type: string,
  payload?: Record<string, unknown>
) {
  const h = await headers()
  await prisma.serviceClaimEvent.create({
    data: {
      serviceId,
      type,
      payload: payload ? (payload as object) : undefined,
      ip:
        h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        h.get("x-real-ip") ??
        null,
      userAgent: h.get("user-agent") ?? null,
    },
  })
}

async function findClaimable(token: string) {
  const draft = await prisma.serviceListing.findUnique({
    where: { claimToken: token },
  })
  if (!draft) return null
  if (draft.status !== "DRAFT") return null
  if (draft.claimExpiresAt && draft.claimExpiresAt < new Date()) return null
  return draft
}

export async function publishClaim(token: string) {
  const draft = await findClaimable(token)
  if (!draft) return { error: "not_found" as const }

  const session = await auth()
  const email = session?.user?.email
  if (!email) {
    redirect(`/login?callbackUrl=/services/claim/${token}?action=publish`)
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return { error: "no_user" as const }

  await prisma.serviceListing.update({
    where: { id: draft.id },
    data: {
      userId: user.id,
      status: "PUBLISHED",
      claimedAt: new Date(),
      claimToken: null,
    },
  })
  await logEvent(draft.id, "claimed", {
    userId: user.id,
    via: "publish_as_is",
  })

  revalidatePath("/services")
  redirect(`/services?claimed=${draft.id}`)
}

export async function refuseClaim(token: string, reason?: string) {
  const draft = await findClaimable(token)
  if (!draft) return { error: "not_found" as const }

  await prisma.serviceListing.update({
    where: { id: draft.id },
    data: {
      status: "OWNER_REFUSED",
      deletedAt: new Date(),
      claimToken: null,
    },
  })
  await logEvent(draft.id, "deleted_by_owner", { reason: reason ?? null })

  redirect(`/services/claim/${token}/refused`)
}

export async function updateAndPublishClaim(
  token: string,
  data: {
    description?: string
    email?: string
    whatsapp?: string
    phone?: string
    photo?: string
  }
) {
  const draft = await findClaimable(token)
  if (!draft) return { error: "not_found" as const }

  const session = await auth()
  const sessionEmail = session?.user?.email
  if (!sessionEmail) {
    redirect(`/login?callbackUrl=/services/claim/${token}/edit`)
  }

  const user = await prisma.user.findUnique({ where: { email: sessionEmail } })
  if (!user) return { error: "no_user" as const }

  await prisma.serviceListing.update({
    where: { id: draft.id },
    data: {
      userId: user.id,
      status: "PUBLISHED",
      claimedAt: new Date(),
      claimToken: null,
      description: data.description ?? draft.description,
      email: data.email ?? draft.email,
      whatsapp: data.whatsapp ?? draft.whatsapp,
      phone: data.phone ?? draft.phone,
      photo: data.photo ?? draft.photo,
    },
  })
  await logEvent(draft.id, "claimed", {
    userId: user.id,
    via: "edit_and_publish",
    edited: Object.keys(data),
  })

  revalidatePath("/services")
  redirect(`/services?claimed=${draft.id}`)
}

export async function logViewed(token: string) {
  const draft = await prisma.serviceListing.findUnique({
    where: { claimToken: token },
    select: { id: true, status: true },
  })
  if (!draft || draft.status !== "DRAFT") return
  await logEvent(draft.id, "viewed")
}
