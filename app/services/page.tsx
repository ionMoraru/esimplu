"use client"

import { useState } from "react"
import Link from "next/link"
import { ServiceCard } from "@/components/shared/cards/service-card"
import { FilterPill } from "@/components/shared/navigation/filter-pill"
import { PageHero } from "@/components/shared/navigation/page-hero"
import { mockServices, mockServiceCategories } from "@/lib/mock-data"
import { COUNTRIES } from "@/lib/countries"

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedCountry, setSelectedCountry] = useState<string>("all")

  const filtered = mockServices.filter((service) => {
    const categoryMatch =
      selectedCategory === "all" || service.category === selectedCategory
    const countryMatch =
      selectedCountry === "all" || service.countries.includes(selectedCountry)
    return categoryMatch && countryMatch
  })

  return (
    <main>
      <PageHero
        title="Servicii"
        subtitle="Directorul serviciilor pentru diaspora română în Europa — contabili, avocați, magazine, traducători"
      />

      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Filtres catégories */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <FilterPill
              active={selectedCategory === "all"}
              onClick={() => setSelectedCategory("all")}
            >
              Toate categoriile
            </FilterPill>
            {mockServiceCategories.map((cat) => (
              <FilterPill
                key={cat.slug}
                active={selectedCategory === cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
              >
                {cat.icon} {cat.name}
              </FilterPill>
            ))}
          </div>

          {/* Filtres pays */}
          <div className="flex items-center gap-2 flex-wrap mb-8">
            <FilterPill
              active={selectedCountry === "all"}
              onClick={() => setSelectedCountry("all")}
            >
              Toate țările
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

          {/* Compteur + CTA */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <p className="text-sm text-muted-foreground">
              {filtered.length} serviciu
              {filtered.length !== 1 ? "ri" : ""} disponibil
              {filtered.length !== 1 ? "e" : ""}
            </p>
            <Link
              href="/services/new"
              className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              + Propune un serviciu
            </Link>
          </div>

          {/* Grille */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">
                Niciun serviciu găsit pentru filtrele selectate.
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
              {filtered.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
