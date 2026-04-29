import { requireCourierSession } from "@/lib/auth/server-guards"
import { TripCreateForm } from "@/components/delivery/trip-create-form"

export default async function NewTripPage() {
  await requireCourierSession()
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Publică o cursă</h1>
      <p className="text-sm text-muted-foreground">
        Indică orașele, data, vehiculul și capacitatea pe care le oferi. Prețurile sunt
        orientative: aranjamentele financiare se fac direct cu clientul.
      </p>
      <TripCreateForm />
    </main>
  )
}
