"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function CourierBookingActions({ bookingId }: { bookingId: string }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [showReject, setShowReject] = useState(false)
  const [reason, setReason] = useState("")
  const router = useRouter()

  function call(action: "accept" | "reject", body?: unknown) {
    setError(null)
    startTransition(async () => {
      const res = await fetch(`/api/courier/bookings/${bookingId}/${action}`, {
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
    <div className="space-y-2 pt-1">
      <div className="flex gap-2">
        <Button size="sm" onClick={() => call("accept")} disabled={pending}>
          Accepter
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowReject(!showReject)}
          disabled={pending}
        >
          Refuser
        </Button>
      </div>
      {showReject && (
        <div className="space-y-2">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            maxLength={500}
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Raison du refus (facultatif, visible par le client)"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => call("reject", reason ? { reason } : undefined)}
            disabled={pending}
          >
            Confirmer le refus
          </Button>
        </div>
      )}
      {error && <span className="text-xs text-red-700 block">{error}</span>}
    </div>
  )
}
