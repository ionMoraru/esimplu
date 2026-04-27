"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { COUNTRIES, readCountryCookie, writeCountryCookie } from "@/lib/countries"
import type { Country } from "@/types"

export function CountryModal() {
  const [open, setOpen] = useState(() => readCountryCookie() === null)

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
