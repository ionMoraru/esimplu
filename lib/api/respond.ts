import { NextResponse } from "next/server"
import { AuthError, ForbiddenError } from "@/lib/auth/roles"

export function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status })
}

export function handleApiError(err: unknown): NextResponse {
  if (err instanceof ForbiddenError) return jsonError(err.message, 403)
  if (err instanceof AuthError) return jsonError(err.message, err.status)
  if (err instanceof Error) {
    return jsonError(err.message, 400)
  }
  return jsonError("Unknown error", 500)
}

export async function readJson<T = unknown>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T
  } catch {
    throw new Error("Invalid JSON body")
  }
}
