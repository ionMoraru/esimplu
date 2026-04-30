import { randomBytes } from "crypto"
import { headers } from "next/headers"
import type {
  Invitation,
  InvitationStatus,
  InvitationTargetType,
  Prisma,
} from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"

export const INVITATION_TTL_DAYS = 60

export function generateInvitationToken(): string {
  return randomBytes(24).toString("base64url")
}

export function invitationExpiry(now: Date = new Date()): Date {
  const d = new Date(now)
  d.setDate(d.getDate() + INVITATION_TTL_DAYS)
  return d
}

export function claimUrl(token: string, baseUrl?: string): string {
  const base = baseUrl ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000"
  return `${base.replace(/\/$/, "")}/claim/${token}`
}

export async function findActiveInvitation(
  token: string
): Promise<Invitation | null> {
  const invitation = await prisma.invitation.findUnique({ where: { token } })
  if (!invitation) return null
  if (invitation.status !== "PENDING") return null
  if (invitation.expiresAt < new Date()) return null
  return invitation
}

export async function logInvitationEvent(
  invitationId: string,
  type: string,
  payload?: Prisma.InputJsonValue
) {
  const h = await headers()
  await prisma.invitationEvent.create({
    data: {
      invitationId,
      type,
      payload,
      ip:
        h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        h.get("x-real-ip") ??
        null,
      userAgent: h.get("user-agent") ?? null,
    },
  })
}

export type CreateInvitationInput = {
  targetType: InvitationTargetType
  targetId: string
  sourceUrl?: string | null
  contactPhone?: string | null
  contactEmail?: string | null
  contactName?: string | null
  ttlDays?: number
}

export async function createInvitation(
  tx: Prisma.TransactionClient | typeof prisma,
  input: CreateInvitationInput
): Promise<Invitation> {
  const ttl = input.ttlDays ?? INVITATION_TTL_DAYS
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + ttl)

  return tx.invitation.create({
    data: {
      token: generateInvitationToken(),
      targetType: input.targetType,
      targetId: input.targetId,
      expiresAt,
      sourceUrl: input.sourceUrl ?? null,
      contactPhone: input.contactPhone ?? null,
      contactEmail: input.contactEmail ?? null,
      contactName: input.contactName ?? null,
    },
  })
}

export type StatusOf<T extends InvitationStatus> = T
