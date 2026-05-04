"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { LogOut, User, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type UserMenuProps = {
  name?: string | null
  email?: string | null
  image?: string | null
  isAdmin?: boolean
}

export function UserMenu({ name, email, image, isAdmin }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onEscape)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onEscape)
    }
  }, [open])

  const initial = (name ?? email ?? "U").charAt(0).toUpperCase()

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-full hover:ring-2 hover:ring-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={image ?? undefined} alt={name ?? "Profil"} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
            {initial}
          </AvatarFallback>
        </Avatar>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-56 rounded-xl border bg-card shadow-lg overflow-hidden z-50"
          style={{ boxShadow: "var(--shadow-md, 0 8px 24px rgba(0,0,0,0.12))" }}
        >
          <div className="px-4 py-3 border-b bg-muted/30">
            <p className="text-sm font-medium truncate">
              {name ?? "Cont eSimplu"}
            </p>
            {email && (
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            )}
          </div>
          <div className="p-1.5 flex flex-col">
            <Link
              href="/profil"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              Profilul meu
            </Link>
            {isAdmin && (
              <Link
                href="/admin/services/drafts"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                Administrare
              </Link>
            )}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                signOut({ callbackUrl: "/" })
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors text-rose-600 text-left"
            >
              <LogOut className="h-4 w-4" />
              Deconectare
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
