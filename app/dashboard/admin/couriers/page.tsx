import Link from "next/link"
import { requireAdminSession } from "@/lib/auth/server-guards"
import { prisma } from "@/lib/prisma"
import { ApproveButton } from "@/components/dashboard/approve-button"

export default async function AdminCouriersPage() {
  await requireAdminSession()
  const couriers = await prisma.courierProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  })

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Livreurs</h1>
        <Link href="/dashboard/admin" className="text-sm text-emerald-700 underline">
          ← Espace admin
        </Link>
      </header>

      <ul className="divide-y border rounded">
        {couriers.map((c) => (
          <li key={c.id} className="p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium">{c.displayName}</div>
              <div className="text-sm text-muted-foreground">
                {c.user.email} · {c.phone} · {c.baseCity ? `${c.baseCity}, ` : ""}
                {c.baseCountry.toUpperCase()}
              </div>
            </div>
            {c.approved ? (
              <span className="text-xs text-emerald-700 font-medium">Approuvé</span>
            ) : (
              <ApproveButton resource="couriers" id={c.id} />
            )}
          </li>
        ))}
      </ul>
      {couriers.length === 0 && (
        <p className="text-sm text-muted-foreground">Aucun livreur enregistré.</p>
      )}
    </main>
  )
}
