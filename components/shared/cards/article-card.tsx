import Link from "next/link"
import { COUNTRIES } from "@/lib/countries"

type Article = {
  id: string
  title: string
  slug: string
  category?: string
  categoryName?: string
  excerpt?: string
  coverImage?: string
  countries: string[]
  createdAt: Date | string
  readingTime?: number
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric" })
}

function getCountryLabel(code: string) {
  return COUNTRIES.find((c) => c.code === code)
}

export function ArticleCard({ article }: { article: Article }) {
  const categoryName = article.categoryName

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col rounded-2xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="aspect-video bg-muted overflow-hidden">
        {article.coverImage ? (
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-4xl">📰</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {article.countries.slice(0, 2).map((code) => {
            const country = getCountryLabel(code)
            if (!country) return null
            return (
              <span
                key={code}
                className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
              >
                {country.flag} {country.name}
              </span>
            )
          })}
          {categoryName && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {categoryName}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="text-base font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        {/* Meta */}
        <p className="text-xs text-muted-foreground mt-auto">
          {article.readingTime ? `${article.readingTime} min lectură · ` : ""}
          {formatDate(article.createdAt)}
        </p>
      </div>
    </Link>
  )
}
