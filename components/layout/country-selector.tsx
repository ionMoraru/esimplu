"use client"

import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { COUNTRIES, readCountryCookie, writeCountryCookie } from "@/lib/countries"
import type { Country } from "@/types"

export function CountrySelector() {
  // Hydration-safe: on rend null côté SSR et on lit le cookie après mount.
  // Sinon mismatch SSR (pas de cookie côté serveur) ↔ CSR (cookie présent),
  // qui forçait React à regénérer le sous-arbre et faisait sauter les
  // gestionnaires onClick des composants Base UI alentour.
  const [mounted, setMounted] = useState(false)
  const [country, setCountry] = useState<Country | null>(null)

  useEffect(() => {
    // setState dans useEffect est nécessaire ici pour éviter un hydration
    // mismatch (le serveur ne voit pas document.cookie). Le coût d'une
    // re-render initiale est acceptable au regard du bug d'hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountry(readCountryCookie())
     
    setMounted(true)
  }, [])

  if (!mounted) return null

  function handleChange(value: string | null) {
    if (!value) return
    const code = value as Country
    writeCountryCookie(code)
    setCountry(code)
    window.location.reload()
  }

  if (!country) return null

  const current = COUNTRIES.find((c) => c.code === country)

  return (
    <Select value={country} onValueChange={handleChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder={`${current?.flag} ${current?.name}`} />
      </SelectTrigger>
      <SelectContent>
        {COUNTRIES.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            {c.flag} {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
