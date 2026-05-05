import { timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"

export class ImportAuthError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = "ImportAuthError"
  }
}

// Compare deux secrets en temps constant (évite les attaques par chronométrage).
// timingSafeEqual exige des buffers de même longueur — on pad par sécurité.
function constantTimeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)
  if (aBuf.length !== bBuf.length) {
    // Comparaison "factice" pour ne pas court-circuiter le timing,
    // puis renvoie false explicitement.
    timingSafeEqual(aBuf, Buffer.alloc(aBuf.length))
    return false
  }
  return timingSafeEqual(aBuf, bBuf)
}

// Vérifie l'en-tête `Authorization: Bearer <token>` contre la var d'env
// `ADMIN_IMPORT_TOKEN`. Throw ImportAuthError sinon (code HTTP attaché).
export function requireImportToken(request: Request): void {
  const expected = process.env.ADMIN_IMPORT_TOKEN
  if (!expected || expected.length < 16) {
    throw new ImportAuthError(
      "ADMIN_IMPORT_TOKEN n'est pas configuré côté serveur (min. 16 caractères)",
      503,
    )
  }
  const header = request.headers.get("authorization") ?? ""
  const match = /^Bearer\s+(.+)$/.exec(header.trim())
  if (!match) {
    throw new ImportAuthError("Header Authorization manquant ou mal formé", 401)
  }
  const provided = match[1].trim()
  if (!constantTimeEqual(provided, expected)) {
    throw new ImportAuthError("Token invalide", 401)
  }
}

export function importAuthErrorResponse(err: ImportAuthError): NextResponse {
  return NextResponse.json({ error: err.message }, { status: err.status })
}
