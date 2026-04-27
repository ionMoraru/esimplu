"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Props {
  resource: "sellers" | "couriers"
  id: string
}

export function ApproveButton({ resource, id }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function approve() {
    setError(null)
    startTransition(async () => {
      const res = await fetch(`/api/admin/${resource}/${id}/approve`, { method: "POST" })
      const json = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(json.error ?? "Erreur")
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" onClick={approve} disabled={pending}>
        {pending ? "..." : "Approuver"}
      </Button>
      {error && <span className="text-xs text-red-700">{error}</span>}
    </div>
  )
}
