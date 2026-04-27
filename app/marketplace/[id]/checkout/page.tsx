import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { CheckoutForm } from "@/components/marketplace/checkout-form"

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: { seller: true },
  })
  if (!product || !product.isPublished) notFound()
  if (product.stock < 1) notFound()

  if (!user) {
    redirect(`/login?callbackUrl=/marketplace/${id}/checkout`)
  }

  const priceEur = (product.priceCents / 100).toFixed(2).replace(".", ",")

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Finaliser la commande</h1>
        <p className="text-sm text-muted-foreground">
          {product.name} — {priceEur} € · vendu par {product.seller.displayName}
        </p>
      </header>

      <CheckoutForm
        productId={product.id}
        productName={product.name}
        priceEur={priceEur}
        defaultEmail={user.email ?? ""}
        defaultName={user.name ?? ""}
        countriesAvailable={product.countriesAvailable}
      />
    </main>
  )
}
