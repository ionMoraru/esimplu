import Link from "next/link"
import { requireAdminSession } from "@/lib/auth/server-guards"
import { prisma } from "@/lib/prisma"

export default async function AdminDashboard() {
  await requireAdminSession()

  const [
    pendingSellers,
    pendingCouriers,
    pendingPaymentOrders,
    paidOrders,
    deliveredOrders,
  ] = await Promise.all([
    prisma.sellerProfile.count({ where: { approved: false } }),
    prisma.courierProfile.count({ where: { approved: false } }),
    prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
  ])

  const cards: { href: string; title: string; count: number; cta: string }[] = [
    {
      href: "/dashboard/admin/sellers",
      title: "Vendeurs en attente d'approbation",
      count: pendingSellers,
      cta: "Approuver des vendeurs →",
    },
    {
      href: "/dashboard/admin/couriers",
      title: "Livreurs en attente d'approbation",
      count: pendingCouriers,
      cta: "Approuver des livreurs →",
    },
    {
      href: "/dashboard/admin/orders?status=PENDING_PAYMENT",
      title: "Commandes en attente de paiement",
      count: pendingPaymentOrders,
      cta: "Marquer comme payées →",
    },
    {
      href: "/dashboard/admin/orders?status=PAID",
      title: "Commandes payées sans livreur",
      count: paidOrders,
      cta: "Assigner un livreur →",
    },
    {
      href: "/dashboard/admin/orders?status=DELIVERED",
      title: "Commandes livrées à régler",
      count: deliveredOrders,
      cta: "Libérer l'escrow →",
    },
  ]

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Espace administrateur</h1>
        <Link href="/dashboard" className="text-sm text-emerald-700 underline">
          ← Tableau de bord
        </Link>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="rounded border p-4 hover:bg-muted/30 transition-colors">
            <div className="text-sm text-muted-foreground">{c.title}</div>
            <div className="text-3xl font-semibold mt-1">{c.count}</div>
            <div className="text-sm text-emerald-700 mt-2">{c.cta}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
