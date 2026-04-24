"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHero } from "@/components/shared/navigation/page-hero"
import { mockServiceCategories } from "@/lib/mock-data"
import { COUNTRIES } from "@/lib/countries"

const AVAILABLE_LANGUAGES = [
  { code: "ro", label: "Română" },
  { code: "ru", label: "Rusă" },
  { code: "fr", label: "Franceză" },
  { code: "de", label: "Germană" },
  { code: "it", label: "Italiană" },
  { code: "en", label: "Engleză" },
]

export default function NewServicePage() {
  // Un state par champ texte/select
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [city, setCity] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  // States tableaux pour les champs multi-select
  const [countries, setCountries] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])

  // State pour les erreurs (clé = nom du champ, valeur = message)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // State "envoyé" pour afficher la confirmation
  const [submitted, setSubmitted] = useState(false)

  // Toggle generique pour les checkboxes (pays / langues)
  function toggle(
    current: string[],
    setter: (v: string[]) => void,
    value: string,
  ) {
    setter(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    )
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Validation
    const newErrors: Record<string, string> = {}
    if (title.trim().length < 3)
      newErrors.title = "Titlul trebuie să aibă minim 3 caractere."
    if (!category) newErrors.category = "Alege o categorie."
    if (description.trim().length < 20)
      newErrors.description = "Descrierea trebuie să aibă minim 20 caractere."
    if (city.trim().length < 2) newErrors.city = "Oraș invalid."
    if (countries.length === 0)
      newErrors.countries = "Selectează cel puțin o țară."
    if (languages.length === 0)
      newErrors.languages = "Selectează cel puțin o limbă."
    if (phone.trim().length < 6) newErrors.phone = "Telefon invalid."
    if (!email.includes("@") || email.trim().length < 5)
      newErrors.email = "Email invalid."

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Pas d'erreur → succès (plus tard, on enverra les données au backend)
    setErrors({})
    setSubmitted(true)
  }

  // Écran de confirmation après soumission
  if (submitted) {
    return (
      <main>
        <PageHero
          title="Mulțumim !"
          subtitle="Propunerea ta a fost înregistrată"
        />
        <section className="py-16 px-6">
          <div className="max-w-xl mx-auto text-center flex flex-col gap-4">
            <div className="text-6xl mb-2">✅</div>
            <p className="text-base text-muted-foreground">
              Vei primi un email de confirmare la{" "}
              <span className="font-medium text-foreground">{email}</span>{" "}
              imediat ce echipa noastră verifică datele.
            </p>
            <div className="flex gap-3 justify-center mt-4">
              <Link
                href="/services"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Vezi toate serviciile
              </Link>
              <Link
                href="/"
                className="bg-card border px-6 py-3 rounded-lg font-medium hover:border-primary hover:text-primary transition-colors"
              >
                Acasă
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <PageHero
        title="Propune un serviciu"
        subtitle="Completează formularul de mai jos. Verificăm datele înainte de publicare."
      />

      <section className="py-10 px-6">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="max-w-2xl mx-auto flex flex-col gap-6"
        >
          {/* Titlu */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium">
              Titlul serviciului <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Cabinet Contabil Popescu"
              className="px-4 py-2.5 rounded-lg border bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Catégorie */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-sm font-medium">
              Categorie <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-lg border bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer"
              >
                <option value="">-- Alege o categorie --</option>
                {mockServiceCategories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium">
              Descriere <span className="text-destructive">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrie pe scurt serviciul oferit..."
              rows={5}
              className="px-4 py-2.5 rounded-lg border bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y"
            />
            <p className="text-xs text-muted-foreground">
              {description.length} caractere (minim 20)
            </p>
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Ville */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="city" className="text-sm font-medium">
              Oraș <span className="text-destructive">*</span>
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex: Paris"
              className="px-4 py-2.5 rounded-lg border bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            {errors.city && (
              <p className="text-xs text-destructive">{errors.city}</p>
            )}
          </div>

          {/* Pays (multi-select) */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">
              Țări deservite <span className="text-destructive">*</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map((c) => {
                const active = countries.includes(c.code)
                return (
                  <label
                    key={c.code}
                    className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card hover:border-primary"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggle(countries, setCountries, c.code)}
                      className="sr-only"
                    />
                    <span>
                      {c.flag} {c.name}
                    </span>
                  </label>
                )
              })}
            </div>
            {errors.countries && (
              <p className="text-xs text-destructive">{errors.countries}</p>
            )}
          </div>

          {/* Langues (multi-select) */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">
              Limbi vorbite <span className="text-destructive">*</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_LANGUAGES.map((lang) => {
                const active = languages.includes(lang.code)
                return (
                  <label
                    key={lang.code}
                    className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card hover:border-primary"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggle(languages, setLanguages, lang.code)}
                      className="sr-only"
                    />
                    <span>{lang.label}</span>
                  </label>
                )
              })}
            </div>
            {errors.languages && (
              <p className="text-xs text-destructive">{errors.languages}</p>
            )}
          </div>

          {/* Téléphone */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-sm font-medium">
              Telefon <span className="text-destructive">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+33 6 12 34 56 78"
              className="px-4 py-2.5 rounded-lg border bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@exemplu.com"
              className="px-4 py-2.5 rounded-lg border bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t">
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold text-base hover:bg-primary/90 transition-colors"
            >
              Trimite propunerea
            </button>
            <Link
              href="/services"
              className="text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Anulează și înapoi la servicii
            </Link>
          </div>
        </form>
      </section>
    </main>
  )
}
