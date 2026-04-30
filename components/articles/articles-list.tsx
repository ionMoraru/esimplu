"use client"

import { useState } from "react"
import { ArticleCard } from "@/components/shared/cards/article-card"
import { FilterPill } from "@/components/shared/navigation/filter-pill"
import { COUNTRIES } from "@/lib/countries"

type Article = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  countries: string[]
  readingTime: number | null
  createdAt: Date
  category: { slug: string; name: string } | null
}

type Category = { slug: string; name: string }

export function ArticlesList({
  articles,
  categories,
  initialCountry = "all",
}: {
  articles: Article[]
  categories: Category[]
  initialCountry?: string
}) {
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountry)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filtered = articles.filter((article) => {
    const countryMatch =
      selectedCountry === "all" || article.countries.includes(selectedCountry)
    const categoryMatch =
      selectedCategory === "all" || article.category?.slug === selectedCategory
    return countryMatch && categoryMatch
  })

  return (
    <>
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
          {categories.map((cat) => (
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

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">
            Niciun articol găsit pentru filtrele selectate.
          </p>
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
            <ArticleCard
              key={article.id}
              article={{
                id: article.id,
                title: article.title,
                slug: article.slug,
                excerpt: article.excerpt ?? undefined,
                coverImage: article.coverImage ?? undefined,
                countries: article.countries,
                createdAt: article.createdAt,
                readingTime: article.readingTime ?? undefined,
                category: article.category?.slug,
                categoryName: article.category?.name,
              }}
            />
          ))}
        </div>
      )}
    </>
  )
}
