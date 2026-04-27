import Link from "next/link"
import { requireCourierSession } from "@/lib/auth/server-guards"
import { prisma } from "@/lib/prisma"
import { CourierOrderActions } from "@/components/dashboard/courier-order-actions"

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "En attente de paiement",
  PAID: "Payée — à prendre en charge",
  HANDED_OVER: "Prise en charge — à livrer",
  COURIER_DELIVERED: "Livrée — en attente confirmation client",
  DELIVERED: "Confirmée par le client",
  SETTLED: "Réglée",
  CANCELLED: "Annulée",
  DISPUTED: "Litige",
}

export default async function CourierDashboard() {
  const { courier } = await requireCourierSession()
  const orders = await prisma.order.findMany({
    where: { courierId: courier.id, status: { in: ["PAID", "HANDED_OVER", "COURIER_DELIVERED"] } },
    orderBy: { createdAt: "desc" },
    include: { items: true, seller: true },
  })

  const archive = await prisma.order.findMany({
    where: { courierId: courier.id, status: { in: ["DELIVERED", "SETTLED"] } },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { seller: true },
  })

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Espace livreur — {courier.displayName}</h1>
          {courier.baseCity && (
            <p className="text-sm text-muted-foreground">
              Base : {courier.baseCity}, {courier.baseCountry.toUpperCase()}
            </p>
          )}
        </div>
        <Link href="/dashboard" className="text-sm text-emerald-700 underline">
          ← Tableau de bord
        </Link>
      </header>

      <section>
        <h2 className="text-lg font-medium mb-3">À traiter ({orders.length})</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune commande en cours.</p>
        ) : (
          <ul className="space-y-3">
            {orders.map((o) => {
              const total = (o.productsCents / 100).toFixed(2).replace(".", ",")
              return (
                <li key={o.id} className="rounded border p-4 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium">Commande #{o.id.slice(-8)}</div>
                      <div className="text-sm text-emerald-700">{STATUS_LABELS[o.status]}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{total} €</div>
                      <div className="text-xs text-muted-foreground">{o.items.length} produit(s)</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>
                      <span className="font-medium text-foreground">Récupérer chez :</span>{" "}
                      {o.seller.displayName}
                      {o.seller.city && `, ${o.seller.city}`}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Livrer à :</span>{" "}
                      {o.customerName} — {o.customerPhone}
                      <br />
                      {o.deliveryAddress}, {o.deliveryCity}, {o.deliveryCountry.toUpperCase()}
                    </div>
                    {o.notes && (
                      <div>
                        <span className="font-medium text-foreground">Notes :</span> {o.notes}
                      </div>
                    )}
                  </div>
                  <CourierOrderActions orderId={o.id} status={o.status} />
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {archive.length > 0 && (
        <section>
          <h2 className="text-lg font-medium mb-3">Archives</h2>
          <ul className="space-y-1 text-sm">
            {archive.map((o) => (
              <li key={o.id} className="flex justify-between text-muted-foreground">
                <span>
                  #{o.id.slice(-8)} · {o.seller.displayName}
                </span>
                <span>{STATUS_LABELS[o.status]}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
