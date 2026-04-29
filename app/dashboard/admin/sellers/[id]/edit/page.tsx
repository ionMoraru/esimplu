import Link from "next/link"
import { notFound } from "next/navigation"
import { requireAdminSession } from "@/lib/auth/server-guards"
import { prisma } from "@/lib/prisma"
import { SellerEditForm } from "@/components/dashboard/seller-edit-form"

export default async function AdminSellerEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdminSession()
  const { id } = await params

  const seller = await prisma.sellerProfile.findUnique({
    where: { id },
    include: { user: true },
  })
  if (!seller) notFound()

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Éditer le vendeur</h1>
        <Link href="/dashboard/admin/sellers" className="text-sm text-emerald-700 underline">
          ← Liste vendeurs
        </Link>
      </header>

      <p className="text-sm text-muted-foreground">
        {seller.user.email} ·{" "}
        {seller.approved ? (
          <span className="text-emerald-700 font-medium">Approuvé</span>
        ) : (
          <span className="text-amber-700 font-medium">En attente d&apos;approbation</span>
        )}
      </p>

      <SellerEditForm
        initial={{
          id: seller.id,
          displayName: seller.displayName,
          city: seller.city ?? "",
          country: seller.country,
          phone: seller.phone ?? "",
          iban: seller.iban ?? "",
          commissionPct: seller.commissionPct,
          approved: seller.approved,
        }}
      />
    </main>
  )
}
