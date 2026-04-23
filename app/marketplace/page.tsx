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
  const [query, setQuery] = useState<string>("")

  const filtered = mockProducts.filter((product) => {
    const categoryMatch =
      selectedCategory === "all" || product.category === selectedCategory
    const countryMatch =
      selectedCountry === "all" || product.deliveriesTo.includes(selectedCountry)
    return categoryMatch && countryMatch
  })

  const searchResults =
    query.trim() === ""
      ? []
      : mockProducts.filter((product) => {
          const q = query.toLowerCase()
          return (
            product.name.toLowerCase().includes(q) ||
            product.description.toLowerCase().includes(q) ||
            product.sellerName.toLowerCase().includes(q)
          )
        })

  const featuredProducers = mockProducers.slice(0, 3)

  return (
    <main>
      <PageHero
        title="Marketplace"
        subtitle="De la fermă la diaspora — produse autentice de la producători moldoveni și români"
      />

      {/* Barre de recherche prominente */}
      <section className="px-6 py-8 border-b bg-muted/30">
        <div className="max-w-2xl mx-auto relative">
          <svg
            className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Caută miere, vin, cozonac, brânză..."
            className="w-full pl-14 pr-12 py-4 rounded-2xl border bg-card text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Șterge căutarea"
            >
              ✕
            </button>
          )}
        </div>
      </section>

      {/* Résultats de recherche — visible uniquement quand on tape */}
      {query.trim() !== "" && (
        <section className="py-10 px-6 border-b bg-background">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title={`Rezultate pentru "${query}"`}
              subtitle={`${searchResults.length} produs${searchResults.length !== 1 ? "e" : ""} găsit${searchResults.length !== 1 ? "e" : ""}`}
            />
            {searchResults.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">Niciun produs găsit pentru "{query}".</p>
                <p className="text-sm mt-2">
                  Încearcă un alt termen sau explorează catalogul mai jos.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

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
