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
            <div className="min-w-0 flex-1">
              <div className="font-medium">{s.displayName}</div>
              <div className="text-sm text-muted-foreground">
                {s.user.email} · {s.city ? `${s.city}, ` : ""}
                {s.country.toUpperCase()} · commission {s.commissionPct}%
                {!s.iban && (
                  <span className="ml-2 text-xs text-amber-700">⚠ pas d&apos;IBAN</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={`/dashboard/admin/sellers/${s.id}/edit`}
                className="text-sm text-emerald-700 underline"
              >
                Éditer
              </Link>
              {s.approved ? (
                <span className="text-xs text-emerald-700 font-medium">Approuvé</span>
              ) : (
                <ApproveButton resource="sellers" id={s.id} />
              )}
            </div>
          </li>
        ))}
      </ul>
      {sellers.length === 0 && (
        <p className="text-sm text-muted-foreground">Aucun vendeur enregistré.</p>
      )}
    </main>
  )
}
