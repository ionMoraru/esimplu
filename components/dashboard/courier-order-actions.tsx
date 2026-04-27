"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Props {
  orderId: string
  status: string
}

export function CourierOrderActions({ orderId, status }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function call(action: "handover" | "deliver") {
    setError(null)
    startTransition(async () => {
      const res = await fetch(`/api/courier/orders/${orderId}/${action}`, { method: "POST" })
      const json = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(json.error ?? "Erreur")
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="flex gap-2 pt-1">
      {status === "PAID" && (
        <Button size="sm" onClick={() => call("handover")} disabled={pending}>
          {pending ? "..." : "Pris en charge"}
        </Button>
      )}
      {status === "HANDED_OVER" && (
        <Button size="sm" onClick={() => call("deliver")} disabled={pending}>
          {pending ? "..." : "Livré"}
        </Button>
      )}
      {status === "COURIER_DELIVERED" && (
        <span className="text-xs text-muted-foreground italic">
          En attente de la confirmation du client.
        </span>
      )}
      {error && (
        <span className="text-xs text-red-700">{error}</span>
      )}
    </div>
  )
}
