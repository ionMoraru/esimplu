import Link from "next/link"
import { PageHero } from "@/components/shared/navigation/page-hero"

export const metadata = {
  title: "Cum funcționează | eSimplu",
  description: "Cum sunt colectate și gestionate anunțurile de servicii pe eSimplu, și cum poți revendica sau elimina anunțul tău.",
}

export default function CumFunctioneazaPage() {
  return (
    <main>
      <PageHero
        title="Cum funcționează"
        subtitle="Transparență despre cum colectăm și gestionăm anunțurile pe eSimplu"
      />

      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <h2 className="text-2xl font-semibold mt-0">De ce vezi anunțuri pe care nu le-ai publicat tu</h2>
          <p>
            Pentru ca diaspora română și moldovenească să găsească rapid serviciile de
            care are nevoie, am pre-populat directorul nostru cu informații preluate din
            surse publice: pagini Facebook publice ale afacerilor, Google Maps, Pages
            Jaunes, Cylex, Yell, PagineGialle și site-urile oficiale ale acestor afaceri.
          </p>
          <p>
            <strong>Niciun anunț nu este creat fără o sursă publică verificabilă.</strong>{" "}
            Toate datele afișate (nume, telefon, adresă, descriere) sunt deja publice și
            puse la dispoziție de proprietarul afacerii pe internet.
          </p>

          <h2 className="text-2xl font-semibold">Drepturile tale dacă ești proprietarul unui anunț</h2>
          <p>
            Fiecare afacere afișată pe eSimplu este însoțită de un mecanism de revendicare.
            Ca proprietar, ai trei opțiuni:
          </p>
          <ol>
            <li>
              <strong>Revendică anunțul</strong> — îți creezi un cont gratuit pe eSimplu
              și preiei controlul asupra fișei. Poți modifica datele, adăuga fotografii,
              programul de lucru sau alte detalii.
            </li>
            <li>
              <strong>Cere eliminarea</strong> — dacă nu vrei să apari pe site, anunțul
              tău este șters imediat la cerere, fără întrebări.
            </li>
            <li>
              <strong>Nu faci nimic</strong> — anunțul rămâne afișat cu informațiile
              publice, vizibil de comunitate. Poți reveni oricând să îl revendici sau
              să ceri eliminarea.
            </li>
          </ol>

          <h2 className="text-2xl font-semibold">Cum revendici anunțul</h2>
          <p>
            Există două căi:
          </p>
          <ul>
            <li>
              Dacă am reușit să te contactăm și ți-am trimis un link de revendicare
              prin email, SMS, WhatsApp sau comentariu pe Facebook —{" "}
              <strong>apasă pe acel link</strong> pentru a accesa pagina ta dedicată.
            </li>
            <li>
              Dacă vezi anunțul tău pe site dar nu ai primit un link, scrie-ne pe{" "}
              <Link href="/contact" className="text-primary font-medium">
                pagina de contact
              </Link>{" "}
              cu numele afacerii și o dovadă că ești proprietarul (link către pagina
              ta Facebook, factură, atestare). Îți generăm un link nou în cel mult 48 de
              ore.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold">Cum ceri eliminarea</h2>
          <p>
            La fel de simplu — folosește pagina de contact sau scrie direct la{" "}
            <a href="mailto:contact@esimplu.com" className="text-primary font-medium">
              contact@esimplu.com
            </a>{" "}
            cu numele afacerii și menționează că ceri eliminarea anunțului. Procesăm
            cererea în maxim 48 de ore lucrătoare.
          </p>
          <p>
            <strong>Nu îți cerem motive, nu îți punem întrebări, nu trebuie să justifici.</strong>{" "}
            Dreptul la eliminare este absolut.
          </p>

          <h2 className="text-2xl font-semibold">Confidențialitate și GDPR</h2>
          <p>
            Respectăm Regulamentul General privind Protecția Datelor (GDPR). Pentru
            detalii complete, vezi{" "}
            <Link href="/confidentialitate" className="text-primary font-medium">
              Politica de confidențialitate
            </Link>
            .
          </p>
          <p>
            Pe scurt:
          </p>
          <ul>
            <li>Folosim doar date publice colectate de pe surse oficiale.</li>
            <li>Nu vindem și nu transmitem datele tale către terți.</li>
            <li>Ai drept de acces, rectificare și ștergere oricând.</li>
            <li>Pentru orice solicitare GDPR, contactează-ne la <a href="mailto:contact@esimplu.com" className="text-primary font-medium">contact@esimplu.com</a>.</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
