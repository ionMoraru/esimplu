import Link from "next/link"
import { PageHero } from "@/components/shared/navigation/page-hero"

export const metadata = {
  title: "Despre noi | eSimplu",
  description: "Cine suntem și de ce am construit eSimplu pentru diaspora română și moldovenească din Europa.",
}

export default function DesprePage() {
  return (
    <main>
      <PageHero
        title="Despre eSimplu"
        subtitle="Platforma diasporei române și moldovenești din Europa"
      />

      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <h2 className="text-2xl font-semibold mt-0">Misiunea noastră</h2>
          <p>
            eSimplu este un proiect independent făcut de români pentru români și moldoveni
            care trăiesc în Franța, Germania, Italia și Marea Britanie. Vrem să adunăm
            într-un singur loc tot ce poate ajuta diaspora în viața de zi cu zi:
            articole utile, un director de servicii de încredere, produse locale
            și soluții de transport între țări.
          </p>

          <h2 className="text-2xl font-semibold">Ce găsești aici</h2>
          <ul>
            <li>
              <strong>Articole practice</strong> — ghiduri pas cu pas pentru cei mai noi
              sau mai vechi în țară: sănătate, impozite, locuință, școală, recunoașterea
              diplomelor și multe altele, adaptate pentru fiecare țară.
            </li>
            <li>
              <strong>Director de servicii</strong> — magazine românești, transportatori,
              saloane de coafură, traducători, contabili, restaurante. Servicii oferite
              de diasporă pentru diasporă.
            </li>
            <li>
              <strong>Marketplace</strong> (în curs) — produse direct de la producători
              din România și Moldova.
            </li>
            <li>
              <strong>Livrare</strong> (în curs) — transport persoane și colete între
              țările Europei.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold">De unde vin informațiile</h2>
          <p>
            O parte din anunțurile prezente pe site sunt preluate din surse publice
            (pagini Facebook, Google Maps, anuare publice) pentru a oferi un punct de
            plecare util comunității. Fiecare proprietar de afacere primește posibilitatea
            să își revendice anunțul, să îl modifice sau să ceară eliminarea lui.
          </p>
          <p>
            <Link href="/cum-functioneaza" className="text-primary font-medium">
              Vezi cum funcționează →
            </Link>
          </p>

          <h2 className="text-2xl font-semibold">Suntem un proiect deschis</h2>
          <p>
            Dacă ai sugestii, vrei să propui un articol, să adaugi un serviciu sau să
            colaborezi cu noi, scrie-ne pe{" "}
            <Link href="/contact" className="text-primary font-medium">
              pagina de contact
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  )
}
