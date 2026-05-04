import Link from "next/link"
import {
  BookOpen,
  Store,
  Truck,
  ShoppingBag,
  Heart,
  Users,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: "Despre noi | eSimplu",
  description:
    "Cine suntem și de ce am construit eSimplu pentru diaspora română și moldovenească din Europa.",
}

export const dynamic = "force-dynamic"

const COUNTRY_FLAGS = [
  { code: "fr", name: "Franța", flag: "🇫🇷" },
  { code: "de", name: "Germania", flag: "🇩🇪" },
  { code: "it", name: "Italia", flag: "🇮🇹" },
  { code: "uk", name: "Marea Britanie", flag: "🇬🇧" },
]

const PILLARS = [
  {
    icon: BookOpen,
    title: "Articole practice",
    description:
      "Ghiduri pas cu pas pentru viața de zi cu zi: sănătate, impozite, locuință, școală, recunoașterea diplomelor — adaptate pentru fiecare țară.",
    href: "/articles",
    cta: "Vezi articole",
  },
  {
    icon: Store,
    title: "Director de servicii",
    description:
      "Magazine românești, transportatori, saloane, traducători, contabili, restaurante. Servicii oferite de diaspora pentru diaspora.",
    href: "/services",
    cta: "Vezi servicii",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description:
      "Produse direct de la producători din România și Moldova, livrate în toată Europa. În curs de dezvoltare.",
    href: "/marketplace",
    cta: "Descoperă",
  },
  {
    icon: Truck,
    title: "Livrare",
    description:
      "Transport persoane și colete între țările Europei, conectând șoferii și călătorii din comunitate. În curs de dezvoltare.",
    href: "/delivery",
    cta: "Detalii",
  },
]

const VALUES = [
  {
    icon: Heart,
    title: "Făcut de comunitate",
    text: "Pentru diaspora, de către cineva care înțelege provocările tale zilnice. Nu e un produs corporate, e un proiect de suflet.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent și legal",
    text: "Folosim doar date publice, oferim posibilitatea de revendicare sau eliminare a oricărui anunț, respectăm GDPR.",
  },
  {
    icon: Users,
    title: "Aproape de tine",
    text: "Conținut în limba română, optimizat pentru fiecare din cele 4 țări. Răspundem la mesaje în maxim 48 de ore.",
  },
]

const STEPS = [
  {
    n: "01",
    title: "Alegi țara",
    text: "Indici țara unde locuiești (Franța, Germania, Italia sau Marea Britanie). Tot conținutul este filtrat automat după țara ta.",
  },
  {
    n: "02",
    title: "Descoperi conținut util",
    text: "Cauți răspunsuri în articole, găsești servicii de încredere, vezi ce produse vin direct din Moldova și România.",
  },
  {
    n: "03",
    title: "Te conectezi cu comunitatea",
    text: "Suni un transportator, vorbești cu un magazin românesc, găsești un coafez. Totul în limba ta.",
  },
]

export default async function DesprePage() {
  const [articleCount, serviceCount] = await Promise.all([
    prisma.article.count({ where: { published: true } }),
    prisma.serviceListing.count({ where: { status: "PENDING" } }),
  ])

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center flex flex-col gap-6">
          <span className="inline-block self-center text-xs uppercase tracking-widest text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">
            Despre eSimplu
          </span>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Platforma diasporei <br className="hidden sm:block" />
            <span className="text-primary">române și moldovenești</span> din Europa
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Un singur loc unde găsești tot ce ai nevoie când trăiești departe de
            casă: ghiduri practice, servicii de încredere și o comunitate care
            vorbește limba ta.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <Link
              href="/articles"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              Vezi articole <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/services"
              className="bg-card border border-border px-6 py-3 rounded-lg font-medium hover:border-primary hover:text-primary transition-colors"
            >
              Caută un serviciu
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 px-6 border-y bg-card">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col gap-1">
            <span className="text-3xl sm:text-4xl font-bold text-primary" style={{ fontFamily: "var(--font-playfair), serif" }}>
              {articleCount}
            </span>
            <span className="text-sm text-muted-foreground">Articole publicate</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-3xl sm:text-4xl font-bold text-primary" style={{ fontFamily: "var(--font-playfair), serif" }}>
              {serviceCount}
            </span>
            <span className="text-sm text-muted-foreground">Servicii listate</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-3xl sm:text-4xl font-bold text-primary" style={{ fontFamily: "var(--font-playfair), serif" }}>
              4
            </span>
            <span className="text-sm text-muted-foreground">Țări acoperite</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-3xl sm:text-4xl font-bold text-primary" style={{ fontFamily: "var(--font-playfair), serif" }}>
              100%
            </span>
            <span className="text-sm text-muted-foreground">Gratuit, fără reclame</span>
          </div>
        </div>
      </section>

      {/* MISIUNEA */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-3 max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              Misiunea noastră
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Să facem viața în diaspora un pic mai simplă
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-8 text-base text-muted-foreground leading-relaxed">
            <p>
              Când pleci de acasă, fiecare procedură administrativă, fiecare
              ghișeu, fiecare cabinet medical pare un labirint. Te încurci în
              limbi pe care nu le stăpânești perfect, formulare necunoscute și
              reguli diferite de la o țară la alta.
            </p>
            <p>
              eSimplu strânge într-un singur loc răspunsurile, contactele și
              produsele de care ai nevoie ca român sau moldovean în Europa.
              Făcut cu drag de cineva care a trecut prin toate astea.
            </p>
          </div>
        </div>
      </section>

      {/* PILLARS — ce gasesti */}
      <section className="py-16 sm:py-20 px-6 bg-muted/40">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <div className="text-center flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              Ce găsești pe eSimplu
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Patru piloni, o singură comunitate
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((p) => {
              const Icon = p.icon
              return (
                <Link
                  key={p.title}
                  href={p.href}
                  className="group flex flex-col gap-3 p-6 rounded-2xl bg-card border hover:border-primary hover:shadow-md transition-all"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {p.description}
                  </p>
                  <span className="text-sm font-medium text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    {p.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* COUNTRIES */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              Acoperire geografică
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Patru țări, o limbă comună
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Conținutul este adaptat pentru regulile, sistemele și instituțiile
              fiecărei țări — nu copy-paste din Wikipedia.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {COUNTRY_FLAGS.map((c) => (
              <div
                key={c.code}
                className="flex flex-col gap-2 items-center p-6 rounded-2xl bg-card border"
                style={{ boxShadow: "var(--shadow-sm)" }}
              >
                <span className="text-4xl">{c.flag}</span>
                <span className="text-sm font-medium">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 px-6 bg-gradient-to-b from-muted/30 to-transparent">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <div className="text-center flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              În trei pași
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Cum funcționează
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="flex flex-col gap-3 p-6 rounded-2xl bg-card border relative"
                style={{ boxShadow: "var(--shadow-sm)" }}
              >
                <span
                  className="text-5xl font-bold text-primary/20 leading-none"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  {s.n}
                </span>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <div className="text-center flex flex-col gap-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              Valorile noastre
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              În ce credem
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {VALUES.map((v) => {
              const Icon = v.icon
              return (
                <div
                  key={v.title}
                  className="flex gap-4 p-6 rounded-2xl bg-card border"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-semibold leading-tight">
                      {v.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {v.text}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* DATA SOURCES TRANSPARENCY */}
      <section className="py-16 sm:py-20 px-6 bg-muted/40">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              Transparență
            </span>
            <h2
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              De unde vin informațiile
            </h2>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed">
            O parte din anunțurile prezente pe site sunt preluate din surse
            publice (pagini Facebook, Google Maps, anuare publice) pentru a
            oferi un punct de plecare util comunității. Fiecare proprietar de
            afacere primește posibilitatea să își revendice anunțul, să îl
            modifice sau să ceară eliminarea lui.
          </p>
          <div>
            <Link
              href="/cum-functioneaza"
              className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline"
            >
              Vezi cum funcționează în detaliu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-6 p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Ai o sugestie? Vrei să colaborezi?
          </h2>
          <p className="text-base text-muted-foreground">
            eSimplu este un proiect deschis. Dacă vrei să propui un articol, să
            adaugi un serviciu sau pur și simplu să dai un feedback, ne face
            plăcere să te ascultăm.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              Scrie-ne <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/services/new"
              className="bg-card border border-border px-6 py-3 rounded-lg font-medium hover:border-primary hover:text-primary transition-colors"
            >
              Propune un serviciu
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
