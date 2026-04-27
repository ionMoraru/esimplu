import Link from "next/link"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/shared/cards/product-card"
import { DbProductDetail } from "@/components/marketplace/db-product-detail"
import {
  mockProducts,
  mockProducers,
  mockProductCategories,
} from "@/lib/mock-data"
import { COUNTRIES } from "@/lib/countries"
import { prisma } from "@/lib/prisma"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Try DB first (real seller-published products use cuid IDs).
  const dbProduct = await prisma.product.findUnique({
    where: { id },
    include: { seller: true },
  })
  if (dbProduct && dbProduct.isPublished) {
    return <DbProductDetail product={dbProduct} seller={dbProduct.seller} />
  }

  const product = mockProducts.find((p) => p.id === id)
  if (!product) notFound()

  const producer = mockProducers.find((p) => p.id === product.producerId)
  const category = mockProductCategories.find(
    (c) => c.slug === product.category,
  )

  const relatedProducts = mockProducts.filter(
    (p) => p.producerId === product.producerId && p.id !== product.id,
  )

  return (
    <main className="py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/marketplace" className="hover:text-foreground transition-colors">
            Marketplace
          </Link>
          {category && (
            <>
              <span>/</span>
              <span>
                {category.icon} {category.name}
              </span>
            </>
          )}
          <span>/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        {/* Produit principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-4">
            {category && (
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium self-start">
                {category.icon} {category.name}
              </span>
            )}

            <h1
              className="text-3xl sm:text-4xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {product.name}
            </h1>

            {producer && (
              <p className="text-sm text-muted-foreground">
                Vândut de{" "}
                <Link
                  href={`/marketplace/producer/${producer.slug}`}
                  className="font-medium text-foreground hover:text-primary underline underline-offset-2"
                >
                  {producer.name}
                </Link>{" "}
                · 📍 {producer.region}
              </p>
            )}

            <p className="text-4xl font-bold text-primary mt-2">
              {product.price} €
            </p>

            <p className="text-base text-foreground leading-relaxed mt-2">
              {product.description}
            </p>

            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                Livrează în
              </p>
              <div className="flex flex-wrap gap-1.5">
                {product.deliveriesTo.map((code) => {
                  const country = COUNTRIES.find((c) => c.code === code)
                  if (!country) return null
                  return (
                    <span
                      key={code}
                      className="text-sm bg-muted px-3 py-1 rounded-full"
                    >
                      {country.flag} {country.name}
                    </span>
                  )
                })}
              </div>
            </div>

            <button className="mt-6 w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-base hover:bg-primary/90 transition-colors">
              Adaugă în coș
            </button>
            <p className="text-xs text-muted-foreground text-center">
              Expediere în 3-5 zile lucrătoare după confirmare
            </p>
          </div>
        </div>

        {/* Section producteur */}
        {producer && (
          <section className="border-t pt-12 mb-16">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Despre producător
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 bg-card rounded-2xl border p-6">
              <div className="aspect-square bg-muted rounded-xl overflow-hidden">
                <img
                  src={producer.image}
                  alt={producer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h3
                  className="text-xl font-semibold mb-1"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  {producer.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  📍 {producer.region} · din {producer.since}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                  {producer.story}
                </p>
                <Link
                  href={`/marketplace/producer/${producer.slug}`}
                  className="text-sm font-medium text-primary hover:underline self-start"
                >
                  Vezi toate produsele →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Produits similaires */}
        {relatedProducts.length > 0 && (
          <section className="border-t pt-12">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Alte produse de la {producer?.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
