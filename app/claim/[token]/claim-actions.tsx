"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { publishClaim, refuseClaim } from "./actions"

export function ClaimActions({ token }: { token: string }) {
  const [pending, startTransition] = useTransition()
  const [confirmRefuse, setConfirmRefuse] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await publishClaim(token)
          })
        }
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        ✅ Publică anunțul ca atare
      </button>

      <Link
        href={`/claim/${token}/edit`}
        className="w-full text-center bg-card border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors"
      >
        ✏️ Modifică, apoi publică (recomandat)
      </Link>

      {!confirmRefuse ? (
        <button
          type="button"
          onClick={() => setConfirmRefuse(true)}
          className="w-full text-sm text-muted-foreground hover:text-destructive py-2 transition-colors"
        >
          Nu vreau acest anunț — șterge definitiv
        </button>
      ) : (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex flex-col gap-3">
          <p className="text-sm text-destructive">
            Confirmi ștergerea ? Anunțul va fi marcat ca refuzat și nu mai
            poate fi recuperat.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await refuseClaim(token)
                })
              }
              className="flex-1 bg-destructive text-destructive-foreground py-2 rounded-lg text-sm font-medium hover:bg-destructive/90 disabled:opacity-60"
            >
              Da, șterge definitiv
            </button>
            <button
              type="button"
              onClick={() => setConfirmRefuse(false)}
              className="flex-1 bg-card border py-2 rounded-lg text-sm font-medium hover:border-foreground"
            >
              Anulează
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center pt-1">
        La publicare, vei fi rugat să te conectezi (Google) — pentru a primi
        notificări când cineva te contactează.
      </p>
    </div>
  )
}
