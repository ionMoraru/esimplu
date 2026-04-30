"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/roles"
import {
  generateInvitationToken,
  invitationExpiry,
  INVITATION_TTL_DAYS,
} from "@/lib/invitations"

export async function regenerateInvitationToken(invitationId: string) {
  await requireAdmin()
  const token = generateInvitationToken()
  const expiresAt = invitationExpiry()
  await prisma.$transaction([
    prisma.invitation.update({
      where: { id: invitationId },
      data: { token, expiresAt, status: "PENDING" },
    }),
    prisma.invitationEvent.create({
      data: {
        invitationId,
        type: "token_regenerated",
        payload: { ttlDays: INVITATION_TTL_DAYS },
      },
    }),
  ])
  revalidatePath("/admin/services/drafts")
  return { token }
}

export async function markOutreachSent(
  invitationId: string,
  method: "sms" | "email" | "phone"
) {
  await requireAdmin()
  await prisma.invitationEvent.create({
    data: {
      invitationId,
      type: "outreach_sent",
      payload: { method },
    },
  })
  revalidatePath("/admin/services/drafts")
}

export async function deleteDraft(invitationId: string) {
  await requireAdmin()
  const inv = await prisma.invitation.findUnique({
    where: { id: invitationId },
    select: { id: true, targetType: true, targetId: true },
  })
  if (!inv) return

  await prisma.$transaction([
    prisma.invitationEvent.create({
      data: { invitationId, type: "deleted_by_admin" },
    }),
    prisma.invitation.update({
      where: { id: invitationId },
      data: { status: "REFUSED", refusedAt: new Date() },
    }),
    ...(inv.targetType === "SERVICE"
      ? [
          prisma.serviceListing.update({
            where: { id: inv.targetId },
            data: { status: "REJECTED", deletedAt: new Date() },
          }),
        ]
      : []),
  ])
  revalidatePath("/admin/services/drafts")
}
