import Link from "next/link"
import type { Product, SellerProfile } from "@/lib/generated/prisma/client"
import { COUNTRIES } from "@/lib/countries"

interface Props {
  product: Product
  seller: SellerProfile
}

export function DbProductDetail({ product, seller }: Props) {
  const priceEur = (product.priceCents / 100).toFixed(2).replace(".", ",")

  return (
    <main className="py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/marketplace" className="hover:text-foreground transition-colors">
            Marketplace
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <span>{product.category}</span>
            </>
          )}
          <span>/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <div className="aspect-square bg-muted rounded-2xl overflow-hidden flex items-center justify-center">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-muted-foreground">Pas d&apos;image</span>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {product.category && (
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium self-start">
                {product.category}
              </span>
            )}

            <h1
              className="text-3xl sm:text-4xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {product.name}
            </h1>

            <p className="text-sm text-muted-foreground">
              Vândut de{" "}
              <span className="font-medium text-foreground">{seller.displayName}</span>
              {seller.city && ` · 📍 ${seller.city}`}
            </p>

            <p className="text-4xl font-bold text-primary mt-2">{priceEur} €</p>

            <p className="text-base text-foreground leading-relaxed mt-2 whitespace-pre-line">
              {product.description}
            </p>

            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                Livrează în
              </p>
              <div className="flex flex-wrap gap-1.5">
                {product.countriesAvailable.map((code) => {
                  const country = COUNTRIES.find((c) => c.code === code)
                  if (!country) return null
                  return (
                    <span key={code} className="text-sm bg-muted px-3 py-1 rounded-full">
                      {country.flag} {country.name}
                    </span>
                  )
                })}
              </div>
            </div>

            {product.stock > 0 ? (
              <Link
                href={`/marketplace/${product.id}/checkout`}
                className="mt-6 w-full text-center bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-base hover:bg-primary/90 transition-colors"
              >
                Comandă acum
              </Link>
            ) : (
              <button
                disabled
                className="mt-6 w-full bg-muted text-muted-foreground py-4 rounded-xl font-semibold text-base"
              >
                Stoc epuizat
              </button>
            )}
            <p className="text-xs text-muted-foreground text-center">
              Stoc disponibil : {product.stock}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
