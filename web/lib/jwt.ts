import { jwtVerify } from "jose"
import type { WpJwtPayload } from "@esimplu/types"

const getSecret = () => {
  const key = process.env.JWT_SECRET_KEY
  if (!key) throw new Error("JWT_SECRET_KEY is not set")
  return new TextEncoder().encode(key)
}

export async function verifyWpJwt(token: string): Promise<WpJwtPayload> {
  const { payload } = await jwtVerify(token, getSecret(), {
    algorithms: ["HS256"],
  })
  return payload as unknown as WpJwtPayload
}

export function extractJwtFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(/wp_jwt=([^;]+)/)
  return match ? match[1] : null
}
