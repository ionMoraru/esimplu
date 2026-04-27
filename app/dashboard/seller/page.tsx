import Link from "next/link"
import { requireSellerSession } from "@/lib/auth/server-guards"
import { listProducts } from "@/lib/services/products"
import { Button } from "@/components/ui/button"

function formatPrice(cents: number, currency = "EUR") {
  const value = (cents / 100).toFixed(2).replace(".", ",")
  return `${value} ${currency}`
}

export default async function SellerDashboard() {
  const { seller } = await requireSellerSession()
  const products = await listProducts({ sellerId: seller.id })

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Espace vendeur — {seller.displayName}</h1>
          <p className="text-sm text-zinc-600">Commission plateforme : {seller.commissionPct} %</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/seller/orders">
            <Button variant="outline">Mes commandes</Button>
          </Link>
          <Link href="/dashboard/seller/products/new">
            <Button>Nouveau produit</Button>
          </Link>
        </div>
      </header>

      <section>
        <h2 className="text-lg font-medium mb-3">Mes produits ({products.length})</h2>
        {products.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Vous n&apos;avez pas encore publié de produit. Cliquez sur « Nouveau produit » pour démarrer.
          </p>
        ) : (
          <ul className="divide-y border rounded">
            {products.map((p) => (
              <li key={p.id} className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="text-sm text-zinc-600">
                    {formatPrice(p.priceCents)} · stock {p.stock} ·{" "}
                    {p.isPublished ? (
                      <span className="text-emerald-700">publié</span>
                    ) : (
                      <span className="text-amber-700">brouillon</span>
                    )}
                    {p.countriesAvailable.length > 0 && (
                      <span className="text-zinc-500"> · {p.countriesAvailable.join(", ").toUpperCase()}</span>
                    )}
                  </div>
                </div>
                <Link href={`/dashboard/seller/products/${p.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Éditer
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
