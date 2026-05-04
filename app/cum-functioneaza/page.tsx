import Link from "next/link"
import {
  Eye,
  CheckCircle2,
  XCircle,
  Hand,
  ArrowRight,
  Mail,
  ShieldCheck,
  Database,
  Search,
  KeyRound,
  Trash2,
  Lock,
} from "lucide-react"

export const metadata = {
  title: "Cum funcționează | eSimplu",
  description:
    "Cum sunt colectate și gestionate anunțurile de servicii pe eSimplu, și cum poți revendica sau elimina anunțul tău.",
}

const SOURCES = [
  { label: "Pagini Facebook publice", icon: "📘" },
  { label: "Google Maps", icon: "🗺️" },
  { label: "Pages Jaunes (FR)", icon: "📒" },
  { label: "Cylex / Yell / 11880", icon: "📇" },
  { label: "PagineGialle (IT)", icon: "🇮🇹" },
  { label: "Site-uri oficiale", icon: "🌐" },
]

const OPTIONS = [
  {
    icon: CheckCircle2,
    color: "text-emerald-600 bg-emerald-50",
    badge: "Recomandat",
    badgeColor: "bg-emerald-600 text-white",
    title: "Revendică anunțul",
    description:
      "Îți creezi un cont gratuit pe eSimplu și preiei controlul asupra fișei. Poți modifica datele, adăuga fotografii, programul de lucru sau alte detalii.",
    href: "/register",
    cta: "Creează cont",
  },
  {
    icon: XCircle,
    color: "text-rose-600 bg-rose-50",
    badge: null,
    badgeColor: "",
    title: "Cere eliminarea",
    description:
      "Dacă nu vrei să apari pe site, anunțul tău este șters imediat la cerere, fără întrebări. Procesăm cererea în maxim 48 de ore.",
    href: "/contact",
    cta: "Cere eliminarea",
  },
  {
    icon: Hand,
    color: "text-amber-600 bg-amber-50",
    badge: null,
    badgeColor: "",
    title: "Nu faci nimic",
    description:
      "Anunțul rămâne afișat cu informațiile publice, vizibil pentru comunitate. Poți reveni oricând să îl revendici sau să ceri eliminarea.",
    href: "/services",
    cta: "Vezi servicii",
  },
]

const CLAIM_STEPS = [
  {
    n: "01",
    title: "Primești un link de revendicare",
    text: "Te contactăm prin email, SMS, WhatsApp sau comentariu pe pagina ta de Facebook cu un link unic care duce direct la fișa ta.",
  },
  {
    n: "02",
    title: "Apeși pe link",
    text: "Vezi datele care apar pe site despre afacerea ta, cu opțiunile clare: acceptă, refuză sau modifică.",
  },
  {
    n: "03",
    title: "Îți faci contul",
    text: "Creezi un cont gratuit cu email și parolă (sau cu Google) și de atunci poți gestiona fișa de la dashboard-ul tău.",
  },
]

const REMOVAL_STEPS = [
  {
    n: "01",
    title: "Scrii la contact@esimplu.com",
    text: "Specifică numele afacerii și menționează că ceri eliminarea anunțului. Nu îți cerem motive, nu trebuie să justifici.",
  },
  {
    n: "02",
    title: "Verificăm cererea",
    text: "Confirmăm că ai legătură cu afacerea (link Facebook, factură etc.). Acest pas durează cel mult 48 de ore lucrătoare.",
  },
  {
    n: "03",
    title: "Anunțul dispare",
    text: "Eliminarea este definitivă. Datele tale sunt șterse din baza noastră și nu mai apar pe site.",
  },
]

const GDPR_RIGHTS = [
  { icon: Eye, title: "Acces", text: "Să afli ce date avem despre tine" },
  { icon: KeyRound, title: "Rectificare", text: "Să corectezi date incorecte" },
  { icon: Trash2, title: "Ștergere", text: "Să-ți ștergem datele complet" },
  { icon: ShieldCheck, title: "Opoziție", text: "Să te opui prelucrării" },
  { icon: Database, title: "Portabilitate", text: "Să primești datele tale" },
  { icon: Lock, title: "Restricție", text: "Să limitezi prelucrarea" },
]

export default function CumFunctioneazaPage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center flex flex-col gap-6">
          <span className="inline-block self-center text-xs uppercase tracking-widest text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">
            Transparență totală
          </span>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Cum <span className="text-primary">funcționează</span> eSimplu
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Îți explicăm clar de unde vin anunțurile și cum poți revendica sau
            elimina al tău, oricând, în câteva minute.
          </p>
        </div>
      </section>

      {/* WHY YOU SEE LISTINGS */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-3 max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              Întrebare frecventă
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              De ce vezi anunțuri pe care nu le-ai publicat tu
            </h2>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed">
            Pentru ca diaspora română și moldovenească să găsească rapid
            serviciile de care are nevoie, am pre-populat directorul cu
            informații preluate din surse <strong>publice</strong>: pagini
            Facebook publice ale afacerilor, Google Maps și anuare comerciale.
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex gap-4 items-start">
            <Search className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">
                Niciun anunț nu este creat fără o sursă publică verificabilă.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Toate datele afișate (nume, telefon, adresă, descriere) sunt
                deja publice, puse la dispoziție de proprietarul afacerii pe
                internet.
              </p>
            </div>
          </div>

          {/* Sources grid */}
          <div className="mt-4 flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Surse pe care le folosim
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SOURCES.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-2 bg-card border rounded-lg px-3 py-2 text-sm"
                >
                  <span>{s.icon}</span>
                  <span className="text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THREE OPTIONS */}
      <section className="py-16 sm:py-20 px-6 bg-muted/40">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <div className="text-center flex flex-col gap-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              Drepturile tale ca proprietar
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Ai trei opțiuni
            </h2>
            <p className="text-base text-muted-foreground">
              Tu decizi ce se întâmplă cu fișa afacerii tale.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {OPTIONS.map((o) => {
              const Icon = o.icon
              return (
                <div
                  key={o.title}
                  className="flex flex-col gap-4 p-6 rounded-2xl bg-card border relative"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                >
                  {o.badge && (
                    <span
                      className={`absolute top-4 right-4 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${o.badgeColor}`}
                    >
                      {o.badge}
                    </span>
                  )}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${o.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{o.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {o.description}
                  </p>
                  <Link
                    href={o.href}
                    className="text-sm font-medium text-primary inline-flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    {o.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* HOW TO CLAIM */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-3 max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              Pentru proprietari
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Cum revendici anunțul
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {CLAIM_STEPS.map((s) => (
              <div
                key={s.n}
                className="flex flex-col gap-3 p-6 rounded-2xl bg-card border"
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
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex gap-4 items-start">
            <Mail className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold mb-1">
                Vezi anunțul tău dar nu ai primit link?
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Scrie-ne pe pagina de contact cu numele afacerii și o dovadă că
                ești proprietarul (link Facebook, factură, atestare). Îți
                generăm un link nou în maxim <strong>48 de ore</strong>.
              </p>
              <Link
                href="/contact"
                className="text-sm font-medium text-primary inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                Scrie-ne <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO REMOVE */}
      <section className="py-16 sm:py-20 px-6 bg-muted/40">
        <div className="max-w-5xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-3 max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-rose-600 font-semibold">
              Dreptul la eliminare
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Cum ceri eliminarea
            </h2>
            <p className="text-base text-muted-foreground">
              Nu îți cerem motive, nu îți punem întrebări, nu trebuie să
              justifici. Dreptul la eliminare este absolut.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {REMOVAL_STEPS.map((s) => (
              <div
                key={s.n}
                className="flex flex-col gap-3 p-6 rounded-2xl bg-card border"
                style={{ boxShadow: "var(--shadow-sm)" }}
              >
                <span
                  className="text-5xl font-bold text-rose-500/20 leading-none"
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

      {/* GDPR */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-3 max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              GDPR
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Drepturile tale, conform legii europene
            </h2>
            <p className="text-base text-muted-foreground">
              Respectăm Regulamentul General privind Protecția Datelor (GDPR)
              și nu vindem datele tale către terți.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GDPR_RIGHTS.map((r) => {
              const Icon = r.icon
              return (
                <div
                  key={r.title}
                  className="flex items-start gap-3 p-4 rounded-xl bg-card border"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-sm leading-tight">
                      {r.title}
                    </span>
                    <span className="text-xs text-muted-foreground leading-snug">
                      {r.text}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-sm text-muted-foreground">
            Pentru detalii complete vezi{" "}
            <Link
              href="/confidentialitate"
              className="text-primary font-medium underline"
            >
              Politica de confidențialitate
            </Link>
            .
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-6 p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Ai o întrebare? Te ascultăm
          </h2>
          <p className="text-base text-muted-foreground">
            Indiferent dacă vrei să revendici un anunț, să ceri eliminarea lui,
            sau să întrebi ceva legat de datele tale — răspundem rapid.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              Contactează-ne <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:contact@esimplu.com"
              className="bg-card border border-border px-6 py-3 rounded-lg font-medium hover:border-primary hover:text-primary transition-colors inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" /> contact@esimplu.com
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
