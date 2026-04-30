"use client"

import { useState, useTransition } from "react"
import {
  regenerateInvitationToken,
  markOutreachSent,
  deleteDraft,
} from "./actions"

export function DraftRowActions({
  invitationId,
  claimUrl,
  status,
  outreachMethod,
}: {
  invitationId: string
  claimUrl: string | null
  status: string
  outreachMethod: string | null
}) {
  const [pending, startTransition] = useTransition()
  const [copied, setCopied] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (status !== "PENDING") {
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
        {(["sms", "email", "phone"] as const).map((m) => (
          <button
            key={m}
            type="button"
            disabled={pending || outreachMethod === m}
            onClick={() =>
              startTransition(async () => {
                await markOutreachSent(invitationId, m)
              })
            }
            className={`text-xs px-2 py-1 rounded border transition-colors disabled:opacity-50 ${
              outreachMethod === m
                ? "bg-green-50 border-green-300 text-green-700"
                : "hover:border-primary"
            }`}
          >
            {m.toUpperCase()} {outreachMethod === m && "✓"}
          </button>
        ))}
      </div>

      <div className="flex gap-1">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await regenerateInvitationToken(invitationId)
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
                  await deleteDraft(invitationId)
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
