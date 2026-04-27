import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "./roles"
import type { CourierProfile, SellerProfile, User } from "@/lib/generated/prisma/client"

export async function requireUserSession(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  return user
}

export async function requireAdminSession(): Promise<User> {
  const user = await requireUserSession()
  if (user.role !== "ADMIN") redirect("/dashboard?error=admin-required")
  return user
}

export async function requireSellerSession(): Promise<{ user: User; seller: SellerProfile }> {
  const user = await requireUserSession()
  const seller = await prisma.sellerProfile.findUnique({ where: { userId: user.id } })
  if (!seller) redirect("/dashboard?error=no-seller-profile")
  if (!seller.approved) redirect("/dashboard?error=seller-pending")
  return { user, seller }
}

export async function requireCourierSession(): Promise<{ user: User; courier: CourierProfile }> {
  const user = await requireUserSession()
  const courier = await prisma.courierProfile.findUnique({ where: { userId: user.id } })
  if (!courier) redirect("/dashboard?error=no-courier-profile")
  if (!courier.approved) redirect("/dashboard?error=courier-pending")
  return { user, courier }
}
