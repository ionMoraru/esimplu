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
        <h1 className="text-2xl font-semibold">Cerere trimisă</h1>
        <p className="text-sm text-zinc-600">
          Cererea ta de cont transportator <strong>{existing.displayName}</strong> este în curs de
          verificare. Vei fi notificat(ă) pe email imediat ce va fi aprobată.
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
        <h1 className="text-2xl font-semibold">Devino transportator pe eSimplu</h1>
        <p className="text-sm text-zinc-600 mt-1">
          Transportă comenzile producătorilor către clienții din diaspora. Ești plătit(ă) direct
          de către client la livrare; eSimplu nu reține nimic din cursa ta.
        </p>
      </header>

      <CourierRegisterForm
        defaultDisplayName={user.name ?? ""}
        userEmail={user.email ?? ""}
      />
    </main>
  )
}
