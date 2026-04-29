import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"

export default async function DashboardHome({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const [sellerProfile, courierProfile] = await Promise.all([
    prisma.sellerProfile.findUnique({ where: { userId: user.id } }),
    prisma.courierProfile.findUnique({ where: { userId: user.id } }),
  ])

  const sp = await searchParams
  const error = sp.error

  const errorMessages: Record<string, string> = {
    "no-seller-profile": "Vous n'avez pas encore de profil vendeur.",
    "seller-pending": "Votre compte vendeur n'est pas encore validé par un administrateur.",
    "no-courier-profile": "Vous n'avez pas encore de profil livreur.",
    "courier-pending": "Votre compte livreur n'est pas encore validé par un administrateur.",
    "admin-required": "Cette section est réservée aux administrateurs.",
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Tableau de bord</h1>
      <p className="text-sm text-zinc-600">Connecté en tant que {user.email}</p>

      {error && errorMessages[error] && (
        <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          {errorMessages[error]}
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Mes espaces</h2>
        <ul className="space-y-2">
          {sellerProfile?.approved && (
            <li>
              <Link href="/dashboard/seller" className="text-emerald-700 underline">
                Espace vendeur
              </Link>
            </li>
          )}
          {courierProfile?.approved && (
            <li>
              <Link href="/dashboard/courier" className="text-emerald-700 underline">
                Espace livreur
              </Link>
            </li>
          )}
          {user.role === "ADMIN" && (
            <li>
              <Link href="/dashboard/admin" className="text-emerald-700 underline">
                Espace administrateur
              </Link>
            </li>
          )}
          {!sellerProfile?.approved && !courierProfile?.approved && user.role !== "ADMIN" && (
            <li className="text-sm text-zinc-500">
              Aucun espace privé pour l&apos;instant.
            </li>
          )}
        </ul>
      </section>

      {!sellerProfile && user.role !== "ADMIN" && (
        <section className="rounded border p-4 space-y-2 bg-emerald-50/50">
          <h2 className="font-medium">Vous produisez ou créez ?</h2>
          <p className="text-sm text-zinc-700">
            Proposez vos produits sur la marketplace eSimplu. Inscription en 2 minutes,
            validation par notre équipe sous 48 h.
          </p>
          <Link
            href="/seller/register"
            className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Devenir vendeur →
          </Link>
        </section>
      )}

      {sellerProfile && !sellerProfile.approved && (
        <section className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">
            Demande vendeur en cours de validation
          </p>
          <p className="mt-1">
            Votre profil <strong>{sellerProfile.displayName}</strong> attend l&apos;approbation
            de notre équipe. Vous serez notifié(e) par email dès qu&apos;il sera actif.
          </p>
        </section>
      )}
    </main>
  )
}
