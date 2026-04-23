import Link from "next/link"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/shared/cards/product-card"
import { mockProducers, mockProducts } from "@/lib/mock-data"

export default async function ProducerPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const producer = mockProducers.find((p) => p.slug === slug)
  if (!producer) notFound()

  const products = mockProducts.filter((p) => p.producerId === producer.id)

  return (
    <main className="py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
          <Link
            href="/marketplace"
            className="hover:text-foreground transition-colors"
          >
            Marketplace
          </Link>
          <span>/</span>
          <span>Producători</span>
          <span>/</span>
          <span className="text-foreground font-medium">{producer.name}</span>
        </nav>

        {/* Hero producteur */}
        <section className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-10 mb-16">
          <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
            <img
              src={producer.image}
              alt={producer.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Producător
            </span>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {producer.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                📍 {producer.region}
              </span>
              <span>·</span>
              <span>Familia din {producer.since}</span>
              <span>·</span>
              <span>{products.length} produse</span>
            </div>

            <div className="mt-4 pt-4 border-t">
              <h2
                className="text-lg font-semibold mb-3"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Povestea noastră
              </h2>
              <p className="text-base text-foreground leading-relaxed whitespace-pre-line">
                {producer.story}
              </p>
            </div>

            <p className="text-sm text-muted-foreground mt-2 italic">
              💡 Pe scurt : {producer.shortStory}
            </p>
          </div>
        </section>

        {/* Grille de produits */}
        <section className="border-t pt-12">
          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Produsele de la {producer.name}
            </h2>
            <span className="text-sm text-muted-foreground">
              {products.length} produse disponibile
            </span>
          </div>

          {products.length === 0 ? (
            <p className="text-muted-foreground py-12 text-center">
              Acest producător nu are produse disponibile momentan.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
