"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { findActiveInvitation, logInvitationEvent } from "@/lib/invitations"

export async function logViewed(token: string) {
  const inv = await findActiveInvitation(token)
  if (!inv) return
  await logInvitationEvent(inv.id, "viewed")
}

export async function publishClaim(token: string) {
  const inv = await findActiveInvitation(token)
  if (!inv) return { error: "not_found" as const }

  const session = await auth()
  const email = session?.user?.email
  if (!email) {
    redirect(`/login?callbackUrl=/claim/${token}?action=publish`)
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return { error: "no_user" as const }

  await prisma.$transaction(async (tx) => {
    if (inv.targetType === "SERVICE") {
      await tx.serviceListing.update({
        where: { id: inv.targetId },
        data: { userId: user.id, status: "PENDING" },
      })
    }
    await tx.invitation.update({
      where: { id: inv.id },
      data: {
        status: "CLAIMED",
        claimedAt: new Date(),
        claimedById: user.id,
      },
    })
  })

  await logInvitationEvent(inv.id, "claimed", {
    userId: user.id,
    via: "publish_as_is",
  })

  revalidatePath("/services")
  redirect(`/services?claimed=${inv.targetId}`)
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
  const inv = await findActiveInvitation(token)
  if (!inv) return { error: "not_found" as const }

  const session = await auth()
  const sessionEmail = session?.user?.email
  if (!sessionEmail) {
    redirect(`/login?callbackUrl=/claim/${token}/edit`)
  }

  const user = await prisma.user.findUnique({ where: { email: sessionEmail } })
  if (!user) return { error: "no_user" as const }

  if (inv.targetType !== "SERVICE") {
    return { error: "unsupported_target" as const }
  }

  const draft = await prisma.serviceListing.findUnique({
    where: { id: inv.targetId },
  })
  if (!draft) return { error: "not_found" as const }

  await prisma.$transaction(async (tx) => {
    await tx.serviceListing.update({
      where: { id: draft.id },
      data: {
        userId: user.id,
        status: "PENDING",
        description: data.description ?? draft.description,
        email: data.email ?? draft.email,
        whatsapp: data.whatsapp ?? draft.whatsapp,
        phone: data.phone ?? draft.phone,
        photo: data.photo ?? draft.photo,
      },
    })
    await tx.invitation.update({
      where: { id: inv.id },
      data: {
        status: "CLAIMED",
        claimedAt: new Date(),
        claimedById: user.id,
      },
    })
  })

  await logInvitationEvent(inv.id, "claimed", {
    userId: user.id,
    via: "edit_and_publish",
    edited: Object.keys(data),
  })

  revalidatePath("/services")
  redirect(`/services?claimed=${inv.targetId}`)
}

export async function refuseClaim(token: string, reason?: string) {
  const inv = await findActiveInvitation(token)
  if (!inv) return { error: "not_found" as const }

  await prisma.$transaction(async (tx) => {
    if (inv.targetType === "SERVICE") {
      await tx.serviceListing.update({
        where: { id: inv.targetId },
        data: { status: "REJECTED", deletedAt: new Date() },
      })
    }
    await tx.invitation.update({
      where: { id: inv.id },
      data: { status: "REFUSED", refusedAt: new Date() },
    })
  })

  await logInvitationEvent(inv.id, "refused_by_owner", {
    reason: reason ?? null,
  })

  redirect(`/claim/${token}/refused`)
}
