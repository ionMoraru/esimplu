import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { MockPaymentConfirm } from "@/components/marketplace/mock-payment-confirm"

export default async function MockPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  if (process.env.PAYMENT_PROVIDER && process.env.PAYMENT_PROVIDER !== "mock") {
    notFound()
  }

  const user = await getCurrentUser()
  const { id } = await params

  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) notFound()
  if (!user || order.customerId !== user.id) {
    redirect("/login")
  }

  const totalEur = (order.productsCents / 100).toFixed(2).replace(".", ",")

  return (
    <main className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Paiement (mode mock)</h1>
      <p className="text-sm text-muted-foreground">
        Cette page simule un terminal de paiement. En production avec Stripe activé,
        elle sera remplacée par le checkout Stripe réel.
      </p>

      <div className="rounded border p-4 space-y-1">
        <div className="flex justify-between text-sm">
          <span>Commande</span>
          <span className="font-mono text-xs">#{order.id.slice(-8)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Total</span>
          <span className="font-medium">{totalEur} €</span>
        </div>
      </div>

      <MockPaymentConfirm orderId={order.id} />
    </main>
  )
}
