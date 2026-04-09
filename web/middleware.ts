import { NextRequest, NextResponse } from "next/server"
import { verifyWpJwt } from "@/lib/jwt"

const PROTECTED_PATHS = ["/marketplace", "/delivery"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))

  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get("wp_jwt")?.value

  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    await verifyWpJwt(token)
    return NextResponse.next()
  } catch {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ["/marketplace/:path*", "/delivery/:path*"],
}
