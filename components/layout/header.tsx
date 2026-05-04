"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { LogOut, Menu } from "lucide-react"
import { CountrySelector } from "@/components/layout/country-selector"
import { UserMenu } from "@/components/layout/user-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const navLinks = [
  { href: "/articles", label: "Articole" },
  { href: "/services", label: "Servicii" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/delivery", label: "Livrare" },
  { href: "/despre", label: "Despre" },
]

export function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-primary shrink-0"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          eSimplu
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-primary bg-primary/8 font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Country selector — masqué sur très petits écrans */}
          <div className="hidden sm:block">
            <CountrySelector />
          </div>

          {/* Auth — desktop */}
          <div className="hidden md:block">
            {session?.user ? (
              <UserMenu
                name={session.user.name}
                email={session.user.email}
                image={session.user.image}
                isAdmin={(session.user as { role?: string }).role === "ADMIN"}
              />
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Conectare
              </Link>
            )}
          </div>

          {/* Hamburger mobile */}
          <Sheet>
            <SheetTrigger className="md:hidden h-9 w-9 flex items-center justify-center rounded-md hover:bg-muted transition-colors">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Deschide meniu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-8">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "text-primary bg-primary/8 font-semibold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="px-4 flex flex-col gap-3">
                {/* Country selector mobile */}
                <CountrySelector />

                {/* Auth mobile */}
                {session?.user ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/profil"
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={session.user.image ?? undefined} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                          {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate">
                          {session.user.name ?? "Profilul meu"}
                        </span>
                        {session.user.email && (
                          <span className="text-xs text-muted-foreground truncate">
                            {session.user.email}
                          </span>
                        )}
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center justify-center gap-2 text-sm font-medium border border-border text-rose-600 px-4 py-2.5 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Deconectare
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="w-full text-center text-sm font-medium bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Conectare
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  )
}
