"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { COUNTRIES } from "@/lib/countries"

interface Props {
  productId: string
  productName: string
  priceEur: string
  defaultName: string
  defaultEmail: string
  countriesAvailable: string[]
}

export function CheckoutForm({
  productId,
  productName,
  priceEur,
  defaultName,
  defaultEmail,
  countriesAvailable,
}: Props) {
  const [name, setName] = useState(defaultName)
  const [email, setEmail] = useState(defaultEmail)
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState(countriesAvailable[0] ?? "fr")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const allowedCountries = COUNTRIES.filter((c) => countriesAvailable.includes(c.code))

  function submit() {
    setError(null)
    if (!name || !email || !phone || !address || !city || !country) {
      setError("Tous les champs marqués sont requis")
      return
    }
    startTransition(async () => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          deliveryAddress: address,
          deliveryCity: city,
          deliveryCountry: country,
          notes: notes || null,
          items: [{ productId, quantity: 1 }],
        }),
      })
      const json = (await res.json()) as { error?: string; checkout?: { url: string } }
      if (!res.ok || !json.checkout) {
        setError(json.error ?? "Erreur lors de la création de la commande")
        return
      }
      router.push(json.checkout.url)
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
        <h2 className="font-medium">Vos coordonnées</h2>
        <div>
          <label className="block text-sm mb-1">Nom complet *</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Email *</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Téléphone *</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Adresse de livraison</h2>
        <div>
          <label className="block text-sm mb-1">Adresse *</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={2}
            className="w-full rounded border px-3 py-2 text-sm"
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
              {allowedCountries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Notes pour le vendeur (facultatif)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
      </section>

      <section className="rounded border bg-muted/30 p-4 text-sm">
        <div className="flex justify-between">
          <span>{productName}</span>
          <span className="font-medium">{priceEur} €</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Le règlement de la livraison se fait directement au livreur en espèces.
        </p>
      </section>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Création de la commande..." : `Payer ${priceEur} €`}
      </Button>
    </form>
  )
}
