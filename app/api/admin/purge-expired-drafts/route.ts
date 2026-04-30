import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

// Cron : passe les Invitations PENDING dont expiresAt < now en EXPIRED, et
// soft-delete la cible si applicable (ex: ServiceListing → status REJECTED).
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 500 }
    )
  }

  const provided = req.headers.get("x-cron-secret")
  if (provided !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const now = new Date()

  const expired = await prisma.invitation.findMany({
    where: {
      status: "PENDING",
      expiresAt: { lt: now },
    },
    select: { id: true, targetType: true, targetId: true },
  })

  if (expired.length === 0) {
    return NextResponse.json({ purged: 0 })
  }

  const ids = expired.map((i) => i.id)
  const serviceIds = expired
    .filter((i) => i.targetType === "SERVICE")
    .map((i) => i.targetId)

  await prisma.$transaction([
    prisma.invitationEvent.createMany({
      data: ids.map((invitationId) => ({
        invitationId,
        type: "expired",
        payload: { purgedAt: now.toISOString() },
      })),
    }),
    prisma.invitation.updateMany({
      where: { id: { in: ids } },
      data: { status: "EXPIRED", expiredAt: now },
    }),
    ...(serviceIds.length
      ? [
          prisma.serviceListing.updateMany({
            where: { id: { in: serviceIds } },
            data: { status: "REJECTED", deletedAt: now },
          }),
        ]
      : []),
  ])

  return NextResponse.json({
    purged: ids.length,
    invitationIds: ids,
  })
}
