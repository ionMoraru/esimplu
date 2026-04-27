import Link from "next/link"
import { requireSellerSession } from "@/lib/auth/server-guards"
import { prisma } from "@/lib/prisma"

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "En attente de paiement",
  PAID: "Payée",
  HANDED_OVER: "Remise au livreur",
  COURIER_DELIVERED: "Livrée (en attente confirmation client)",
  DELIVERED: "Confirmée",
  SETTLED: "Réglée",
  CANCELLED: "Annulée",
  DISPUTED: "Litige",
}

export default async function SellerOrdersPage() {
  const { seller } = await requireSellerSession()
  const orders = await prisma.order.findMany({
    where: { sellerId: seller.id },
    orderBy: { createdAt: "desc" },
    include: { items: true, courier: true },
  })

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mes commandes</h1>
        <Link href="/dashboard/seller" className="text-sm text-emerald-700 underline">
          ← Retour au tableau de bord
        </Link>
      </header>

      {orders.length === 0 ? (
        <p className="text-sm text-zinc-500">Aucune commande pour le moment.</p>
      ) : (
        <ul className="divide-y border rounded">
          {orders.map((o) => {
            const total = (o.productsCents / 100).toFixed(2).replace(".", ",")
            const payout = (o.payoutCents / 100).toFixed(2).replace(".", ",")
            return (
              <li key={o.id} className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Commande #{o.id.slice(-8)}</span>
                  <span className="text-sm text-emerald-700">
                    {STATUS_LABELS[o.status] ?? o.status}
                  </span>
                </div>
                <div className="text-sm text-zinc-700">
                  {o.items.length} produit(s) — Total client {total} € — Votre part {payout} €
                </div>
                <div className="text-xs text-zinc-500">
                  {o.customerName} ({o.customerEmail}) · livraison à {o.deliveryCity}, {o.deliveryCountry.toUpperCase()}
                </div>
                {o.courier && (
                  <div className="text-xs text-zinc-500">Livreur : {o.courier.displayName}</div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
