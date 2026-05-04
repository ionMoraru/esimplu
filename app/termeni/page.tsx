import Link from "next/link"
import { PageHero } from "@/components/shared/navigation/page-hero"

export const metadata = {
  title: "Termeni și condiții | eSimplu",
  description: "Termenii și condițiile de utilizare a platformei eSimplu.",
}

export default function TermeniPage() {
  return (
    <main>
      <PageHero
        title="Termeni și condiții"
        subtitle="Reguli de utilizare a platformei eSimplu"
      />

      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <p className="text-sm text-muted-foreground">
            Ultima actualizare: 4 mai 2026
          </p>

          <h2 className="text-2xl font-semibold mt-6">1. Acceptarea termenilor</h2>
          <p>
            Folosirea platformei eSimplu (eSimplu.com) implică acceptarea completă a
            acestor Termeni și condiții. Dacă nu ești de acord, te rugăm să nu folosești
            site-ul.
          </p>

          <h2 className="text-2xl font-semibold">2. Descrierea serviciului</h2>
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

          <h2 className="text-2xl font-semibold">3. Crearea unui cont</h2>
          <p>
            Pentru a folosi anumite funcționalități (revendicarea unui anunț, publicare
            de servicii / produse / trasee), trebuie să-ți creezi un cont gratuit.
            Te angajezi:
          </p>
          <ul>
            <li>Să furnizezi informații corecte și actualizate</li>
            <li>Să păstrezi parola confidențială</li>
            <li>Să fii responsabil pentru toate activitățile efectuate cu contul tău</li>
          </ul>

          <h2 className="text-2xl font-semibold">4. Conținutul publicat de utilizatori</h2>
          <p>
            Dacă publici un anunț, un produs, un traseu sau orice alt conținut, garantezi că:
          </p>
          <ul>
            <li>Ești proprietarul sau ai dreptul să publici acel conținut</li>
            <li>Conținutul este real, legal și nu încalcă drepturile altora</li>
            <li>Nu este înșelător, defăimător, obscen sau ilegal</li>
          </ul>
          <p>
            Ne rezervăm dreptul de a șterge orice conținut care încalcă aceste reguli,
            fără preaviz.
          </p>

          <h2 className="text-2xl font-semibold">5. Anunțuri pre-populate</h2>
          <p>
            O parte din anunțurile prezente pe site sunt preluate din surse publice
            pentru a oferi un punct de plecare util comunității. Fiecare proprietar
            poate revendica sau cere eliminarea anunțului oricând. Vezi{" "}
            <Link href="/cum-functioneaza" className="text-primary font-medium">
              Cum funcționează
            </Link>{" "}
            pentru detalii.
          </p>

          <h2 className="text-2xl font-semibold">6. Utilizarea acceptabilă</h2>
          <p>
            Te angajezi să nu:
          </p>
          <ul>
            <li>Folosești platforma pentru activități ilegale</li>
            <li>Hărțuiești, ameninți sau spam-ezi alți utilizatori</li>
            <li>Faci scraping automat al conținutului fără acord scris</li>
            <li>Încerci să spargi securitatea site-ului</li>
            <li>Te dai drept altă persoană sau entitate</li>
          </ul>

          <h2 className="text-2xl font-semibold">7. Limitarea răspunderii</h2>
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
            furnizorii de servicii listați pe site. Verifică întotdeauna informațiile
            independent înainte de a contracta un serviciu.
          </p>

          <h2 className="text-2xl font-semibold">8. Proprietate intelectuală</h2>
          <p>
            Conținutul original eSimplu (articole, design, cod) este proprietatea
            noastră. Conținutul publicat de utilizatori rămâne în proprietatea
            utilizatorului, dar ne acorzi licență neexclusivă să-l afișăm pe platformă.
          </p>

          <h2 className="text-2xl font-semibold">9. Suspendarea contului</h2>
          <p>
            Ne rezervăm dreptul de a suspenda sau șterge un cont care încalcă acești
            termeni, fără preaviz și fără rambursare.
          </p>

          <h2 className="text-2xl font-semibold">10. Modificări</h2>
          <p>
            Putem modifica acești termeni. Modificările importante vor fi anunțate
            pe site cu cel puțin 30 de zile înainte. Folosirea continuă a platformei
            după modificări implică acceptarea acestora.
          </p>

          <h2 className="text-2xl font-semibold">11. Legea aplicabilă</h2>
          <p>
            Acești termeni sunt guvernați de legea franceză. Orice dispute vor fi
            soluționate de instanțele competente din Franța.
          </p>

          <h2 className="text-2xl font-semibold">12. Contact</h2>
          <p>
            Pentru orice întrebare legată de termenii de utilizare:{" "}
            <a href="mailto:contact@esimplu.com" className="text-primary font-medium">
              contact@esimplu.com
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}
