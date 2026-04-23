"use client"

import { useState } from "react"
import { ProductCard } from "@/components/shared/cards/product-card"
import { ProducerCard } from "@/components/shared/cards/producer-card"
import { FilterPill } from "@/components/shared/navigation/filter-pill"
import { PageHero } from "@/components/shared/navigation/page-hero"
import { SectionHeader } from "@/components/shared/navigation/section-header"
import {
  mockProducts,
  mockProductCategories,
  mockProducers,
} from "@/lib/mock-data"
import { COUNTRIES } from "@/lib/countries"

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedCountry, setSelectedCountry] = useState<string>("all")

  const filtered = mockProducts.filter((product) => {
    const categoryMatch =
      selectedCategory === "all" || product.category === selectedCategory
    const countryMatch =
      selectedCountry === "all" || product.deliveriesTo.includes(selectedCountry)
    return categoryMatch && countryMatch
  })

  const featuredProducers = mockProducers.slice(0, 3)

  return (
    <main>
      <PageHero
        title="Marketplace"
        subtitle="De la fermă la diaspora — produse autentice de la producători moldoveni și români"
      />

      {/* Producteurs à la une */}
      <section className="py-10 px-6 border-b">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Producători de sezon"
            subtitle="Familii și ateliere care pun pasiune în fiecare produs"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredProducers.map((producer) => (
              <ProducerCard key={producer.id} producer={producer} />
            ))}
          </div>
        </div>
      </section>

      {/* Produits + filtres */}
      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Toate produsele"
            subtitle={`${filtered.length} produse disponibile`}
          />

          {/* Filtres catégories */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <FilterPill
              active={selectedCategory === "all"}
              onClick={() => setSelectedCategory("all")}
            >
              Toate categoriile
            </FilterPill>
            {mockProductCategories.map((cat) => (
              <FilterPill
                key={cat.slug}
                active={selectedCategory === cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
              >
                {cat.icon} {cat.name}
              </FilterPill>
            ))}
          </div>

          {/* Filtres pays de livraison */}
          <div className="flex items-center gap-2 flex-wrap mb-8">
            <FilterPill
              active={selectedCountry === "all"}
              onClick={() => setSelectedCountry("all")}
            >
              Livrează oriunde
            </FilterPill>
            {COUNTRIES.map((c) => (
              <FilterPill
                key={c.code}
                active={selectedCountry === c.code}
                onClick={() => setSelectedCountry(c.code)}
              >
                {c.flag} {c.name}
              </FilterPill>
            ))}
          </div>

          {/* Grille de produits */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">
                Niciun produs găsit pentru filtrele selectate.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all")
                  setSelectedCountry("all")
                }}
                className="mt-4 text-sm text-primary hover:underline"
              >
                Resetează filtrele
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
