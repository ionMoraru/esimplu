"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/roles"
import {
  generateClaimToken,
  claimExpiry,
  CLAIM_TTL_DAYS,
} from "@/lib/services/claim"

export async function regenerateClaimToken(serviceId: string) {
  await requireAdmin()
  const token = generateClaimToken()
  await prisma.serviceListing.update({
    where: { id: serviceId },
    data: {
      claimToken: token,
      claimExpiresAt: claimExpiry(),
      status: "DRAFT",
    },
  })
  await prisma.serviceClaimEvent.create({
    data: {
      serviceId,
      type: "token_regenerated",
      payload: { ttlDays: CLAIM_TTL_DAYS },
    },
  })
  revalidatePath("/admin/services/drafts")
  return { token }
}

export async function markOutreachSent(
  serviceId: string,
  method: "sms" | "email" | "phone"
) {
  await requireAdmin()
  await prisma.serviceListing.update({
    where: { id: serviceId },
    data: { claimMethod: method },
  })
  await prisma.serviceClaimEvent.create({
    data: {
      serviceId,
      type: "outreach_sent",
      payload: { method },
    },
  })
  revalidatePath("/admin/services/drafts")
}

export async function deleteDraft(serviceId: string) {
  await requireAdmin()
  await prisma.serviceClaimEvent.create({
    data: {
      serviceId,
      type: "deleted_by_admin",
    },
  })
  await prisma.serviceListing.update({
    where: { id: serviceId },
    data: {
      status: "REJECTED",
      deletedAt: new Date(),
      claimToken: null,
    },
  })
  revalidatePath("/admin/services/drafts")
}
