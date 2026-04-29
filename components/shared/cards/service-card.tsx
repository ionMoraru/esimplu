import { COUNTRIES } from "@/lib/countries"
import { CATEGORY_ICONS } from "@/lib/service-category-icons"

type Service = {
  id: string
  title: string
  category: { slug: string; name: string } | null
  description: string
  languages: string[]
  city: string
  countries: string[]
  phone: string
  email: string | null
}

const LANGUAGE_LABELS: Record<string, string> = {
  ro: "Română",
  ru: "Rusă",
  fr: "Franceză",
  de: "Germană",
  it: "Italiană",
  en: "Engleză",
}

export function ServiceCard({ service }: { service: Service }) {
  const category = service.category
  const icon = category ? CATEGORY_ICONS[category.slug] ?? "📁" : null

  return (
    <div
      className="flex flex-col rounded-2xl border bg-card p-6 gap-3 hover:shadow-md transition-shadow"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      {/* Header : catégorie + localisation */}
      <div className="flex items-start justify-between gap-3">
        {category && (
          <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
            {icon} {category.name}
          </span>
        )}
        <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
          📍 {service.city}
          {service.countries[0] && (
            <>
              {" · "}
              {COUNTRIES.find((c) => c.code === service.countries[0])?.flag}
            </>
          )}
        </span>
      </div>

      {/* Titre */}
      <h3
        className="text-lg font-semibold leading-snug"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
        {service.description}
      </p>

      {/* Langues parlées */}
      {service.languages.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {service.languages.map((lang) => (
            <span
              key={lang}
              className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
            >
              {LANGUAGE_LABELS[lang] ?? lang}
            </span>
          ))}
        </div>
      )}

      {/* Boutons de contact */}
      <div className="flex gap-2 mt-auto pt-3 border-t">
        <a
          href={`tel:${service.phone.replace(/\s/g, "")}`}
          className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          📞 Sună
        </a>
        {service.email && (
          <a
            href={`mailto:${service.email}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-card border border-border py-2 rounded-lg text-sm font-medium hover:border-primary hover:text-primary transition-colors"
          >
            ✉️ Email
          </a>
        )}
      </div>
    </div>
  )
}
