import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { SellerRegisterForm } from "@/components/seller/seller-register-form"

export default async function SellerRegisterPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login?callbackUrl=/seller/register")
  }

  // Si l'utilisateur a déjà un profil vendeur, on l'envoie sur son dashboard
  // (ou sur le hub avec le message d'attente d'approbation).
  const existing = await prisma.sellerProfile.findUnique({ where: { userId: user.id } })
  if (existing) {
    if (existing.approved) {
      redirect("/dashboard/seller")
    }
    return (
      <main className="max-w-2xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Demande envoyée</h1>
        <p className="text-sm text-zinc-600">
          Votre demande de compte vendeur <strong>{existing.displayName}</strong> est en cours de
          vérification par notre équipe. Vous serez notifié(e) par email dès qu&apos;elle sera approuvée.
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
        <h1 className="text-2xl font-semibold">Devenir vendeur sur eSimplu</h1>
        <p className="text-sm text-zinc-600 mt-1">
          Remplissez ce formulaire pour proposer vos produits sur la marketplace. Votre demande
          sera examinée par notre équipe avant publication.
        </p>
      </header>

      <SellerRegisterForm
        defaultDisplayName={user.name ?? ""}
        userEmail={user.email ?? ""}
      />
    </main>
  )
}
