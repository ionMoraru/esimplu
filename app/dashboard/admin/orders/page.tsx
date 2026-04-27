import Link from "next/link"
import { requireAdminSession } from "@/lib/auth/server-guards"
import { prisma } from "@/lib/prisma"
import { AdminOrderActions } from "@/components/dashboard/admin-order-actions"
import type { OrderStatus, Prisma } from "@/lib/generated/prisma/client"

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "En attente de paiement",
  PAID: "Payée",
  HANDED_OVER: "Remise au livreur",
  COURIER_DELIVERED: "Livraison déclarée",
  DELIVERED: "Confirmée client",
  SETTLED: "Réglée",
  CANCELLED: "Annulée",
  DISPUTED: "Litige",
}

const VALID_STATUSES = Object.keys(STATUS_LABELS) as OrderStatus[]

function isValidStatus(value: string | undefined): value is OrderStatus {
  return value !== undefined && (VALID_STATUSES as string[]).includes(value)
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  await requireAdminSession()
  const sp = await searchParams
  // H6 fix: on valide la query string contre l'enum, sinon Prisma jette un 500
  // brut (DOS ciblé). Une valeur invalide → ignorée, on retourne tout.
  const filter: Prisma.OrderWhereInput = isValidStatus(sp.status) ? { status: sp.status } : {}

  const orders = await prisma.order.findMany({
    where: filter,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { items: true, seller: true, courier: true },
  })

  const couriers = await prisma.courierProfile.findMany({
    where: { approved: true },
    select: { id: true, displayName: true, baseCity: true, baseCountry: true },
  })

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Commandes
          {sp.status && <span className="text-sm font-normal ml-2">— filtre : {(isValidStatus(sp.status) ? STATUS_LABELS[sp.status] : undefined) ?? sp.status}</span>}
        </h1>
        <Link href="/dashboard/admin" className="text-sm text-emerald-700 underline">
          ← Espace admin
        </Link>
      </header>

      <div className="flex gap-2 flex-wrap text-xs">
        <Link className="rounded border px-2 py-1 hover:bg-muted/30" href="/dashboard/admin/orders">
          Toutes
        </Link>
        {Object.entries(STATUS_LABELS).map(([s, label]) => (
          <Link
            key={s}
            className={`rounded border px-2 py-1 hover:bg-muted/30 ${sp.status === s ? "bg-muted" : ""}`}
            href={`/dashboard/admin/orders?status=${s}`}
          >
            {label}
          </Link>
        ))}
      </div>

      <ul className="space-y-3">
        {orders.map((o) => {
          const total = (o.productsCents / 100).toFixed(2).replace(".", ",")
          const payout = (o.payoutCents / 100).toFixed(2).replace(".", ",")
          const commission = (o.commissionCents / 100).toFixed(2).replace(".", ",")
          return (
            <li key={o.id} className="rounded border p-4 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium">Commande #{o.id.slice(-8)}</div>
                  <div className="text-sm text-emerald-700">{STATUS_LABELS[o.status]}</div>
                </div>
                <div className="text-right text-sm">
                  <div>Total {total} €</div>
                  <div className="text-xs text-muted-foreground">commission {commission} € · vendeur {payout} €</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>
                  <span className="font-medium text-foreground">Vendeur :</span>{" "}
                  {o.seller.displayName}
                </div>
                <div>
                  <span className="font-medium text-foreground">Client :</span>{" "}
                  {o.customerName} ({o.customerEmail}, {o.customerPhone})
                </div>
                <div>
                  <span className="font-medium text-foreground">Livraison :</span>{" "}
                  {o.deliveryAddress}, {o.deliveryCity}, {o.deliveryCountry.toUpperCase()}
                </div>
                {o.courier && (
                  <div>
                    <span className="font-medium text-foreground">Livreur :</span>{" "}
                    {o.courier.displayName}
                  </div>
                )}
              </div>
              <AdminOrderActions
                orderId={o.id}
                status={o.status}
                hasCourier={!!o.courierId}
                couriers={couriers}
              />
            </li>
          )
        })}
        {orders.length === 0 && (
          <li className="text-sm text-muted-foreground">Aucune commande pour ce filtre.</li>
        )}
      </ul>
    </main>
  )
}
