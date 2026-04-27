"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function CustomerConfirmDelivery({ orderId }: { orderId: string }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function confirm() {
    setError(null)
    startTransition(async () => {
      const res = await fetch(`/api/orders/${orderId}/confirm-delivery`, {
        method: "POST",
      })
      const json = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(json.error ?? "Erreur de confirmation")
        return
      }
      router.refresh()
    })
  }

  return (
    <section className="rounded border border-emerald-300 bg-emerald-50 p-4 space-y-2">
      <p className="text-sm font-medium text-emerald-900">
        Le livreur indique vous avoir remis le colis.
      </p>
      <p className="text-sm text-emerald-900">
        Pouvez-vous confirmer que vous avez bien reçu votre commande ?
      </p>
      <Button onClick={confirm} disabled={pending}>
        {pending ? "Confirmation..." : "Oui, j'ai bien reçu ma commande"}
      </Button>
      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}
    </section>
  )
}
