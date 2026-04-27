"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Courier {
  id: string
  displayName: string
  baseCity: string | null
  baseCountry: string
}

interface Props {
  orderId: string
  status: string
  hasCourier: boolean
  couriers: Courier[]
}

export function AdminOrderActions({ orderId, status, hasCourier, couriers }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [selectedCourier, setSelectedCourier] = useState<string>(couriers[0]?.id ?? "")
  const router = useRouter()

  function call(path: string, body?: unknown) {
    setError(null)
    startTransition(async () => {
      const res = await fetch(path, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })
      const json = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(json.error ?? "Erreur")
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {status === "PENDING_PAYMENT" && (
        <Button
          size="sm"
          onClick={() => call(`/api/admin/orders/${orderId}/mark-paid`, {})}
          disabled={pending}
        >
          Marquer payée
        </Button>
      )}
      {(status === "PAID" || status === "HANDED_OVER") && !hasCourier && couriers.length > 0 && (
        <div className="flex items-center gap-2">
          <select
            value={selectedCourier}
            onChange={(e) => setSelectedCourier(e.target.value)}
            className="text-xs rounded border px-2 py-1 bg-background"
          >
            {couriers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.displayName}{c.baseCity ? ` (${c.baseCity})` : ""}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            onClick={() =>
              call(`/api/admin/orders/${orderId}/assign-courier`, { courierId: selectedCourier })
            }
            disabled={pending || !selectedCourier}
          >
            Assigner livreur
          </Button>
        </div>
      )}
      {status === "DELIVERED" && (
        <Button
          size="sm"
          onClick={() => call(`/api/admin/orders/${orderId}/settle`)}
          disabled={pending}
        >
          Libérer l&apos;escrow
        </Button>
      )}
      {error && <span className="text-xs text-red-700 self-center">{error}</span>}
    </div>
  )
}
