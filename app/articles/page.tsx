"use client"

import { useState } from "react"
import { ArticleCard } from "@/components/shared/cards/article-card"
import { FilterPill } from "@/components/shared/navigation/filter-pill"
import { PageHero } from "@/components/shared/navigation/page-hero"
import { mockArticles, mockArticleCategories } from "@/lib/mock-data"
import { COUNTRIES } from "@/lib/countries"

export default function ArticlesPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filtered = mockArticles.filter((article) => {
    const countryMatch =
      selectedCountry === "all" || article.countries.includes(selectedCountry)
    const categoryMatch =
      selectedCategory === "all" || article.category === selectedCategory
    return countryMatch && categoryMatch
  })

  return (
    <main>
      <PageHero
        title="Articole"
        subtitle="Ghiduri practice pentru diaspora română în Europa"
      />

      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Filtres */}
          <div className="flex flex-col gap-3 mb-8">
            <div className="flex items-center gap-2 flex-wrap">
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

            <div className="flex items-center gap-2 flex-wrap">
              <FilterPill
                active={selectedCategory === "all"}
                onClick={() => setSelectedCategory("all")}
              >
                Toate categoriile
              </FilterPill>
              {mockArticleCategories.map((cat) => (
                <FilterPill
                  key={cat.slug}
                  active={selectedCategory === cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  {cat.name}
                </FilterPill>
              ))}
            </div>
          </div>

          {/* Grille d'articles */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">Niciun articol găsit pentru filtrele selectate.</p>
              <button
                onClick={() => {
                  setSelectedCountry("all")
                  setSelectedCategory("all")
                }}
                className="mt-4 text-sm text-primary hover:underline"
              >
                Resetează filtrele
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
