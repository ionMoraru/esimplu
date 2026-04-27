import Link from "next/link"
import { requireAdminSession } from "@/lib/auth/server-guards"
import { prisma } from "@/lib/prisma"
import { ApproveButton } from "@/components/dashboard/approve-button"

export default async function AdminSellersPage() {
  await requireAdminSession()
  const sellers = await prisma.sellerProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  })

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Vendeurs</h1>
        <Link href="/dashboard/admin" className="text-sm text-emerald-700 underline">
          ← Espace admin
        </Link>
      </header>

      <ul className="divide-y border rounded">
        {sellers.map((s) => (
          <li key={s.id} className="p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium">{s.displayName}</div>
              <div className="text-sm text-muted-foreground">
                {s.user.email} · {s.city ? `${s.city}, ` : ""}
                {s.country.toUpperCase()} · commission {s.commissionPct}%
              </div>
            </div>
            {s.approved ? (
              <span className="text-xs text-emerald-700 font-medium">Approuvé</span>
            ) : (
              <ApproveButton resource="sellers" id={s.id} />
            )}
          </li>
        ))}
      </ul>
      {sellers.length === 0 && (
        <p className="text-sm text-muted-foreground">Aucun vendeur enregistré.</p>
      )}
    </main>
  )
}
