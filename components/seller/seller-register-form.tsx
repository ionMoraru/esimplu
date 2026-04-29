"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const COUNTRIES = [
  { code: "fr", label: "🇫🇷 France" },
  { code: "de", label: "🇩🇪 Allemagne" },
  { code: "it", label: "🇮🇹 Italie" },
  { code: "uk", label: "🇬🇧 Royaume-Uni" },
  { code: "ro", label: "🇷🇴 Roumanie" },
  { code: "md", label: "🇲🇩 Moldavie" },
]

interface Props {
  defaultDisplayName: string
  userEmail: string
}

export function SellerRegisterForm({ defaultDisplayName, userEmail }: Props) {
  const [displayName, setDisplayName] = useState(defaultDisplayName)
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("fr")
  const [phone, setPhone] = useState("")
  const [iban, setIban] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function submit() {
    setError(null)
    if (!displayName.trim() || displayName.trim().length < 2) {
      setError("Nom commercial requis (au moins 2 caractères)")
      return
    }
    if (!city.trim()) {
      setError("Ville requise")
      return
    }
    startTransition(async () => {
      const res = await fetch("/api/seller/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          city,
          country,
          phone: phone || undefined,
          iban: iban || undefined,
          description: description || undefined,
        }),
      })
      const json = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(json.error ?? "Erreur lors de l'inscription")
        return
      }
      router.push("/seller/register")
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
      <section className="space-y-3">
        <h2 className="font-medium">Identité</h2>
        <div>
          <label className="block text-sm mb-1">Email du compte</label>
          <Input value={userEmail} disabled readOnly />
        </div>
        <div>
          <label className="block text-sm mb-1">Nom commercial *</label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Ferme Petrescu, Atelier Maria…"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Ville *</label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Pays *</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm bg-background"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Téléphone</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+33…" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Coordonnées bancaires</h2>
        <div>
          <label className="block text-sm mb-1">IBAN (pour le paiement après livraison)</label>
          <Input value={iban} onChange={(e) => setIban(e.target.value)} placeholder="FR76…" />
          <p className="text-xs text-zinc-500 mt-1">
            Optionnel : peut être ajouté plus tard. Sans IBAN, votre demande sera approuvée mais
            vous ne pourrez recevoir vos paiements.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Présentation (facultatif)</h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={500}
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="Quelques lignes sur vos produits, votre histoire…"
        />
        <p className="text-xs text-zinc-500">
          Apparaîtra sur votre fiche producteur. 500 caractères max.
        </p>
      </section>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Envoi..." : "Envoyer ma demande"}
      </Button>
      <p className="text-xs text-zinc-500">
        Notre équipe examine les demandes sous 48 h. Vous serez notifié(e) par email.
      </p>
    </form>
  )
}
