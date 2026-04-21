import Link from "next/link"
import { HeroSlider } from "@/components/hero-slider"

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <SectionsGrid />
    </main>
  )
}

function HeroSection() {
  return (
    <HeroSlider>
    <section className="flex flex-col items-center justify-center text-center px-6 py-24">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl max-w-2xl">
        Totul de care ai nevoie,{" "}
        <span className="text-blue-300">simplu și în română</span>
      </h1>
      <p className="mt-6 text-lg text-white/80 max-w-xl">
        Articole utile, servicii de încredere și produse din Moldova și România —
        pentru diaspora din Franța, Germania, Italia și Marea Britanie.
      </p>
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Link
          href="/articles"
          className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Descoperă articolele
        </Link>
        <Link
          href="/services"
          className="rounded-lg border px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors"
        >
          Găsește un serviciu
        </Link>
      </div>
    </section>
    </HeroSlider>
  )
}

function SectionsGrid() {
  const sections = [
    {
      title: "Articole",
      description: "Ghiduri practice despre viața în Europa — mutuelle, acte, drepturi și multe altele.",
      href: "/articles",
      emoji: "📰",
    },
    {
      title: "Servicii",
      description: "Contabili, avocați, magazine românești și alți profesioniști de încredere.",
      href: "/services",
      emoji: "🛠️",
    },
    {
      title: "Marketplace",
      description: "Produse de la producători moldoveni și români, livrate direct la tine.",
      href: "/marketplace",
      emoji: "🛒",
    },
  ]

  return (
    <section className="px-6 py-16 max-w-5xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-center mb-10">Ce găsești pe eSimplu</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-2xl border bg-card p-6 flex flex-col gap-3 hover:shadow-md transition-shadow"
          >
            <span className="text-4xl">{section.emoji}</span>
            <h3 className="text-lg font-semibold">{section.title}</h3>
            <p className="text-sm text-muted-foreground">{section.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
