import { createHash } from "node:crypto"
import { prisma } from "@/lib/prisma"

export type ImportType = "service" | "seller" | "product" | "courier" | "trip"
export type ImportAction = "created" | "duplicate"

export interface LogImportInput {
  type: ImportType
  action: ImportAction
  targetId?: string | null
  targetSlug?: string | null
  payload: unknown
  request: Request
  status: number
}

// Hash SHA-256 du payload JSON. Sert à détecter les rejouages exacts dans la
// table d'audit sans stocker les données potentiellement sensibles en clair.
function hashPayload(payload: unknown): string {
  const json = JSON.stringify(payload ?? {})
  return createHash("sha256").update(json).digest("hex")
}

// Best-effort : on ne veut jamais qu'une erreur de log fasse échouer un import.
export async function logImport(input: LogImportInput): Promise<void> {
  try {
    const ip =
      input.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      input.request.headers.get("x-real-ip") ??
      null
    const userAgent = input.request.headers.get("user-agent") ?? null
    await prisma.importLog.create({
      data: {
        type: input.type,
        action: input.action,
        targetId: input.targetId ?? null,
        targetSlug: input.targetSlug ?? null,
        payloadHash: hashPayload(input.payload),
        ip,
        userAgent,
        status: input.status,
      },
    })
  } catch (err) {
    console.error("[import-log] failed to write audit row", err)
  }
}
