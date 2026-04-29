"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const COUNTRIES = [
  { code: "fr", label: "🇫🇷 Franța" },
  { code: "de", label: "🇩🇪 Germania" },
  { code: "it", label: "🇮🇹 Italia" },
  { code: "uk", label: "🇬🇧 Marea Britanie" },
  { code: "ro", label: "🇷🇴 România" },
  { code: "md", label: "🇲🇩 Moldova" },
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
      setError("Numele comercial este obligatoriu (cel puțin 2 caractere)")
      return
    }
    if (!city.trim()) {
      setError("Orașul este obligatoriu")
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
        setError(json.error ?? "Eroare la înscriere")
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
        <h2 className="font-medium">Identitate</h2>
        <div>
          <label className="block text-sm mb-1">Email cont</label>
          <Input value={userEmail} disabled readOnly />
        </div>
        <div>
          <label className="block text-sm mb-1">Nume comercial *</label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Ferma Petrescu, Atelier Maria…"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Oraș *</label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Țară *</label>
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
          <label className="block text-sm mb-1">Telefon</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+33…" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Date bancare</h2>
        <div>
          <label className="block text-sm mb-1">IBAN (pentru plata după livrare)</label>
          <Input value={iban} onChange={(e) => setIban(e.target.value)} placeholder="FR76…" />
          <p className="text-xs text-zinc-500 mt-1">
            Opțional: poate fi adăugat mai târziu. Fără IBAN, cererea ta va fi aprobată, dar nu
            vei putea primi plățile.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Prezentare (opțional)</h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={500}
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="Câteva rânduri despre produsele tale, povestea ta…"
        />
        <p className="text-xs text-zinc-500">
          Va apărea pe pagina ta de producător. Maxim 500 caractere.
        </p>
      </section>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Se trimite..." : "Trimite cererea"}
      </Button>
      <p className="text-xs text-zinc-500">
        Echipa noastră examinează cererile în 48 h. Vei fi notificat(ă) pe email.
      </p>
    </form>
  )
}
