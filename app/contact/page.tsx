import Link from "next/link"
import { PageHero } from "@/components/shared/navigation/page-hero"

export const metadata = {
  title: "Contact | eSimplu",
  description: "Cum ne poți contacta pentru întrebări, propuneri, revendicarea unui anunț sau eliminarea lui.",
}

export default function ContactPage() {
  return (
    <main>
      <PageHero
        title="Contact"
        subtitle="Suntem aici dacă ai întrebări, propuneri sau cereri legate de anunțul tău"
      />

      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          <div className="rounded-2xl border bg-card p-6 sm:p-8 flex flex-col gap-3">
            <h2 className="text-xl font-semibold">📧 Email general</h2>
            <p className="text-muted-foreground">
              Pentru orice întrebare, propunere sau colaborare:
            </p>
            <a
              href="mailto:contact@esimplu.com"
              className="text-primary font-medium text-lg"
            >
              contact@esimplu.com
            </a>
          </div>

          <div className="rounded-2xl border bg-card p-6 sm:p-8 flex flex-col gap-3">
            <h2 className="text-xl font-semibold">🏢 Ești proprietarul unui anunț?</h2>
            <p className="text-muted-foreground">
              Dacă vrei să revendici anunțul afișat pe site sau să ceri eliminarea lui,
              trimite-ne un email cu:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Numele afacerii așa cum apare pe eSimplu</li>
              <li>O dovadă că ești proprietarul (link Facebook, factură, atestare)</li>
              <li>Specifică dacă vrei să <strong>revendici</strong> sau să <strong>ștergi</strong> anunțul</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              Răspundem în maxim <strong>48 de ore lucrătoare</strong>.
            </p>
            <a
              href="mailto:contact@esimplu.com?subject=Revendicare%20%2F%20stergere%20anunt"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors w-fit"
            >
              Trimite cererea
            </a>
            <p className="text-xs text-muted-foreground mt-2">
              Vezi și{" "}
              <Link href="/cum-functioneaza" className="text-primary underline">
                Cum funcționează
              </Link>{" "}
              pentru explicații complete.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 sm:p-8 flex flex-col gap-3">
            <h2 className="text-xl font-semibold">🛡️ Cereri GDPR</h2>
            <p className="text-muted-foreground">
              Pentru drepturi GDPR (acces, rectificare, ștergere, opoziție, portabilitate)
              sau pentru reclamații legate de prelucrarea datelor:
            </p>
            <a
              href="mailto:contact@esimplu.com?subject=Cerere%20GDPR"
              className="text-primary font-medium"
            >
              contact@esimplu.com
            </a>
            <p className="text-xs text-muted-foreground mt-2">
              Detalii complete în{" "}
              <Link href="/confidentialitate" className="text-primary underline">
                Politica de confidențialitate
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
