"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { ArticleCard } from "@/components/shared/cards/article-card"
import { ProductCard } from "@/components/shared/cards/product-card"
import { ServiceCategoryButton } from "@/components/shared/navigation/service-category-button"
import { FilterPill } from "@/components/shared/navigation/filter-pill"
import { AlertBanner } from "@/components/shared/forms/alert-banner"
import { FormField } from "@/components/shared/forms/form-field"
import { mockArticles, mockProducts, mockServices } from "@/lib/mock-data"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Section({
  id,
  title,
  desc,
  children,
}: {
  id: string
  title: string
  desc?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="py-12 border-b border-border last:border-b-0 scroll-mt-4">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        {desc && <p className="text-sm text-muted-foreground mt-1">{desc}</p>}
      </div>
      {children}
    </section>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
      {children}
    </h3>
  )
}

function ColorSwatch({
  label,
  cssVar,
  hex,
  description,
  bordered,
}: {
  label: string
  cssVar: string
  hex: string
  description?: string
  bordered?: boolean
}) {
  return (
    <div className="flex flex-col">
      <div
        className={`h-16 w-full rounded-t-lg ${bordered ? "border border-border" : ""}`}
        style={{ background: `var(${cssVar})` }}
      />
      <div className="bg-card rounded-b-lg border border-t-0 border-border p-2.5">
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="text-[10px] font-mono text-muted-foreground">{cssVar}</p>
        <p className="text-[10px] text-muted-foreground">{hex}</p>
        {description && (
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DesignPage() {
  return (
    <div className="max-w-4xl px-10 py-10">
      {/* Page header */}
      <div className="mb-10 pb-8 border-b border-border">
        <h1
          className="text-5xl text-foreground leading-tight"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Design System
        </h1>
        <p className="text-muted-foreground mt-3 text-base">
          Visualise et modifie tous les tokens avant de coder.
          Tous les changements viennent de{" "}
          <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
            app/globals.css
          </code>
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 1. COULEURS                                                         */}
      {/* ------------------------------------------------------------------ */}
      <Section
        id="couleurs"
        title="Couleurs"
        desc="Tokens OKLch définis dans :root — modifie globals.css pour changer la palette"
      >
        <div className="space-y-6">
          <div>
            <SectionLabel>Marque</SectionLabel>
            <div className="grid grid-cols-3 gap-3">
              <ColorSwatch label="Primary" cssVar="--primary" hex="#2D6A4F" description="Vert forêt" />
              <ColorSwatch label="Secondary" cssVar="--secondary" hex="#40916C" description="Vert moyen" />
              <ColorSwatch label="Accent" cssVar="--accent" hex="#F4A261" description="Orange doux" />
            </div>
          </div>

          <div>
            <SectionLabel>Texte</SectionLabel>
            <div className="grid grid-cols-3 gap-3">
              <ColorSwatch label="Foreground" cssVar="--foreground" hex="#1A1A1A" description="Texte principal" />
              <ColorSwatch
                label="Muted Foreground"
                cssVar="--muted-foreground"
                hex="#6B7280"
                description="Texte secondaire"
              />
            </div>
          </div>

          <div>
            <SectionLabel>Fonds</SectionLabel>
            <div className="grid grid-cols-3 gap-3">
              <ColorSwatch
                label="Background"
                cssVar="--background"
                hex="#FAFAF8"
                description="Fond de page"
                bordered
              />
              <ColorSwatch
                label="Card"
                cssVar="--card"
                hex="#FFFFFF"
                description="Fond des cartes"
                bordered
              />
              <ColorSwatch
                label="Muted"
                cssVar="--muted"
                hex="#F4F4F1"
                description="Fond atténué"
              />
            </div>
          </div>

          <div>
            <SectionLabel>Sémantiques</SectionLabel>
            <div className="grid grid-cols-3 gap-3">
              <ColorSwatch label="Border" cssVar="--border" hex="#E5E4DF" description="Bordures" />
              <ColorSwatch
                label="Destructive"
                cssVar="--destructive"
                hex="#DC2626"
                description="Erreur / Danger"
              />
              <ColorSwatch label="Ring" cssVar="--ring" hex="#2D6A4F" description="Focus ring" />
            </div>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. TYPOGRAPHIE                                                      */}
      {/* ------------------------------------------------------------------ */}
      <Section
        id="typographie"
        title="Typographie"
        desc="Playfair Display (titres) + Geist Sans (corps) + Geist Mono (code)"
      >
        <div className="space-y-6">
          {/* Titres */}
          <div className="space-y-4 pb-6 border-b border-border">
            <SectionLabel>Titres — Playfair Display</SectionLabel>
            {[
              { tag: "H1", size: "text-5xl", text: "Diaspora română în Europa" },
              { tag: "H2", size: "text-4xl", text: "Articole practice pentru tine" },
              { tag: "H3", size: "text-3xl", text: "Servicii de contabilitate în Franța" },
              { tag: "H4", size: "text-2xl", text: "Drepturi angajat în Italia" },
            ].map(({ tag, size, text }) => (
              <div key={tag} className="flex items-baseline gap-4">
                <span className="text-xs text-muted-foreground font-mono w-8 shrink-0">{tag}</span>
                <p
                  className={`${size} leading-tight text-foreground`}
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>

          {/* Corps */}
          <div className="space-y-4 pb-6 border-b border-border">
            <SectionLabel>Corps — Geist Sans</SectionLabel>
            <div className="flex items-baseline gap-4">
              <span className="text-xs text-muted-foreground font-mono w-12 shrink-0">Base</span>
              <p className="text-base leading-relaxed max-w-xl text-foreground">
                Tot ce ai nevoie ca român în Europa — articole practice, servicii de încredere și
                produse din Moldova și România, direct la ușa ta.
              </p>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-xs text-muted-foreground font-mono w-12 shrink-0">Small</span>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                Ghid complet pentru alegerea unei mutuelle de sănătate în Franța. Ce trebuie să
                știi, cum să compari ofertele și cum să te înscrii.
              </p>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-xs text-muted-foreground font-mono w-12 shrink-0">Caption</span>
              <p className="text-xs text-muted-foreground">5 min lectură · 15 ian. 2026</p>
            </div>
          </div>

          {/* Mono */}
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground font-mono w-12 shrink-0">Mono</span>
            <code className="text-sm bg-muted px-2 py-1 rounded font-mono text-foreground">
              import {"{ mockArticles }"} from &quot;@/lib/mock-data&quot;
            </code>
          </div>

          {/* Article reading preview */}
          <div className="mt-6 p-6 bg-card rounded-2xl border border-border">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-5">
              Aperçu — texte article (style Medium)
            </p>
            <h2
              className="text-3xl leading-snug mb-2"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Cum să faci o mutuelle în Franța
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              5 min lectură · 15 ian. 2026 ·{" "}
              <span className="text-primary font-medium">Viață practică</span>
            </p>
            <p className="text-base leading-[1.8] text-foreground">
              Mutuelle este o asigurare complementară de sănătate, obligatorie pentru angajații din
              Franța. Ea completează rambursările Securității Sociale, care acoperă în medie doar
              70% din cheltuielile medicale.
            </p>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. BOUTONS                                                          */}
      {/* ------------------------------------------------------------------ */}
      <Section
        id="boutons"
        title="Boutons"
        desc="6 variantes × 4 tailles — components/ui/button.tsx"
      >
        <div className="space-y-6">
          <div>
            <SectionLabel>Variantes</SectionLabel>
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          <div>
            <SectionLabel>Tailles</SectionLabel>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div>
            <SectionLabel>États</SectionLabel>
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Normal</Button>
              <Button variant="default" disabled>
                Désactivé
              </Button>
            </div>
          </div>

          <div>
            <SectionLabel>En contexte — landing page</SectionLabel>
            <div className="flex gap-3">
              <Button variant="default" size="lg">
                Descoperă articolele
              </Button>
              <Button variant="outline" size="lg">
                Găsește un serviciu
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. BADGES & TAGS                                                    */}
      {/* ------------------------------------------------------------------ */}
      <Section
        id="badges"
        title="Badges & Tags"
        desc="Badges shadcn + FilterPill + tags catégories et pays"
      >
        <div className="space-y-6">
          <div>
            <SectionLabel>Variantes shadcn — components/ui/badge.tsx</SectionLabel>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="ghost">Ghost</Badge>
            </div>
          </div>

          <div>
            <SectionLabel>FilterPill (actif / inactif) — components/shared/filter-pill.tsx</SectionLabel>
            <div className="flex flex-wrap gap-2">
              <FilterPill active={true} onClick={() => {}}>Toate țările</FilterPill>
              <FilterPill active={false} onClick={() => {}}>🇫🇷 France</FilterPill>
              <FilterPill active={false} onClick={() => {}}>🇩🇪 Allemagne</FilterPill>
              <FilterPill active={false} onClick={() => {}}>🇮🇹 Italie</FilterPill>
            </div>
          </div>

          <div>
            <SectionLabel>Catégories d&apos;articles</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {["Viață practică", "Finanțe", "Afaceri", "Drepturi & Admin", "Cultură & Rețete"].map(
                (cat) => (
                  <span
                    key={cat}
                    className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium"
                  >
                    {cat}
                  </span>
                )
              )}
            </div>
          </div>

          <div>
            <SectionLabel>Pays</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {[
                { flag: "🇫🇷", name: "France" },
                { flag: "🇩🇪", name: "Allemagne" },
                { flag: "🇮🇹", name: "Italie" },
                { flag: "🇬🇧", name: "Royaume-Uni" },
              ].map((c) => (
                <span
                  key={c.name}
                  className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground font-medium"
                >
                  {c.flag} {c.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* 5. INPUTS                                                           */}
      {/* ------------------------------------------------------------------ */}
      <Section
        id="inputs"
        title="Champs de saisie"
        desc="FormField (label + Input) — components/shared/form-field.tsx + components/ui/input.tsx"
      >
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <FormField id="demo-email" label="Email" type="email" placeholder="tine@exemplu.com" />
            <FormField id="demo-pass" label="Parolă" type="password" placeholder="••••••••" />
            <FormField id="demo-disabled" label="Câmp dezactivat" placeholder="Dezactivat" disabled />
            <div className="space-y-2 pt-2">
              <SectionLabel>AlertBanner — components/shared/alert-banner.tsx</SectionLabel>
              <AlertBanner variant="error">Email sau parolă incorectă.</AlertBanner>
              <AlertBanner variant="success">Cont creat cu succes! Conectați-vă mai jos.</AlertBanner>
              <AlertBanner variant="info">Verificați-vă emailul pentru confirmare.</AlertBanner>
            </div>
          </div>

          {/* Login form preview */}
          <div className="p-6 bg-card rounded-2xl border border-border">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Aperçu — formulaire connexion
            </p>
            <div className="space-y-3">
              <FormField id="preview-email" label="Email" type="email" placeholder="Adresă email" />
              <FormField id="preview-pass" label="Parolă" type="password" placeholder="••••••••" />
              <Button className="w-full">Autentifică-te</Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-3 text-xs text-muted-foreground">sau</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Continuă cu Google
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. CARTES ARTICLES                                                  */}
      {/* ------------------------------------------------------------------ */}
      <Section
        id="cartes-articles"
        title="Cartes Articles"
        desc="Deux layouts : vertical (actuel) et horizontal (style Medium)"
      >
        <div className="space-y-8">
          <div>
            <SectionLabel>Layout vertical — ArticleCard actuel</SectionLabel>
            <div className="grid grid-cols-2 gap-4">
              {mockArticles.slice(0, 2).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Layout horizontal — style Medium (alternative)</SectionLabel>
            <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden">
              {mockArticles.slice(0, 3).map((article) => {
                const countryFlags = article.countries
                  .map((c) =>
                    c === "fr" ? "🇫🇷" : c === "de" ? "🇩🇪" : c === "it" ? "🇮🇹" : "🇬🇧"
                  )
                  .join(" ")
                return (
                  <div
                    key={article.id}
                    className="flex gap-4 p-5 bg-card hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-muted-foreground">{countryFlags}</span>
                        <span className="text-xs text-primary font-medium">
                          {article.category?.replace(/-/g, " ")}
                        </span>
                      </div>
                      <h3
                        className="text-base font-semibold leading-snug mb-1.5 text-foreground"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                      >
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-2.5">
                        {article.excerpt}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {article.readingTime} min lectură
                      </p>
                    </div>
                    {article.coverImage && (
                      <div className="shrink-0 w-28 h-20 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* 7. CARTES PRODUITS                                                  */}
      {/* ------------------------------------------------------------------ */}
      <Section
        id="cartes-produits"
        title="Cartes Produits"
        desc="Style CrowdFarming — components/shared/product-card.tsx"
      >
        <div className="grid grid-cols-3 gap-4">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* 8. CARTES SERVICES                                                  */}
      {/* ------------------------------------------------------------------ */}
      <Section
        id="cartes-services"
        title="Cartes Services"
        desc="Annuaire de services — compact et lisible"
      >
        <div className="space-y-3">
          {mockServices.slice(0, 4).map((service) => {
            const icon =
              service.category === "contabil"
                ? "📊"
                : service.category === "magazin"
                  ? "🛒"
                  : service.category === "traducator"
                    ? "📝"
                    : service.category === "avocat"
                      ? "⚖️"
                      : "🚚"
            return (
              <div
                key={service.id}
                className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-all cursor-pointer"
                style={{ boxShadow: "var(--shadow-sm)" }}
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{service.title}</h3>
                    <span className="shrink-0 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      {service.city}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 mb-2 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {service.languages.map((lang) => (
                      <span
                        key={lang}
                        className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium"
                      >
                        {lang.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* 9. AVATARS & STATES                                                 */}
      {/* ------------------------------------------------------------------ */}
      <Section
        id="avatars"
        title="Avatars & States"
        desc="Avatar (3 tailles) + Skeleton loading — components/ui/"
      >
        <div className="space-y-8">
          <div>
            <SectionLabel>Avatars — 3 tailles</SectionLabel>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <Avatar size="sm">
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <span className="text-[10px] font-mono text-muted-foreground">sm</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar size="default">
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <span className="text-[10px] font-mono text-muted-foreground">default</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar size="lg">
                  <AvatarFallback>LG</AvatarFallback>
                </Avatar>
                <span className="text-[10px] font-mono text-muted-foreground">lg</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar size="lg">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=maria" />
                  <AvatarFallback>MA</AvatarFallback>
                </Avatar>
                <span className="text-[10px] font-mono text-muted-foreground">avec image</span>
              </div>
            </div>
          </div>

          <div>
            <SectionLabel>Skeleton — état de chargement</SectionLabel>
            <div className="grid grid-cols-2 gap-4">
              {[0, 1].map((i) => (
                <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                  <Skeleton className="aspect-video w-full rounded-none" />
                  <div className="p-4 space-y-2">
                    <div className="flex gap-1.5 mb-2">
                      <Skeleton className="h-4 w-12 rounded-full" />
                      <Skeleton className="h-4 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/4 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* 10. RADIUS & OMBRES                                                 */}
      {/* ------------------------------------------------------------------ */}
      <Section
        id="espacement"
        title="Radius & Ombres"
        desc="Échelle de border-radius + shadow tokens définis dans globals.css"
      >
        <div className="space-y-8">
          <div>
            <SectionLabel>Border Radius (base = 0.5rem)</SectionLabel>
            <div className="flex flex-wrap items-end gap-6">
              {[
                { label: "sm", cls: "rounded-sm", val: "0.3rem" },
                { label: "md", cls: "rounded-md", val: "0.4rem" },
                { label: "lg", cls: "rounded-lg", val: "0.5rem" },
                { label: "xl", cls: "rounded-xl", val: "0.7rem" },
                { label: "2xl", cls: "rounded-2xl", val: "0.9rem" },
                { label: "3xl", cls: "rounded-3xl", val: "1.1rem" },
                { label: "full", cls: "rounded-full", val: "9999px" },
              ].map((r) => (
                <div key={r.label} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-14 h-14 bg-primary/15 border-2 border-primary/30 ${r.cls}`}
                  />
                  <span className="text-[10px] font-mono text-muted-foreground">{r.label}</span>
                  <span className="text-[10px] text-muted-foreground/60">{r.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Ombres (--shadow-sm / md / lg dans :root)</SectionLabel>
            <div className="flex flex-wrap gap-8">
              {[
                {
                  label: "--shadow-sm",
                  shadow: "var(--shadow-sm)",
                  desc: "Cartes au repos",
                },
                {
                  label: "--shadow-md",
                  shadow: "var(--shadow-md)",
                  desc: "Cartes au hover",
                },
                {
                  label: "--shadow-lg",
                  shadow: "var(--shadow-lg)",
                  desc: "Modales / overlays",
                },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-3">
                  <div
                    className="w-28 h-18 bg-card rounded-xl"
                    style={{ boxShadow: s.shadow, height: "4.5rem" }}
                  />
                  <span className="text-[10px] font-mono text-muted-foreground">{s.label}</span>
                  <span className="text-[10px] text-muted-foreground/60">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <div className="py-8 text-center text-xs text-muted-foreground/50">
        eSimplu Design System — accessible uniquement en développement
      </div>
    </div>
  )
}
