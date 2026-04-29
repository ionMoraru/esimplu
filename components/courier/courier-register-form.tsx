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

export function CourierRegisterForm({ defaultDisplayName, userEmail }: Props) {
  const [displayName, setDisplayName] = useState(defaultDisplayName)
  const [phone, setPhone] = useState("")
  const [baseCity, setBaseCity] = useState("")
  const [baseCountry, setBaseCountry] = useState("fr")
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function submit() {
    setError(null)
    if (!displayName.trim() || displayName.trim().length < 2) {
      setError("Numele este obligatoriu (cel puțin 2 caractere)")
      return
    }
    if (!phone.trim() || phone.trim().length < 6) {
      setError("Telefonul este obligatoriu")
      return
    }
    startTransition(async () => {
      const res = await fetch("/api/courier/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          phone,
          baseCity: baseCity || undefined,
          baseCountry,
        }),
      })
      const json = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(json.error ?? "Eroare la înscriere")
        return
      }
      router.push("/courier/register")
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
          <label className="block text-sm mb-1">Nume afișat clienților *</label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Andrei T., Express Bus, …"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Telefon *</label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+33 6…"
            required
          />
          <p className="text-xs text-zinc-500 mt-1">
            Vizibil pentru vânzător și client pentru comunicările despre livrare.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Zonă de activitate</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Oraș de bază</label>
            <Input
              value={baseCity}
              onChange={(e) => setBaseCity(e.target.value)}
              placeholder="Paris, Berlin…"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Țară *</label>
            <select
              value={baseCountry}
              onChange={(e) => setBaseCountry(e.target.value)}
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
