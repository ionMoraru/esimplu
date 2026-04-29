import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { COUNTRIES } from "@/lib/countries"
import { CATEGORY_ICONS } from "@/lib/service-category-icons"
import { PageHero } from "@/components/shared/navigation/page-hero"
import { ClaimActions } from "./claim-actions"
import { logViewed } from "./actions"

export const dynamic = "force-dynamic"

export default async function ClaimPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const draft = await prisma.serviceListing.findUnique({
    where: { claimToken: token },
    include: { category: true },
  })

  if (!draft || draft.status !== "DRAFT") notFound()
  if (draft.claimExpiresAt && draft.claimExpiresAt < new Date()) notFound()

  // Audit: log the view (fire and forget)
  await logViewed(token)

  const country = COUNTRIES.find((c) => c.code === draft.countries[0])
  const categoryIcon = draft.category
    ? CATEGORY_ICONS[draft.category.slug] ?? "📁"
    : "📁"

  const expiresStr = draft.claimExpiresAt
    ? new Date(draft.claimExpiresAt).toLocaleDateString("ro-RO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <main>
      <PageHero
        title="Confirmă-ți anunțul"
        subtitle="Ți-am pregătit un anunț în baza informațiilor publice. Verifică-l și alege ce vrei să faci."
      />

      <section className="py-10 px-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          {/* Bandeau brouillon */}
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
            <strong>📝 Acest anunț este în stare de schiță (DRAFT)</strong> —
            nu este vizibil public. Va fi șters automat dacă nu îl confirmi
            până pe <strong>{expiresStr}</strong>.
          </div>

          {/* Preview de la fiche */}
          <div
            className="flex flex-col rounded-2xl border bg-card overflow-hidden"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            <div className="relative w-full aspect-[4/3] bg-muted">
              <Image
                src={draft.photo ?? "/services/placeholder.svg"}
                alt={draft.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="flex flex-col gap-3 p-6">
              <div className="flex items-start justify-between gap-3">
                {draft.category && (
                  <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    {categoryIcon} {draft.category.name}
                  </span>
                )}
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  📍 {draft.city} {country && `· ${country.flag}`}
                </span>
              </div>

              <h1
                className="text-2xl font-semibold leading-snug"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                {draft.title}
              </h1>

              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {draft.description}
              </p>

              <div className="flex flex-col gap-1 text-sm pt-3 border-t">
                <div>
                  <span className="text-muted-foreground">Telefon : </span>
                  <span className="font-medium">{draft.phone}</span>
                </div>
                {draft.whatsapp && (
                  <div>
                    <span className="text-muted-foreground">WhatsApp : </span>
                    <span className="font-medium">{draft.whatsapp}</span>
                  </div>
                )}
                {draft.email && (
                  <div>
                    <span className="text-muted-foreground">Email : </span>
                    <span className="font-medium">{draft.email}</span>
                  </div>
                )}
              </div>

              {draft.sourceUrl && (
                <p className="text-xs text-muted-foreground pt-2 border-t">
                  Sursă date publice :{" "}
                  <a
                    href={draft.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-primary"
                  >
                    {new URL(draft.sourceUrl).hostname}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <ClaimActions token={token} />

          {/* Bas de page : RGPD */}
          <details className="rounded-lg border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            <summary className="cursor-pointer font-medium">
              De ce am informațiile tale ? (RGPD)
            </summary>
            <p className="mt-2 leading-relaxed">
              Aceste informații (titlu, telefon, oraș, descriere) au fost
              colectate manual din surse publice (pagina ta Facebook publică,
              site-ul tău, anunțuri publice) pentru a-ți propune o fișă
              gratuită pe eSimplu — directorul serviciilor pentru diaspora
              română/moldoveană din Europa. Niciun cont nu este creat în
              numele tău. Dacă alegi <strong>Șterge definitiv</strong>,
              datele sunt marcate ca refuzate și nu vor fi reutilizate. Dacă
              nu răspunzi până pe {expiresStr}, fișa este ștearsă automat.
              Pentru orice întrebare :{" "}
              <Link
                href="mailto:contact@esimplu.com"
                className="underline hover:text-primary"
              >
                contact@esimplu.com
              </Link>
              .
            </p>
          </details>
        </div>
      </section>
    </main>
  )
}
