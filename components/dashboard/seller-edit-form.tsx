"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface SellerEditInitial {
  id: string
  displayName: string
  city: string
  country: string
  phone: string
  iban: string
  commissionPct: number
  approved: boolean
}

export function SellerEditForm({ initial }: { initial: SellerEditInitial }) {
  const [displayName, setDisplayName] = useState(initial.displayName)
  const [city, setCity] = useState(initial.city)
  const [country, setCountry] = useState(initial.country)
  const [phone, setPhone] = useState(initial.phone)
  const [iban, setIban] = useState(initial.iban)
  const [commissionPct, setCommissionPct] = useState(String(initial.commissionPct))
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function submit() {
    setError(null)
    setSuccess(false)
    const pct = Number.parseInt(commissionPct, 10)
    if (Number.isNaN(pct) || pct < 0 || pct > 50) {
      setError("Commission doit être un entier entre 0 et 50")
      return
    }

    startTransition(async () => {
      const res = await fetch(`/api/admin/sellers/${initial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          city: city || null,
          country,
          phone: phone || null,
          iban: iban || null,
          commissionPct: pct,
        }),
      })
      const json = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(json.error ?? "Erreur lors de la mise à jour")
        return
      }
      setSuccess(true)
      router.refresh()
    })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="space-y-5"
    >
      {!iban && initial.approved && (
        <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          ⚠️ Pas d&apos;IBAN renseigné — impossible de virer le payout au vendeur après livraison.
        </div>
      )}

      <section className="space-y-3">
        <h2 className="font-medium">Identité publique</h2>
        <div>
          <label className="block text-sm mb-1">Nom commercial</label>
          <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Ville</label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Pays (ISO 2 lettres)</label>
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value.toLowerCase())}
              maxLength={2}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Téléphone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Commission %</label>
            <Input
              type="number"
              min={0}
              max={50}
              value={commissionPct}
              onChange={(e) => setCommissionPct(e.target.value)}
              required
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Coordonnées bancaires</h2>
        <div>
          <label className="block text-sm mb-1">IBAN (pour le payout après livraison)</label>
          <Input value={iban} onChange={(e) => setIban(e.target.value)} placeholder="FR76..." />
          <p className="text-xs text-muted-foreground mt-1">
            Espaces ignorés. Le virement vendeur (montant produit − commission) est fait
            manuellement par la plateforme après le règlement de la commande.
          </p>
        </div>
      </section>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">
          Profil mis à jour.
        </div>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  )
}
