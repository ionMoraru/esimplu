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

  const existing = await prisma.sellerProfile.findUnique({ where: { userId: user.id } })
  if (existing) {
    if (existing.approved) {
      redirect("/dashboard/seller")
    }
    return (
      <main className="max-w-2xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Cerere trimisă</h1>
        <p className="text-sm text-zinc-600">
          Cererea ta de cont vânzător <strong>{existing.displayName}</strong> este în curs de
          verificare de către echipa noastră. Vei fi notificat(ă) pe email imediat ce va fi aprobată.
        </p>
        <Link href="/dashboard" className="text-sm text-emerald-700 underline">
          ← Înapoi la panou
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Devino vânzător pe eSimplu</h1>
        <p className="text-sm text-zinc-600 mt-1">
          Completează acest formular pentru a-ți propune produsele pe marketplace. Cererea va fi
          examinată de echipa noastră înainte de publicare.
        </p>
      </header>

      <SellerRegisterForm
        defaultDisplayName={user.name ?? ""}
        userEmail={user.email ?? ""}
      />
    </main>
  )
}
