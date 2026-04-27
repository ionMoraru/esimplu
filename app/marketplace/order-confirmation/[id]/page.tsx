import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, seller: true },
  })
  if (!order) notFound()
  if (!user || order.customerId !== user.id) redirect("/login")

  const totalEur = (order.productsCents / 100).toFixed(2).replace(".", ",")
  const isPending = order.status === "PENDING_PAYMENT"

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        {isPending ? "Commande enregistrée" : "Commande confirmée"}
      </h1>

      <p className="text-sm text-muted-foreground">
        Numéro de commande : <span className="font-mono">#{order.id.slice(-8)}</span>
      </p>

      <section className="rounded border p-4 space-y-2">
        <h2 className="font-medium">Récapitulatif</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
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
      </section>

      {isPending && (
        <section className="rounded border border-amber-300 bg-amber-50 p-4 space-y-2 text-sm">
          <p className="font-medium text-amber-900">Paiement en attente</p>
          <p className="text-amber-900">
            Votre commande est enregistrée mais le paiement n&apos;a pas encore été reçu.
            En attendant l&apos;intégration du paiement en ligne, le règlement se fait
            par virement bancaire à l&apos;équipe eSimplu, qui valide ensuite la commande.
          </p>
          <p className="text-amber-900">
            Vous serez notifié(e) par email dès que le paiement sera confirmé.
          </p>
        </section>
      )}

      <section className="space-y-2 text-sm text-muted-foreground">
        <p>
          Vendeur : <span className="text-foreground">{order.seller.displayName}</span>
        </p>
        <p>
          Adresse de livraison :{" "}
          <span className="text-foreground">
            {order.deliveryAddress}, {order.deliveryCity}, {order.deliveryCountry.toUpperCase()}
          </span>
        </p>
      </section>

      <div className="flex gap-3">
        <Link href={`/orders/${order.id}`} className="text-sm text-primary underline">
          Suivre ma commande
        </Link>
        <Link href="/marketplace" className="text-sm text-muted-foreground underline">
          Continuer mes achats
        </Link>
      </div>
    </main>
  )
}
