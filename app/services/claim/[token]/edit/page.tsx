import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PageHero } from "@/components/shared/navigation/page-hero"
import { updateAndPublishClaim } from "../actions"

export const dynamic = "force-dynamic"

export default async function ClaimEditPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const draft = await prisma.serviceListing.findUnique({
    where: { claimToken: token },
  })

  if (!draft || draft.status !== "DRAFT") notFound()
  if (draft.claimExpiresAt && draft.claimExpiresAt < new Date()) notFound()

  async function action(formData: FormData) {
    "use server"
    const description = (formData.get("description") as string)?.trim()
    const email = (formData.get("email") as string)?.trim()
    const whatsapp = (formData.get("whatsapp") as string)?.trim()
    const phone = (formData.get("phone") as string)?.trim()
    const photo = (formData.get("photo") as string)?.trim()

    await updateAndPublishClaim(token, {
      description: description || undefined,
      email: email || undefined,
      whatsapp: whatsapp || undefined,
      phone: phone || undefined,
      photo: photo || undefined,
    })
  }

  return (
    <main>
      <PageHero
        title="Modifică anunțul"
        subtitle="Completează / corectează datele înainte de publicare."
      />

      <section className="py-10 px-6">
        <form
          action={action}
          className="max-w-2xl mx-auto flex flex-col gap-6"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Titlu (necschimbabil)</label>
            <input
              type="text"
              value={draft.title}
              disabled
              className="px-4 py-2.5 rounded-lg border bg-muted text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Pentru a schimba titlul, contactează-ne :{" "}
              <a href="mailto:contact@esimplu.com" className="underline">
                contact@esimplu.com
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium">
              Descriere
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={draft.description}
              className="px-4 py-2.5 rounded-lg border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-sm font-medium">
              Telefon
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={draft.phone}
              className="px-4 py-2.5 rounded-lg border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="whatsapp" className="text-sm font-medium">
              WhatsApp <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              defaultValue={draft.whatsapp ?? ""}
              placeholder="+33 6 12 34 56 78"
              className="px-4 py-2.5 rounded-lg border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-muted-foreground">(recomandat — pentru a primi contactele)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={draft.email ?? ""}
              placeholder="contact@exemplu.com"
              className="px-4 py-2.5 rounded-lg border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="photo" className="text-sm font-medium">
              URL fotografie <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              id="photo"
              name="photo"
              type="url"
              defaultValue={draft.photo ?? ""}
              placeholder="https://..."
              className="px-4 py-2.5 rounded-lg border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Lasă gol pentru a păstra imaginea implicită.
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-2 pt-4 border-t">
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Salvează și publică
            </button>
            <Link
              href={`/services/claim/${token}`}
              className="text-center text-sm text-muted-foreground hover:text-foreground"
            >
              ← Înapoi la previzualizare
            </Link>
          </div>
        </form>
      </section>
    </main>
  )
}
