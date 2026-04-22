import Link from "next/link"
import { HeroSlider } from "@/components/layout/hero-slider"
import { ArticleCard } from "@/components/shared/cards/article-card"
import { ProductCard } from "@/components/shared/cards/product-card"
import { ServiceCategoryButton } from "@/components/shared/navigation/service-category-button"
import { SectionHeader } from "@/components/shared/navigation/section-header"
import { mockArticles, mockServiceCategories, mockProducts } from "@/lib/mock-data"

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
      <HeroSection />
      <HowItWorksSection />
      <ArticlesSection />
      <ServicesSection />
      <MarketplaceSection />
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
        <SectionHeader
          title="Articole recente"
          href="/articles"
          linkLabel="Toate articolele"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
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
        <SectionHeader
          title="Găsește un serviciu"
          subtitle="Profesioniști care vorbesc română, în țara ta"
          href="/services"
          linkLabel="Toate serviciile"
          hideLinkOnMobile
        />
        <div className="flex flex-wrap gap-3">
          {mockServiceCategories.map((cat) => (
            <ServiceCategoryButton
              key={cat.id}
              href={`/services?category=${cat.slug}`}
              icon={categoryIcon[cat.slug] ?? "🔹"}
              name={cat.name}
            />
          ))}
          <ServiceCategoryButton
            href="/services/new"
            icon="＋"
            name="Propune serviciul tău"
            variant="cta"
          />
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
        <SectionHeader
          title="Din Moldova și România, direct la tine"
          subtitle="Produse de la producători locali, livrate în Europa"
          href="/marketplace"
          linkLabel="Marketplace"
          hideLinkOnMobile
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
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
