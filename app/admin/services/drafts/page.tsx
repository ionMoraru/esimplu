import Link from "next/link"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { PageHero } from "@/components/shared/navigation/page-hero"
import { COUNTRIES } from "@/lib/countries"
import { claimUrl } from "@/lib/services/claim"
import { DraftRowActions } from "./row-actions"

export const dynamic = "force-dynamic"

const STATUS_FILTERS = [
  { key: "DRAFT", label: "Drafts" },
  { key: "PUBLISHED", label: "Publicate" },
  { key: "OWNER_REFUSED", label: "Refuzate de proprietar" },
  { key: "EXPIRED", label: "Expirate" },
  { key: "REJECTED", label: "Șterse de admin" },
  { key: "PENDING", label: "În așteptare admin" },
] as const

export default async function AdminDraftsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const session = await auth()
  const email = session?.user?.email
  if (!email) redirect("/login?callbackUrl=/admin/services/drafts")

  const me = await prisma.user.findUnique({ where: { email } })
  if (!me || me.role !== "ADMIN") {
    return (
      <main className="py-20 px-6 text-center">
        <p className="text-lg">Acces interzis. Cont admin necesar.</p>
      </main>
    )
  }

  const sp = await searchParams
  const status = (sp.status ?? "DRAFT") as string

  const services = await prisma.serviceListing.findMany({
    where: { status: status as never },
    include: {
      category: true,
      events: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  })

  const counts = await prisma.serviceListing.groupBy({
    by: ["status"],
    _count: { _all: true },
  })
  const countByStatus = Object.fromEntries(
    counts.map((c) => [c.status, c._count._all])
  )

  const now = new Date()

  return (
    <main>
      <PageHero
        title="Admin · Drafts services"
        subtitle="Gestionează fișele pre-completate (claim flow)"
      />

      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((f) => {
              const active = status === f.key
              const count = countByStatus[f.key] ?? 0
              return (
                <Link
                  key={f.key}
                  href={`/admin/services/drafts?status=${f.key}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border hover:border-primary"
                  }`}
                >
                  {f.label}{" "}
                  <span className={active ? "opacity-80" : "text-muted-foreground"}>
                    ({count})
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Quick action: create a new draft */}
          <div className="rounded-xl bg-muted/40 border px-4 py-3 text-sm text-muted-foreground">
            Pour créer un nouveau draft, utilise la CLI :
            <code className="block mt-2 px-3 py-2 bg-background rounded text-xs font-mono">
              {`npm run service:draft -- --title "..." --category mutari-transport --city Paris --country fr --phone +33... --description "..."`}
            </code>
          </div>

          {/* Table */}
          {services.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nicio fișă cu acest status.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-3">Titlu</th>
                    <th className="text-left px-4 py-3">Loc</th>
                    <th className="text-left px-4 py-3">Tel</th>
                    <th className="text-left px-4 py-3">Expiră</th>
                    <th className="text-left px-4 py-3">Ultimul eveniment</th>
                    <th className="text-left px-4 py-3">Sursă</th>
                    <th className="text-right px-4 py-3">Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s) => {
                    const country = COUNTRIES.find(
                      (c) => c.code === s.countries[0]
                    )
                    const lastEvent = s.events[0]
                    const daysLeft =
                      s.claimExpiresAt && status === "DRAFT"
                        ? Math.ceil(
                            (s.claimExpiresAt.getTime() - now.getTime()) /
                              86400000
                          )
                        : null
                    const url = s.claimToken ? claimUrl(s.claimToken) : null
                    return (
                      <tr key={s.id} className="border-t hover:bg-muted/20">
                        <td className="px-4 py-3">
                          <div className="font-medium">{s.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {s.category?.name}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {country?.flag} {s.city}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">{s.phone}</td>
                        <td className="px-4 py-3">
                          {s.claimExpiresAt ? (
                            <div className="flex flex-col">
                              <span>
                                {s.claimExpiresAt
                                  .toISOString()
                                  .slice(0, 10)}
                              </span>
                              {daysLeft !== null && (
                                <span
                                  className={`text-xs ${
                                    daysLeft < 7
                                      ? "text-amber-600"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {daysLeft > 0
                                    ? `dans ${daysLeft}j`
                                    : "expiré"}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {lastEvent ? (
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {lastEvent.type}
                              </span>
                              <span className="text-muted-foreground">
                                {lastEvent.createdAt
                                  .toISOString()
                                  .slice(0, 16)
                                  .replace("T", " ")}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {s.sourceUrl ? (
                            <a
                              href={s.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline text-xs"
                            >
                              {(() => {
                                try {
                                  return new URL(s.sourceUrl).hostname
                                } catch {
                                  return "lien"
                                }
                              })()}
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DraftRowActions
                            serviceId={s.id}
                            claimUrl={url}
                            status={s.status}
                            claimMethod={s.claimMethod}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
