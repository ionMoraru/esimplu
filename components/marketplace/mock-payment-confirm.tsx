"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function MockPaymentConfirm({ orderId }: { orderId: string }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function confirm() {
    setError(null)
    startTransition(async () => {
      const res = await fetch("/api/payments/mock-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      })
      const json = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(json.error ?? "Erreur de confirmation")
        return
      }
      router.push(`/orders/${orderId}`)
    })
  }

  return (
    <div className="space-y-3">
      <Button onClick={confirm} disabled={pending} className="w-full">
        {pending ? "Confirmation..." : "Confirmer le paiement (mock)"}
      </Button>
      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}
    </div>
  )
}
