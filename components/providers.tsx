"use client"

import { SessionProvider } from "next-auth/react"
import { CountryModal } from "@/components/country-modal"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <CountryModal />
    </SessionProvider>
  )
}
