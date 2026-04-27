import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { CourierProfile, SellerProfile, User, UserRole } from "@/lib/generated/prisma/client"

export class AuthError extends Error {
  constructor(message: string, public readonly status = 401) {
    super(message)
    this.name = "AuthError"
  }
}

export class ForbiddenError extends AuthError {
  constructor(message = "Forbidden") {
    super(message, 403)
    this.name = "ForbiddenError"
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await auth()
  const email = session?.user?.email
  if (!email) return null
  return prisma.user.findUnique({ where: { email } })
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) throw new AuthError("Authentication required")
  return user
}

export async function requireRole(
  role: UserRole,
  opts: { allowAdmin?: boolean } = {},
): Promise<User> {
  const user = await requireUser()
  if (user.role === role) return user
  // C2 fix: l'ADMIN n'est plus un substitut universel. Si un appelant veut le
  // tolérer, il le déclare explicitement via { allowAdmin: true }.
  if (opts.allowAdmin && user.role === "ADMIN") return user
  throw new ForbiddenError(`Role ${role} required`)
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser()
  if (user.role !== "ADMIN") throw new ForbiddenError("Admin role required")
  return user
}

export async function requireSeller(): Promise<{ user: User; seller: SellerProfile }> {
  const user = await requireUser()
  const seller = await prisma.sellerProfile.findUnique({ where: { userId: user.id } })
  if (!seller) throw new ForbiddenError("Seller profile required")
  if (!seller.approved) throw new ForbiddenError("Seller account not approved yet")
  return { user, seller }
}

export async function requireCourier(): Promise<{ user: User; courier: CourierProfile }> {
  const user = await requireUser()
  const courier = await prisma.courierProfile.findUnique({ where: { userId: user.id } })
  if (!courier) throw new ForbiddenError("Courier profile required")
  if (!courier.approved) throw new ForbiddenError("Courier account not approved yet")
  return { user, courier }
}
