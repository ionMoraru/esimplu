import Link from "next/link"
import { PageHero } from "@/components/shared/navigation/page-hero"

export default function ClaimRefusedPage() {
  return (
    <main>
      <PageHero
        title="Anunț șters"
        subtitle="Datele tale au fost marcate ca refuzate și nu vor fi reutilizate."
      />
      <section className="py-16 px-6">
        <div className="max-w-xl mx-auto text-center flex flex-col gap-4">
          <div className="text-6xl">🗑️</div>
          <p className="text-base text-muted-foreground">
            Mulțumim pentru răspuns. Dacă ai întrebări, ne poți contacta la{" "}
            <a
              href="mailto:contact@esimplu.com"
              className="underline hover:text-primary"
            >
              contact@esimplu.com
            </a>
            .
          </p>
          <div className="flex justify-center mt-4">
            <Link
              href="/"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90"
            >
              Acasă
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
