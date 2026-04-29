import { requireCourierSession } from "@/lib/auth/server-guards"
import { TripCreateForm } from "@/components/delivery/trip-create-form"

export default async function NewTripPage() {
  await requireCourierSession()
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Publier un trajet</h1>
      <p className="text-sm text-muted-foreground">
        Indiquez les villes, la date, le véhicule et la capacité que vous offrez. Les prix sont
        indicatifs : les arrangements financiers se font directement avec le client.
      </p>
      <TripCreateForm />
    </main>
  )
}
