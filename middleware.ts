import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // For now, just pass through all requests
  // Auth.js session checks will be done in server components/API routes
  // The middleware can't import Prisma (Node.js modules not available in Edge Runtime)
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
