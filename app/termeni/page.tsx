import Link from "next/link"
import {
  CheckCircle2,
  ListChecks,
  UserPlus,
  Megaphone,
  Database,
  Ban,
  AlertTriangle,
  Copyright,
  ShieldOff,
  RefreshCw,
  Scale,
  Mail,
  ArrowRight,
} from "lucide-react"

export const metadata = {
  title: "Termeni și condiții | eSimplu",
  description: "Termenii și condițiile de utilizare a platformei eSimplu.",
}

const SECTIONS = [
  {
    n: "01",
    icon: CheckCircle2,
    title: "Acceptarea termenilor",
    body: (
      <p>
        Folosirea platformei eSimplu (eSimplu.com) implică acceptarea completă
        a acestor Termeni și condiții. Dacă nu ești de acord, te rugăm să nu
        folosești site-ul.
      </p>
    ),
  },
  {
    n: "02",
    icon: ListChecks,
    title: "Descrierea serviciului",
    body: (
      <>
        <p>
          eSimplu este o platformă gratuită care oferă diasporei române și
          moldovenești din Franța, Germania, Italia și Marea Britanie:
        </p>
        <ul>
          <li>Articole informative</li>
          <li>Director de servicii oferite de comunitate</li>
          <li>Marketplace de produse (în curs de dezvoltare)</li>
          <li>Servicii de transport între țări (în curs de dezvoltare)</li>
        </ul>
      </>
    ),
  },
  {
    n: "03",
    icon: UserPlus,
    title: "Crearea unui cont",
    body: (
      <>
        <p>
          Pentru a folosi anumite funcționalități (revendicarea unui anunț,
          publicare de servicii / produse / trasee), trebuie să-ți creezi un
          cont gratuit. Te angajezi:
        </p>
        <ul>
          <li>Să furnizezi informații corecte și actualizate</li>
          <li>Să păstrezi parola confidențială</li>
          <li>Să fii responsabil pentru toate activitățile efectuate cu contul tău</li>
        </ul>
      </>
    ),
  },
  {
    n: "04",
    icon: Megaphone,
    title: "Conținutul publicat de utilizatori",
    body: (
      <>
        <p>
          Dacă publici un anunț, un produs, un traseu sau orice alt conținut,
          garantezi că:
        </p>
        <ul>
          <li>Ești proprietarul sau ai dreptul să publici acel conținut</li>
          <li>Conținutul este real, legal și nu încalcă drepturile altora</li>
          <li>Nu este înșelător, defăimător, obscen sau ilegal</li>
        </ul>
        <p>
          Ne rezervăm dreptul de a șterge orice conținut care încalcă aceste
          reguli, fără preaviz.
        </p>
      </>
    ),
  },
  {
    n: "05",
    icon: Database,
    title: "Anunțuri pre-populate",
    body: (
      <p>
        O parte din anunțurile prezente pe site sunt preluate din surse publice
        pentru a oferi un punct de plecare util comunității. Fiecare proprietar
        poate revendica sau cere eliminarea anunțului oricând. Vezi{" "}
        <Link href="/cum-functioneaza" className="text-primary font-medium">
          Cum funcționează
        </Link>{" "}
        pentru detalii.
      </p>
    ),
  },
  {
    n: "06",
    icon: Ban,
    title: "Utilizarea acceptabilă",
    body: (
      <>
        <p>Te angajezi să nu:</p>
        <ul>
          <li>Folosești platforma pentru activități ilegale</li>
          <li>Hărțuiești, ameninți sau spam-ezi alți utilizatori</li>
          <li>Faci scraping automat al conținutului fără acord scris</li>
          <li>Încerci să spargi securitatea site-ului</li>
          <li>Te dai drept altă persoană sau entitate</li>
        </ul>
      </>
    ),
  },
  {
    n: "07",
    icon: AlertTriangle,
    title: "Limitarea răspunderii",
    body: (
      <>
        <p>
          eSimplu este oferit „așa cum este”. Nu garantăm:
        </p>
        <ul>
          <li>Acuratețea sau completitudinea informațiilor publicate</li>
          <li>Calitatea sau disponibilitatea serviciilor anunțate de terți</li>
          <li>Accesul neîntrerupt la site</li>
        </ul>
        <p>
          Articolele sunt orientative — pentru decizii importante (juridice,
          fiscale, medicale), consultă un specialist autorizat.
        </p>
        <p>
          Nu răspundem pentru tranzacțiile efectuate între utilizatori și
          furnizorii de servicii listați pe site. Verifică întotdeauna
          informațiile independent înainte de a contracta un serviciu.
        </p>
      </>
    ),
  },
  {
    n: "08",
    icon: Copyright,
    title: "Proprietate intelectuală",
    body: (
      <p>
        Conținutul original eSimplu (articole, design, cod) este proprietatea
        noastră. Conținutul publicat de utilizatori rămâne în proprietatea
        utilizatorului, dar ne acorzi licență neexclusivă să-l afișăm pe
        platformă.
      </p>
    ),
  },
  {
    n: "09",
    icon: ShieldOff,
    title: "Suspendarea contului",
    body: (
      <p>
        Ne rezervăm dreptul de a suspenda sau șterge un cont care încalcă
        acești termeni, fără preaviz și fără rambursare.
      </p>
    ),
  },
  {
    n: "10",
    icon: RefreshCw,
    title: "Modificări",
    body: (
      <p>
        Putem modifica acești termeni. Modificările importante vor fi anunțate
        pe site cu cel puțin 30 de zile înainte. Folosirea continuă a
        platformei după modificări implică acceptarea acestora.
      </p>
    ),
  },
  {
    n: "11",
    icon: Scale,
    title: "Legea aplicabilă",
    body: (
      <p>
        Acești termeni sunt guvernați de legea franceză. Orice dispute vor fi
        soluționate de instanțele competente din Franța.
      </p>
    ),
  },
  {
    n: "12",
    icon: Mail,
    title: "Contact",
    body: (
      <p>
        Pentru orice întrebare legată de termenii de utilizare:{" "}
        <a href="mailto:contact@esimplu.com" className="text-primary font-medium">
          contact@esimplu.com
        </a>
      </p>
    ),
  },
]

export default function TermeniPage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center flex flex-col gap-6">
          <span className="inline-block self-center text-xs uppercase tracking-widest text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">
            Documente legale
          </span>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Termeni și <span className="text-primary">condiții</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Reguli simple și clare pentru folosirea platformei eSimplu — pentru
            ca lucrurile să meargă cum trebuie pentru toți.
          </p>
          <p className="text-sm text-muted-foreground">
            Ultima actualizare: 4 mai 2026
          </p>
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
            Ai întrebări?
          </h2>
          <p className="text-base text-muted-foreground">
            Suntem deschiși la dialog. Dacă ceva nu e clar sau ai nevoie de
            explicații suplimentare, scrie-ne.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              Contactează-ne <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/confidentialitate"
              className="bg-card border border-border px-6 py-3 rounded-lg font-medium hover:border-primary hover:text-primary transition-colors"
            >
              Politica de confidențialitate
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
