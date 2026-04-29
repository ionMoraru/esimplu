import Link from "next/link"
import { ProductCard } from "@/components/shared/cards/product-card"
import type { Product, SellerProfile } from "@/lib/generated/prisma/client"
import { dbProductToDisplay } from "@/lib/marketplace/display"
import { COUNTRIES } from "@/lib/countries"

interface Props {
  seller: SellerProfile
  products: Product[]
}

export function DbProducerDetail({ seller, products }: Props) {
  const productsToShow = products.map((p) => dbProductToDisplay(p, seller))
  const sinceYear = seller.createdAt.getFullYear()
  const country = COUNTRIES.find((c) => c.code === seller.country)
  const countryLabel = country ? `${country.flag} ${country.name}` : seller.country.toUpperCase()

  return (
    <main className="py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/marketplace" className="hover:text-foreground transition-colors">
            Marketplace
          </Link>
          <span>/</span>
          <span>Producători</span>
          <span>/</span>
          <span className="text-foreground font-medium">{seller.displayName}</span>
        </nav>

        <section className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 mb-16">
          <div className="aspect-square bg-muted rounded-2xl overflow-hidden flex items-center justify-center text-6xl">
            🌾
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Producător
            </span>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {seller.displayName}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {seller.city && (
                <>
                  <span className="flex items-center gap-1">📍 {seller.city}</span>
                  <span>·</span>
                </>
              )}
              <span>{countryLabel}</span>
              <span>·</span>
              <span>din {sinceYear}</span>
              <span>·</span>
              <span>{products.length} produse</span>
            </div>

            {seller.description && (
              <div className="mt-4 pt-4 border-t">
                <h2
                  className="text-lg font-semibold mb-3"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  Povestea noastră
                </h2>
                <p className="text-base text-foreground leading-relaxed whitespace-pre-line">
                  {seller.description}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="border-t pt-12">
          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Produsele de la {seller.displayName}
            </h2>
            <span className="text-sm text-muted-foreground">
              {products.length} produse disponibile
            </span>
          </div>

          {productsToShow.length === 0 ? (
            <p className="text-muted-foreground py-12 text-center">
              Acest producător nu are produse disponibile momentan.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsToShow.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
