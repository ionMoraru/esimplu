import Link from "next/link"
import {
  Mail,
  Building2,
  ShieldCheck,
  Handshake,
  ArrowRight,
  Clock,
  MessageCircle,
} from "lucide-react"

export const metadata = {
  title: "Contact | eSimplu",
  description:
    "Cum ne poți contacta pentru întrebări, propuneri, revendicarea unui anunț sau eliminarea lui.",
}

const REASONS = [
  {
    icon: Building2,
    color: "text-emerald-600 bg-emerald-50",
    title: "Ești proprietarul unui anunț?",
    description:
      "Vrei să revendici fișa afacerii tale sau să ceri eliminarea? Trimite un email cu numele afacerii și o dovadă (link Facebook, factură, atestare).",
    cta: "Revendică sau șterge",
    ctaHref:
      "mailto:contact@esimplu.com?subject=Revendicare%20%2F%20stergere%20anunt&body=Salut%2C%0A%0ANume%20afacere%3A%20%0ATara%2Foras%3A%20%0ACerere%20(revendicare%20%2F%20stergere)%3A%20%0ADovada%20(link%20FB%2C%20factura)%3A%20%0A%0AMultumesc!",
  },
  {
    icon: ShieldCheck,
    color: "text-blue-600 bg-blue-50",
    title: "Cereri GDPR",
    description:
      "Drepturi GDPR (acces, rectificare, ștergere, opoziție, portabilitate) sau reclamații legate de prelucrarea datelor tale personale.",
    cta: "Trimite cerere GDPR",
    ctaHref:
      "mailto:contact@esimplu.com?subject=Cerere%20GDPR&body=Salut%2C%0A%0ATip%20cerere%20(acces%2Frectificare%2Fstergere%2Fopozitie%2Fportabilitate)%3A%20%0AEmail%20cu%20care%20ai%20cont%3A%20%0ADetalii%3A%20%0A%0AMultumesc!",
  },
  {
    icon: Handshake,
    color: "text-amber-600 bg-amber-50",
    title: "Colaborări și propuneri",
    description:
      "Vrei să propui un articol, să colaborezi cu noi sau să ne dai un feedback? Suntem deschiși la idei și parteneriate cu comunitatea.",
    cta: "Hai să vorbim",
    ctaHref:
      "mailto:contact@esimplu.com?subject=Colaborare%20%2F%20Propunere",
  },
  {
    icon: MessageCircle,
    color: "text-rose-600 bg-rose-50",
    title: "Întrebări generale",
    description:
      "Ai o întrebare despre platformă, despre un anunț sau pur și simplu vrei să ne saluți? Scrie-ne, te citim cu plăcere.",
    cta: "Trimite mesaj",
    ctaHref: "mailto:contact@esimplu.com",
  },
]

export default function ContactPage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center flex flex-col gap-6">
          <span className="inline-block self-center text-xs uppercase tracking-widest text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">
            Contact
          </span>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Suntem aici <br className="hidden sm:block" />
            <span className="text-primary">să te ascultăm</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Indiferent de motivul mesajului tău, răspundem rapid și pe limba ta.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-2">
            <a
              href="mailto:contact@esimplu.com"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" /> contact@esimplu.com
            </a>
            <span className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Răspuns în maxim 48h lucrătoare
            </span>
          </div>
        </div>
      </section>

      {/* REASONS */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <div className="text-center flex flex-col gap-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              Pentru ce ne contactezi?
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Alege motivul mesajului
            </h2>
            <p className="text-base text-muted-foreground">
              Fiecare buton deschide un email pre-completat cu subiectul potrivit.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {REASONS.map((r) => {
              const Icon = r.icon
              return (
                <div
                  key={r.title}
                  className="flex flex-col gap-4 p-6 rounded-2xl bg-card border"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${r.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{r.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {r.description}
                  </p>
                  <a
                    href={r.ctaHref}
                    className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary hover:gap-2 transition-all"
                  >
                    {r.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ-LITE */}
      <section className="py-16 sm:py-20 px-6 bg-muted/40">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              Întrebări frecvente
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Înainte să ne scrii
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <div
              className="p-6 rounded-2xl bg-card border"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <p className="font-semibold mb-2">
                Vezi un anunț despre afacerea ta și nu știi cum să procedezi?
              </p>
              <p className="text-sm text-muted-foreground">
                Citește pagina{" "}
                <Link href="/cum-functioneaza" className="text-primary underline">
                  Cum funcționează
                </Link>{" "}
                — explică pas cu pas cum poți revendica anunțul sau cere
                eliminarea lui.
              </p>
            </div>
            <div
              className="p-6 rounded-2xl bg-card border"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <p className="font-semibold mb-2">Vrei să adaugi un serviciu nou?</p>
              <p className="text-sm text-muted-foreground">
                Mergi direct pe{" "}
                <Link href="/services/new" className="text-primary underline">
                  Propune un serviciu
                </Link>{" "}
                — completezi formularul și verificăm datele înainte de publicare.
              </p>
            </div>
            <div
              className="p-6 rounded-2xl bg-card border"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <p className="font-semibold mb-2">Cum protejezi datele mele?</p>
              <p className="text-sm text-muted-foreground">
                Vezi{" "}
                <Link href="/confidentialitate" className="text-primary underline">
                  Politica de confidențialitate
                </Link>{" "}
                pentru detalii complete despre prelucrarea datelor și drepturile
                tale GDPR.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DIRECT EMAIL CARD */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-6 p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center self-center">
            <Mail className="w-7 h-7" />
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Scrie direct la
          </h2>
          <a
            href="mailto:contact@esimplu.com"
            className="text-xl sm:text-2xl text-primary font-semibold underline underline-offset-4 hover:no-underline transition-all break-all"
          >
            contact@esimplu.com
          </a>
          <p className="text-sm text-muted-foreground">
            Echipa eSimplu — diaspora română și moldovenească din Europa
          </p>
        </div>
      </section>
    </main>
  )
}
