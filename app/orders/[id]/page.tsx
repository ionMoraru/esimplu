import Link from "next/link"
import { notFound } from "next/navigation"
import { requireUserSession } from "@/lib/auth/server-guards"
import { getOrderForUser } from "@/lib/services/orders"
import { CustomerConfirmDelivery } from "@/components/marketplace/customer-confirm-delivery"

const STATUS_TIMELINE: { status: string; label: string }[] = [
  { status: "PENDING_PAYMENT", label: "Commande créée — en attente de paiement" },
  { status: "PAID", label: "Paiement reçu" },
  { status: "HANDED_OVER", label: "Remise au livreur" },
  { status: "COURIER_DELIVERED", label: "Livraison déclarée par le livreur" },
  { status: "DELIVERED", label: "Réception confirmée" },
  { status: "SETTLED", label: "Règlement effectué au vendeur" },
]

const STATUS_INDEX: Record<string, number> = Object.fromEntries(
  STATUS_TIMELINE.map((s, i) => [s.status, i]),
)

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireUserSession()
  const { id } = await params
  const order = await getOrderForUser(id, user)
  if (!order) notFound()

  const orderWithRelations = order as typeof order & {
    items: Array<{ id: string; productName: string; quantity: number; unitPriceCents: number }>
    events: Array<{ id: string; type: string; createdAt: Date }>
    seller: { displayName: string } | null
    courier: { displayName: string } | null
  }

  const items = orderWithRelations.items ?? []
  const events = orderWithRelations.events ?? []
  const totalEur = (order.productsCents / 100).toFixed(2).replace(".", ",")
  const currentIdx = STATUS_INDEX[order.status] ?? -1
  const isCustomer = order.customerId === user.id
  const canConfirmDelivery = isCustomer && order.status === "COURIER_DELIVERED"

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Suivi de la commande</h1>
        <Link href="/marketplace" className="text-sm text-muted-foreground underline">
          ← Retour à la marketplace
        </Link>
      </header>

      <p className="text-sm text-muted-foreground">
        Numéro : <span className="font-mono">#{order.id.slice(-8)}</span>
      </p>

      <ol className="space-y-3 border rounded p-4">
        {STATUS_TIMELINE.map((step, i) => {
          const reached = currentIdx >= i
          const current = currentIdx === i
          return (
            <li
              key={step.status}
              className={`flex items-center gap-3 text-sm ${
                reached ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <span
                className={`inline-flex h-5 w-5 rounded-full items-center justify-center text-xs ${
                  reached ? "bg-emerald-500 text-white" : "bg-muted"
                }`}
              >
                {reached ? "✓" : i + 1}
              </span>
              <span className={current ? "font-medium" : ""}>{step.label}</span>
            </li>
          )
        })}
        {order.status === "CANCELLED" && (
          <li className="text-sm text-red-700 font-medium">Commande annulée</li>
        )}
        {order.status === "DISPUTED" && (
          <li className="text-sm text-amber-700 font-medium">Litige en cours</li>
        )}
      </ol>

      <section className="rounded border p-4 space-y-2 text-sm">
        <h2 className="font-medium">Détails</h2>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>{((item.unitPriceCents * item.quantity) / 100).toFixed(2).replace(".", ",")} €</span>
          </div>
        ))}
        <div className="flex justify-between font-medium border-t pt-2">
          <span>Total produits</span>
          <span>{totalEur} €</span>
        </div>
        {orderWithRelations.seller && (
          <p className="text-xs text-muted-foreground mt-2">
            Vendeur : {orderWithRelations.seller.displayName}
          </p>
        )}
        {orderWithRelations.courier && (
          <p className="text-xs text-muted-foreground">
            Livreur : {orderWithRelations.courier.displayName}
          </p>
        )}
      </section>

      {canConfirmDelivery && <CustomerConfirmDelivery orderId={order.id} />}

      {events.length > 0 && (
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer">Historique brut</summary>
          <ul className="mt-2 space-y-1">
            {events.map((e) => (
              <li key={e.id}>
                <span className="font-mono">{e.type}</span> —{" "}
                {new Date(e.createdAt).toLocaleString("fr-FR")}
              </li>
            ))}
          </ul>
        </details>
      )}
    </main>
  )
}
