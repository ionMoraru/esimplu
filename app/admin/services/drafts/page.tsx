import Link from "next/link"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { PageHero } from "@/components/shared/navigation/page-hero"
import { COUNTRIES } from "@/lib/countries"
import { claimUrl } from "@/lib/invitations"
import { DraftRowActions } from "./row-actions"

export const dynamic = "force-dynamic"

const STATUS_FILTERS = [
  { key: "PENDING", label: "În așteptare claim" },
  { key: "CLAIMED", label: "Confirmate de proprietar" },
  { key: "REFUSED", label: "Refuzate" },
  { key: "EXPIRED", label: "Expirate" },
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
  const status = (sp.status ?? "PENDING") as string

  const invitations = await prisma.invitation.findMany({
    where: {
      targetType: "SERVICE",
      status: status as never,
    },
    include: {
      events: { orderBy: { createdAt: "desc" }, take: 5 },
    },
    orderBy: { updatedAt: "desc" },
  })

  const targetIds = invitations.map((i) => i.targetId)
  const services = targetIds.length
    ? await prisma.serviceListing.findMany({
        where: { id: { in: targetIds } },
        include: { category: true },
      })
    : []
  const serviceById = new Map(services.map((s) => [s.id, s]))

  const counts = await prisma.invitation.groupBy({
    by: ["status"],
    where: { targetType: "SERVICE" },
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

          <div className="rounded-xl bg-muted/40 border px-4 py-3 text-sm text-muted-foreground">
            Pour créer un nouveau draft, utilise la CLI :
            <code className="block mt-2 px-3 py-2 bg-background rounded text-xs font-mono">
              {`npm run service:draft -- --title "..." --category mutari-transport --city Paris --country fr --phone +33... --description "..."`}
            </code>
          </div>

          {invitations.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nicio invitație cu acest status.
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
                    <th className="text-left px-4 py-3">Ultim eveniment</th>
                    <th className="text-left px-4 py-3">Sursă</th>
                    <th className="text-right px-4 py-3">Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((inv) => {
                    const s = serviceById.get(inv.targetId)
                    const country = s
                      ? COUNTRIES.find((c) => c.code === s.countries[0])
                      : null
                    const lastEvent = inv.events[0]
                    const lastOutreach = inv.events.find(
                      (e) => e.type === "outreach_sent"
                    )
                    const outreachMethod =
                      lastOutreach &&
                      typeof lastOutreach.payload === "object" &&
                      lastOutreach.payload !== null &&
                      "method" in lastOutreach.payload
                        ? String(
                            (lastOutreach.payload as { method?: string }).method
                          )
                        : null
                    const daysLeft =
                      status === "PENDING"
                        ? Math.ceil(
                            (inv.expiresAt.getTime() - now.getTime()) /
                              86400000
                          )
                        : null
                    const url =
                      inv.status === "PENDING" ? claimUrl(inv.token) : null
                    return (
                      <tr key={inv.id} className="border-t hover:bg-muted/20">
                        <td className="px-4 py-3">
                          <div className="font-medium">{s?.title ?? "—"}</div>
                          <div className="text-xs text-muted-foreground">
                            {s?.category?.name}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {country?.flag} {s?.city}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {s?.phone}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span>
                              {inv.expiresAt.toISOString().slice(0, 10)}
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
                          {inv.sourceUrl ? (
                            <a
                              href={inv.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline text-xs"
                            >
                              {(() => {
                                try {
                                  return new URL(inv.sourceUrl).hostname
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
                            invitationId={inv.id}
                            claimUrl={url}
                            status={inv.status}
                            outreachMethod={outreachMethod}
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
