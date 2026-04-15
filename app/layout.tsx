import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { CountrySelector } from "@/components/country-selector"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "eSimplu",
  description: "Platforma pentru diaspora română și moldovenească în Europa",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ro"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <header className="flex items-center justify-between px-6 py-4 border-b">
            <a href="/" className="text-xl font-bold">
              eSimplu
            </a>
            <div className="flex items-center gap-4">
              <CountrySelector />
              <a
                href="/login"
                className="text-sm font-medium hover:underline"
              >
                Conectare
              </a>
            </div>
          </header>
          <div className="flex-1">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
