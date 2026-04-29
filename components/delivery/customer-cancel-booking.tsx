"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function CustomerCancelBookingButton({ bookingId }: { bookingId: string }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function cancel() {
    if (!confirm("Annuler cette réservation ?")) return
    setError(null)
    startTransition(async () => {
      const res = await fetch(`/api/delivery/bookings/${bookingId}/cancel`, { method: "POST" })
      const json = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(json.error ?? "Erreur")
        return
      }
      router.refresh()
    })
  }

  return (
    <div>
      <Button variant="outline" size="sm" onClick={cancel} disabled={pending}>
        {pending ? "Annulation..." : "Annuler ma réservation"}
      </Button>
      {error && <p className="text-xs text-red-700 mt-1">{error}</p>}
    </div>
  )
}
