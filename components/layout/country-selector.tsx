"use client"

import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { COUNTRIES, COUNTRY_COOKIE, COUNTRY_COOKIE_MAX_AGE } from "@/lib/countries"
import type { Country } from "@/types"

export function CountrySelector() {
  const [country, setCountry] = useState<Country | null>(null)

  useEffect(() => {
    const match = document.cookie.match(new RegExp(`${COUNTRY_COOKIE}=([^;]+)`))
    if (match) {
      setCountry(match[1] as Country)
    }
  }, [])

  function handleChange(value: string | null) {
    if (!value) return
    const code = value as Country
    document.cookie = `${COUNTRY_COOKIE}=${code}; path=/; max-age=${COUNTRY_COOKIE_MAX_AGE}`
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
