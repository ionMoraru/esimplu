"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { COUNTRIES, readCountryCookie, writeCountryCookie } from "@/lib/countries"
import type { Country } from "@/types"

export function CountryModal() {
  // Hydration-safe: idem CountrySelector. On ne peut pas lire le cookie
  // au render initial (SSR) sans causer un mismatch.
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // setState dans useEffect : nécessaire pour éviter un hydration mismatch
    // (le serveur ne voit pas document.cookie). Le pattern lazy-initializer
    // produisait un mismatch SSR/CSR qui désattachait les onClick alentour.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(readCountryCookie() === null)
     
    setMounted(true)
  }, [])

  if (!mounted) return null

  function selectCountry(code: Country) {
    writeCountryCookie(code)
    setOpen(false)
    window.location.reload()
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Alegeți țara dvs.
          </DialogTitle>
        </DialogHeader>
        <p className="text-center text-sm text-zinc-500 mb-4">
          Pentru a vedea conținut specific regiunii dvs.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {COUNTRIES.map((country) => (
            <Button
              key={country.code}
              variant="outline"
              className="h-16 text-lg"
              onClick={() => selectCountry(country.code)}
            >
              {country.flag} {country.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
