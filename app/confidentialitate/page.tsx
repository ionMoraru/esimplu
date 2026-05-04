import Link from "next/link"
import {
  ShieldCheck,
  Database,
  UserCheck,
  Cookie,
  Clock,
  Share2,
  Scale,
  Lock,
  RefreshCw,
  Mail,
  ArrowRight,
} from "lucide-react"

export const metadata = {
  title: "Politica de confidențialitate | eSimplu",
  description:
    "Cum colectăm, folosim și protejăm datele tale personale pe eSimplu, în conformitate cu GDPR.",
}

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Date publice",
    text: "Folosim doar date publice de pe surse oficiale (Facebook, Google Maps, anuare comerciale).",
  },
  {
    icon: Lock,
    title: "Stocare securizată",
    text: "Servere în UE (OVH Franța), HTTPS pe tot site-ul, parole criptate cu bcrypt.",
  },
  {
    icon: Share2,
    title: "Nu vindem datele",
    text: "Datele tale nu sunt vândute, închiriate sau transmise spre marketing terț.",
  },
  {
    icon: UserCheck,
    title: "Drepturi GDPR",
    text: "Acces, rectificare, ștergere, opoziție — drepturile tale, oricând la cerere.",
  },
]

const SECTIONS = [
  {
    n: "01",
    icon: ShieldCheck,
    title: "Cine suntem",
    body: (
      <p>
        eSimplu este o platformă online dedicată diasporei române și
        moldovenești din Franța, Germania, Italia și Marea Britanie.
        Operatorul prelucrării datelor în sensul GDPR este echipa eSimplu,
        contactabilă la{" "}
        <a href="mailto:contact@esimplu.com" className="text-primary font-medium">
          contact@esimplu.com
        </a>
        .
      </p>
    ),
  },
  {
    n: "02",
    icon: Database,
    title: "Ce date colectăm",
    body: (
      <>
        <p className="font-semibold mt-2">A. Date despre afacerile listate</p>
        <p>
          Pentru directorul de servicii, colectăm date <strong>publicate deja
          public</strong> de proprietarii afacerilor pe pagini Facebook publice,
          Google Maps, Pages Jaunes, Cylex, Yell, PagineGialle, site-uri
          oficiale și alte surse publice verificabile:
        </p>
        <ul>
          <li>Numele afacerii</li>
          <li>Categoria (magazin, salon, transport etc.)</li>
          <li>Descrierea publică</li>
          <li>Orașul și țara</li>
          <li>Numărul de telefon public</li>
          <li>Email public (dacă este afișat)</li>
          <li>Site-ul / pagina Facebook (URL public)</li>
        </ul>
        <p className="text-sm bg-primary/5 border border-primary/20 rounded-xl p-4 mt-3">
          <strong>Temei legal:</strong> interes legitim (art. 6 alin. 1 lit. f
          GDPR) — facilitarea conexiunii între afacerile diasporei și
          comunitatea română/moldovenească. Datele utilizate sunt deja publice
          și colectate exclusiv din surse oficiale.
        </p>
        <p>
          <strong>Drepturile proprietarului:</strong> orice proprietar poate
          revendica anunțul, modifica datele sau cere eliminarea imediată — vezi{" "}
          <Link href="/cum-functioneaza" className="text-primary font-medium">
            Cum funcționează
          </Link>
          .
        </p>

        <p className="font-semibold mt-4">B. Date despre utilizatorii cu cont</p>
        <p>
          Dacă îți creezi cont pe eSimplu (email/parolă sau Google):
        </p>
        <ul>
          <li>Email</li>
          <li>Nume (opțional)</li>
          <li>Imagine de profil (doar pentru Google login)</li>
          <li>Parola (criptată cu bcrypt — nu o vedem niciodată în clar)</li>
        </ul>
        <p className="text-sm bg-primary/5 border border-primary/20 rounded-xl p-4 mt-3">
          <strong>Temei legal:</strong> executarea contractului (art. 6 alin. 1
          lit. b GDPR) — pentru a-ți permite să folosești serviciile
          platformei.
        </p>

        <p className="font-semibold mt-4">C. Date tehnice</p>
        <ul>
          <li>Cookie de sesiune (autentificare)</li>
          <li>Cookie de preferințe (țara aleasă — FR, DE, IT, UK)</li>
          <li>Adresa IP (în log-urile serverului, pentru securitate)</li>
        </ul>
      </>
    ),
  },
  {
    n: "03",
    icon: Clock,
    title: "Pe cât timp păstrăm datele",
    body: (
      <ul>
        <li>
          <strong>Date publice ale afacerilor:</strong> pe perioada cât anunțul
          rămâne afișat. Eliminate la cerere.
        </li>
        <li>
          <strong>Conturi utilizator:</strong> pe perioada cât contul este
          activ. Șterse la cerere.
        </li>
        <li>
          <strong>Cookie de sesiune:</strong> până la deconectare sau 30 de zile
          de inactivitate.
        </li>
        <li>
          <strong>Cookie de preferințe:</strong> 1 an.
        </li>
      </ul>
    ),
  },
  {
    n: "04",
    icon: Share2,
    title: "Cui transmitem datele",
    body: (
      <>
        <p>
          <strong>Nu vindem datele tale.</strong> Le folosim doar pentru
          funcționarea platformei. Furnizori de servicii (procesatori GDPR
          conformi):
        </p>
        <ul>
          <li>
            <strong>OVH</strong> (găzduire VPS, Franța) — date stocate în UE.
          </li>
          <li>
            <strong>Resend</strong> (trimitere email-uri tranzacționale).
          </li>
          <li>
            <strong>Google</strong> (autentificare OAuth, dacă alegi această
            metodă).
          </li>
          <li>
            <strong>Stripe</strong> (procesare plăți marketplace, dacă faci o
            achiziție).
          </li>
        </ul>
      </>
    ),
  },
  {
    n: "05",
    icon: Scale,
    title: "Drepturile tale GDPR",
    body: (
      <>
        <p>Conform GDPR, ai următoarele drepturi:</p>
        <ul>
          <li><strong>Acces</strong> — să afli ce date avem despre tine</li>
          <li><strong>Rectificare</strong> — să corectezi date incorecte</li>
          <li><strong>Ștergere</strong> („dreptul de a fi uitat”) — să-ți ștergem datele</li>
          <li><strong>Opoziție</strong> — să te opui prelucrării</li>
          <li><strong>Portabilitate</strong> — să primești datele într-un format structurat</li>
          <li><strong>Restricție</strong> — să limitezi prelucrarea</li>
          <li>
            <strong>Plângere</strong> — la autoritatea de supraveghere (CNIL în
            Franța, ANSPDCP în România etc.)
          </li>
        </ul>
        <p>
          Pentru a-ți exercita drepturile, trimite un email la{" "}
          <a href="mailto:contact@esimplu.com" className="text-primary font-medium">
            contact@esimplu.com
          </a>
          . Răspundem în maxim 30 de zile.
        </p>
      </>
    ),
  },
  {
    n: "06",
    icon: Lock,
    title: "Securitate",
    body: (
      <p>
        Site-ul folosește HTTPS (criptare TLS) pentru toate comunicațiile.
        Parolele sunt criptate cu bcrypt. Datele sunt găzduite pe servere
        securizate în Franța (OVH).
      </p>
    ),
  },
  {
    n: "07",
    icon: Cookie,
    title: "Cookie-uri",
    body: (
      <p>
        Folosim cookie-uri minime pentru funcționarea site-ului (sesiune,
        preferințe de țară). Nu folosim cookie-uri de tracking publicitar sau
        third-party analytics agresive.
      </p>
    ),
  },
  {
    n: "08",
    icon: RefreshCw,
    title: "Modificări ale politicii",
    body: (
      <p>
        Putem actualiza această politică. Modificările importante vor fi
        anunțate pe site cu cel puțin 30 de zile înainte de aplicare.
      </p>
    ),
  },
  {
    n: "09",
    icon: Mail,
    title: "Contact",
    body: (
      <p>
        Pentru orice întrebare legată de prelucrarea datelor:{" "}
        <a href="mailto:contact@esimplu.com" className="text-primary font-medium">
          contact@esimplu.com
        </a>
      </p>
    ),
  },
]

export default function ConfidentialitatePage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center flex flex-col gap-6">
          <span className="inline-block self-center text-xs uppercase tracking-widest text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">
            GDPR · Documente legale
          </span>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Politica de <span className="text-primary">confidențialitate</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Cum colectăm, folosim și protejăm datele tale personale, în
            conformitate cu Regulamentul General privind Protecția Datelor.
          </p>
          <p className="text-sm text-muted-foreground">
            Ultima actualizare: 4 mai 2026
          </p>
        </div>
      </section>

      {/* PILLARS */}
      <section className="py-16 px-6 bg-muted/40">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <div className="text-center flex flex-col gap-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              În rezumat
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Patru principii
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((p) => {
              const Icon = p.icon
              return (
                <div
                  key={p.title}
                  className="flex flex-col gap-3 p-6 rounded-2xl bg-card border text-center items-center"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold">{p.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {p.text}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECTIONS */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {SECTIONS.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.n}
                className="flex flex-col sm:flex-row gap-5 p-6 sm:p-8 rounded-2xl bg-card border"
                style={{ boxShadow: "var(--shadow-sm)" }}
              >
                <div className="flex sm:flex-col gap-3 sm:gap-2 sm:items-center sm:w-20 shrink-0">
                  <span
                    className="text-3xl sm:text-4xl font-bold text-primary/30 leading-none"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {s.n}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
                  <div className="prose prose-slate prose-sm max-w-none text-muted-foreground prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-foreground">
                    {s.body}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-6 p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border">
          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Întrebări legate de date?
          </h2>
          <p className="text-base text-muted-foreground">
            Pentru orice cerere legată de drepturile tale GDPR sau prelucrarea
            datelor, scrie-ne și răspundem în maxim 30 de zile.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              Contactează-ne <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/cum-functioneaza"
              className="bg-card border border-border px-6 py-3 rounded-lg font-medium hover:border-primary hover:text-primary transition-colors"
            >
              Cum funcționează
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
