import Link from "next/link"
import { PageHero } from "@/components/shared/navigation/page-hero"

export const metadata = {
  title: "Politica de confidențialitate | eSimplu",
  description: "Cum colectăm, folosim și protejăm datele tale personale pe eSimplu, în conformitate cu GDPR.",
}

export default function ConfidentialitatePage() {
  return (
    <main>
      <PageHero
        title="Politica de confidențialitate"
        subtitle="Cum protejăm datele tale, conform GDPR"
      />

      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <p className="text-sm text-muted-foreground">
            Ultima actualizare: 4 mai 2026
          </p>

          <h2 className="text-2xl font-semibold mt-6">1. Cine suntem</h2>
          <p>
            eSimplu este o platformă online dedicată diasporei române și moldovenești
            din Franța, Germania, Italia și Marea Britanie. Operatorul prelucrării
            datelor în sensul GDPR este echipa eSimplu, contactabilă la{" "}
            <a href="mailto:contact@esimplu.com" className="text-primary font-medium">
              contact@esimplu.com
            </a>
            .
          </p>

          <h2 className="text-2xl font-semibold">2. Ce date colectăm</h2>
          <h3 className="text-lg font-semibold mt-4">A. Date despre afacerile listate în directorul de servicii</h3>
          <p>
            Pentru directorul de servicii, colectăm date <strong>publicate deja public</strong>{" "}
            de către proprietarii afacerilor pe pagini Facebook publice, Google Maps,
            Pages Jaunes, Cylex, Yell, PagineGialle, site-uri oficiale și alte surse
            publice verificabile:
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
          <p>
            <strong>Temei legal:</strong> interes legitim (art. 6 alin. 1 lit. f GDPR) —
            facilitarea conexiunii între afacerile diasporei și comunitatea română/moldovenească.
            Datele utilizate sunt deja publice și colectate exclusiv din surse oficiale.
          </p>
          <p>
            <strong>Drepturile proprietarului:</strong> orice proprietar poate revendica
            anunțul, modifica datele sau cere eliminarea imediată — vezi{" "}
            <Link href="/cum-functioneaza" className="text-primary font-medium">
              Cum funcționează
            </Link>
            .
          </p>

          <h3 className="text-lg font-semibold mt-4">B. Date despre utilizatorii cu cont</h3>
          <p>
            Dacă îți creezi cont pe eSimplu (email/parolă sau Google):
          </p>
          <ul>
            <li>Email</li>
            <li>Nume (opțional)</li>
            <li>Imagine de profil (doar pentru Google login)</li>
            <li>Parola (criptată cu bcrypt — nu o vedem niciodată în clar)</li>
          </ul>
          <p>
            <strong>Temei legal:</strong> executarea contractului (art. 6 alin. 1 lit. b GDPR) —
            pentru a-ți permite să folosești serviciile platformei.
          </p>

          <h3 className="text-lg font-semibold mt-4">C. Date tehnice</h3>
          <p>
            Pentru funcționarea site-ului colectăm minimal:
          </p>
          <ul>
            <li>Cookie de sesiune (autentificare)</li>
            <li>Cookie de preferințe (țara aleasă — FR, DE, IT, UK)</li>
            <li>Adresa IP (în log-urile serverului, pentru securitate)</li>
          </ul>

          <h2 className="text-2xl font-semibold">3. Pe cât timp păstrăm datele</h2>
          <ul>
            <li>Date publice ale afacerilor: pe perioada cât anunțul rămâne afișat. Eliminate la cerere.</li>
            <li>Conturi utilizator: pe perioada cât contul este activ. Șterse la cerere.</li>
            <li>Cookie de sesiune: până la deconectare sau 30 de zile de inactivitate.</li>
            <li>Cookie de preferințe: 1 an.</li>
          </ul>

          <h2 className="text-2xl font-semibold">4. Cui transmitem datele</h2>
          <p>
            <strong>Nu vindem datele tale.</strong> Le folosim doar pentru funcționarea
            platformei. Furnizori de servicii (procesatori GDPR conformi):
          </p>
          <ul>
            <li><strong>OVH</strong> (găzduire VPS, Franța) — date stocate în UE.</li>
            <li><strong>Resend</strong> (trimitere email-uri tranzacționale).</li>
            <li><strong>Google</strong> (autentificare OAuth, dacă alegi această metodă).</li>
            <li><strong>Stripe</strong> (procesare plăți marketplace, dacă faci o achiziție).</li>
          </ul>

          <h2 className="text-2xl font-semibold">5. Drepturile tale GDPR</h2>
          <p>
            Conform GDPR, ai următoarele drepturi:
          </p>
          <ul>
            <li><strong>Acces</strong> — să afli ce date avem despre tine</li>
            <li><strong>Rectificare</strong> — să corectezi date incorecte</li>
            <li><strong>Ștergere</strong> („dreptul de a fi uitat”) — să-ți ștergem datele</li>
            <li><strong>Opoziție</strong> — să te opui prelucrării</li>
            <li><strong>Portabilitate</strong> — să primești datele într-un format structurat</li>
            <li><strong>Restricție</strong> — să limitezi prelucrarea</li>
            <li><strong>Plângere</strong> — la autoritatea de supraveghere (CNIL în Franța, ANSPDCP în România etc.)</li>
          </ul>
          <p>
            Pentru a-ți exercita drepturile, trimite un email la{" "}
            <a href="mailto:contact@esimplu.com" className="text-primary font-medium">
              contact@esimplu.com
            </a>
            . Răspundem în maxim 30 de zile.
          </p>

          <h2 className="text-2xl font-semibold">6. Securitate</h2>
          <p>
            Site-ul folosește HTTPS (criptare TLS) pentru toate comunicațiile.
            Parolele sunt criptate cu bcrypt. Datele sunt găzduite pe servere securizate
            în Franța (OVH).
          </p>

          <h2 className="text-2xl font-semibold">7. Modificări ale politicii</h2>
          <p>
            Putem actualiza această politică. Modificările importante vor fi anunțate
            pe site cu cel puțin 30 de zile înainte de aplicare.
          </p>

          <h2 className="text-2xl font-semibold">8. Contact</h2>
          <p>
            Pentru orice întrebare legată de prelucrarea datelor:{" "}
            <a href="mailto:contact@esimplu.com" className="text-primary font-medium">
              contact@esimplu.com
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}
