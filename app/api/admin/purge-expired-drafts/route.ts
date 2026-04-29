import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

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

  const expired = await prisma.serviceListing.findMany({
    where: {
      status: "DRAFT",
      claimExpiresAt: { lt: now },
    },
    select: { id: true },
  })

  if (expired.length === 0) {
    return NextResponse.json({ purged: 0 })
  }

  const ids = expired.map((d) => d.id)

  await prisma.$transaction([
    prisma.serviceClaimEvent.createMany({
      data: ids.map((serviceId) => ({
        serviceId,
        type: "expired",
        payload: { purgedAt: now.toISOString() },
      })),
    }),
    prisma.serviceListing.updateMany({
      where: { id: { in: ids } },
      data: {
        status: "EXPIRED",
        deletedAt: now,
        claimToken: null,
      },
    }),
  ])

  return NextResponse.json({
    purged: ids.length,
    ids,
  })
}
