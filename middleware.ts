import { NextRequest, NextResponse } from "next/server"

const PROTECTED_PATHS = ["/marketplace", "/delivery"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))

  if (!isProtected) return NextResponse.next()

  // TODO: replace with Auth.js session check (Task 4)
  return NextResponse.next()
}

export const config = {
  matcher: ["/marketplace/:path*", "/delivery/:path*"],
}
