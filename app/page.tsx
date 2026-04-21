import Link from "next/link"
import { HeroSlider } from "@/components/hero-slider"
import { mockArticles, mockServiceCategories, mockProducts } from "@/lib/mock-data"

const countryFlag: Record<string, string> = {
  fr: "🇫🇷",
  de: "🇩🇪",
  it: "🇮🇹",
  uk: "🇬🇧",
}

const countryName: Record<string, string> = {
  fr: "Franța",
  de: "Germania",
  it: "Italia",
  uk: "Marea Britanie",
}

const categoryIcon: Record<string, string> = {
  contabil: "🧾",
  avocat: "⚖️",
  magazin: "🏪",
  traducator: "🌐",
  livrare: "🚚",
  medic: "🩺",
  frizer: "✂️",
}

export default function HomePage() {
  return (
    <main>
      {/* 1 — Hero */}
      <HeroSection />

      {/* 2 — Cum funcționează */}
      <HowItWorksSection />

      {/* 3 — Articole recente */}
      <ArticlesSection />

      {/* 4 — Categorii servicii */}
      <ServicesSection />

      {/* 5 — Marketplace */}
      <MarketplaceSection />

      {/* 6 — CTA final */}
      <JoinSection />
    </main>
  )
}

/* ─── Section 1 : Hero ─────────────────────────────────────────── */

function HeroSection() {
  return (
    <HeroSlider>
      <section className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight max-w-2xl leading-tight">
          Tot ce ai nevoie ca român în Europa
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-xl leading-relaxed">
          Articole practice, servicii de încredere și produse din acasă —
          pentru diaspora din Franța, Germania, Italia și Marea Britanie.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            href="/articles"
            className="rounded-lg bg-white text-[#2D6A4F] px-7 py-3.5 text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Descoperă articolele
          </Link>
          <Link
            href="/services"
            className="rounded-lg border border-white/60 text-white px-7 py-3.5 text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            Găsește un serviciu →
          </Link>
        </div>
      </section>
    </HeroSlider>
  )
}

/* ─── Section 2 : Cum funcționează ─────────────────────────────── */

function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      icon: "📰",
      title: "Citești articole practice",
      description: "Ghiduri simple despre mutuelle, acte, drepturi și viața de zi cu zi în Europa.",
    },
    {
      number: "2",
      icon: "🛠️",
      title: "Găsești servicii de încredere",
      description: "Contabili, avocați, magazine și alți profesioniști care vorbesc română.",
    },
    {
      number: "3",
      icon: "🛒",
      title: "Cumperi produse din acasă",
      description: "Miere, vin, brânză — direct de la producătorii moldoveni și români.",
    },
  ]

  return (
    <section className="bg-muted/40 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
          Cum funcționează eSimplu?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                {step.number}
              </div>
              <span className="text-4xl">{step.icon}</span>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Section 3 : Articole recente ─────────────────────────────── */

function ArticlesSection() {
  const articles = mockArticles.slice(0, 3)

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">Articole recente</h2>
          <Link href="/articles" className="text-sm font-medium text-primary hover:underline">
            Toate articolele →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="aspect-video bg-muted overflow-hidden">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-3">
                {/* Country badges */}
                <div className="flex gap-1 flex-wrap">
                  {article.countries.slice(0, 2).map((c) => (
                    <span key={c} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                      {countryFlag[c]} {countryName[c]}
                    </span>
                  ))}
                </div>

                <h3 className="text-base font-semibold leading-snug group-hover:text-primary transition-colors">
                  {article.title}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>

                <p className="text-xs text-muted-foreground mt-auto">
                  5 min lectură
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Section 4 : Categorii servicii ───────────────────────────── */

function ServicesSection() {
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Găsește un serviciu</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Profesioniști care vorbesc română, în țara ta
            </p>
          </div>
          <Link href="/services" className="text-sm font-medium text-primary hover:underline hidden sm:block">
            Toate serviciile →
          </Link>
        </div>

        <div className="flex flex-wrap gap-3">
          {mockServiceCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/services?category=${cat.slug}`}
              className="flex items-center gap-2 bg-card border rounded-xl px-5 py-3 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
            >
              <span>{categoryIcon[cat.slug] ?? "🔹"}</span>
              {cat.name}
            </Link>
          ))}
          <Link
            href="/services/new"
            className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/30 rounded-xl px-5 py-3 text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            <span>＋</span>
            Propune serviciul tău
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Section 5 : Marketplace ──────────────────────────────────── */

function MarketplaceSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl sm:text-3xl font-bold">Din Moldova și România, direct la tine</h2>
          <Link href="/marketplace" className="text-sm font-medium text-primary hover:underline hidden sm:block">
            Marketplace →
          </Link>
        </div>
        <p className="text-muted-foreground text-sm mb-10">
          Produse de la producători locali, livrate în Europa
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {mockProducts.map((product) => (
            <div key={product.id} className="rounded-2xl border bg-card overflow-hidden group hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="aspect-square bg-muted overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">{product.sellerName} · Moldova</p>
                <h3 className="text-base font-semibold leading-snug">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-primary">{product.price} €</span>
                  <Link
                    href="/marketplace"
                    className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Comandă
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Section 6 : CTA final ─────────────────────────────────────── */

function JoinSection() {
  return (
    <section className="bg-primary py-24 px-6 text-center">
      <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
          Ești nou pe eSimplu?
        </h2>
        <p className="text-white/80 text-lg leading-relaxed">
          Creează un cont gratuit și descoperă tot ce platforma are de oferit —
          articole, servicii și produse pentru diaspora română.
        </p>
        <Link
          href="/register"
          className="rounded-lg bg-white text-primary px-8 py-4 text-base font-semibold hover:bg-white/90 transition-colors"
        >
          Înregistrare gratuită
        </Link>
      </div>
    </section>
  )
}
