"use client"

import { useState, useTransition } from "react"
import {
  regenerateClaimToken,
  markOutreachSent,
  deleteDraft,
} from "./actions"

export function DraftRowActions({
  serviceId,
  claimUrl,
  status,
  claimMethod,
}: {
  serviceId: string
  claimUrl: string | null
  status: string
  claimMethod: string | null
}) {
  const [pending, startTransition] = useTransition()
  const [copied, setCopied] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (status !== "DRAFT") {
    return <span className="text-xs text-muted-foreground">—</span>
  }

  return (
    <div className="flex flex-col gap-1.5 items-end">
      {claimUrl && (
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(claimUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
          className="text-xs px-3 py-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          {copied ? "✓ Copiat" : "📋 Copiază URL"}
        </button>
      )}

      <div className="flex gap-1">
        <button
          type="button"
          disabled={pending || claimMethod === "sms"}
          onClick={() =>
            startTransition(async () => {
              await markOutreachSent(serviceId, "sms")
            })
          }
          className={`text-xs px-2 py-1 rounded border transition-colors disabled:opacity-50 ${
            claimMethod === "sms"
              ? "bg-green-50 border-green-300 text-green-700"
              : "hover:border-primary"
          }`}
        >
          SMS {claimMethod === "sms" && "✓"}
        </button>
        <button
          type="button"
          disabled={pending || claimMethod === "email"}
          onClick={() =>
            startTransition(async () => {
              await markOutreachSent(serviceId, "email")
            })
          }
          className={`text-xs px-2 py-1 rounded border transition-colors disabled:opacity-50 ${
            claimMethod === "email"
              ? "bg-green-50 border-green-300 text-green-700"
              : "hover:border-primary"
          }`}
        >
          Email {claimMethod === "email" && "✓"}
        </button>
        <button
          type="button"
          disabled={pending || claimMethod === "phone"}
          onClick={() =>
            startTransition(async () => {
              await markOutreachSent(serviceId, "phone")
            })
          }
          className={`text-xs px-2 py-1 rounded border transition-colors disabled:opacity-50 ${
            claimMethod === "phone"
              ? "bg-green-50 border-green-300 text-green-700"
              : "hover:border-primary"
          }`}
        >
          Tel {claimMethod === "phone" && "✓"}
        </button>
      </div>

      <div className="flex gap-1">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await regenerateClaimToken(serviceId)
            })
          }
          className="text-xs px-2 py-1 rounded border hover:border-primary disabled:opacity-50"
        >
          🔄 Nou token
        </button>

        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="text-xs px-2 py-1 rounded border text-red-600 hover:bg-red-50"
          >
            🗑️ Șterge
          </button>
        ) : (
          <>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await deleteDraft(serviceId)
                })
              }
              className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-xs px-2 py-1 rounded border"
            >
              Anulează
            </button>
          </>
        )}
      </div>
    </div>
  )
}
