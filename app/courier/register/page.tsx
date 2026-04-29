import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { CourierRegisterForm } from "@/components/courier/courier-register-form"

export default async function CourierRegisterPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login?callbackUrl=/courier/register")
  }

  const existing = await prisma.courierProfile.findUnique({ where: { userId: user.id } })
  if (existing) {
    if (existing.approved) {
      redirect("/dashboard/courier")
    }
    return (
      <main className="max-w-2xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Demande envoyée</h1>
        <p className="text-sm text-zinc-600">
          Votre demande de compte livreur <strong>{existing.displayName}</strong> est en cours de
          vérification. Vous serez notifié(e) par email dès qu&apos;elle sera approuvée.
        </p>
        <Link href="/dashboard" className="text-sm text-emerald-700 underline">
          ← Retour au tableau de bord
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Devenir livreur sur eSimplu</h1>
        <p className="text-sm text-zinc-600 mt-1">
          Acheminez les commandes des producteurs vers les clients de la diaspora. Vous êtes
          payé(e) directement en espèces par le client à la livraison ; eSimplu ne prélève rien
          sur votre course.
        </p>
      </header>

      <CourierRegisterForm
        defaultDisplayName={user.name ?? ""}
        userEmail={user.email ?? ""}
      />
    </main>
  )
}
