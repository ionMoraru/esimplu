"use client"

import { useState } from "react"
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
  const [country, setCountry] = useState<Country | null>(() => readCountryCookie())

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
