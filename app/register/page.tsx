"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { OAuthButtons } from "@/components/shared/forms/oauth-buttons"
import { AlertBanner } from "@/components/shared/forms/alert-banner"
import { FormField } from "@/components/shared/forms/form-field"
import { register } from "./actions"

export default function RegisterPage() {
  const [state, action, pending] = useActionState(register, null)

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-card px-8 py-10 flex flex-col gap-6">

          {/* Brand */}
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-2xl font-bold tracking-tight">eSimplu</span>
            <p className="text-sm text-muted-foreground">Creați un cont gratuit</p>
          </div>

          <OAuthButtons mode="register" />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">sau cu email</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Email/password form */}
          <form action={action} className="flex flex-col gap-3">
            <FormField
              id="name"
              label="Nume complet"
              name="name"
              type="text"
              placeholder="Ion Popescu"
              required
              autoComplete="name"
            />
            <FormField
              id="email"
              label="Email"
              name="email"
              type="email"
              placeholder="nume@exemplu.com"
              required
              autoComplete="email"
            />
            <FormField
              id="password"
              label="Parolă"
              name="password"
              type="password"
              placeholder="Minim 8 caractere"
              required
              minLength={8}
              autoComplete="new-password"
            />
            <FormField
              id="confirm"
              label="Confirmați parola"
              name="confirm"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />

            {state?.error && (
              <AlertBanner variant="error">{state.error}</AlertBanner>
            )}

            <Button type="submit" size="lg" className="w-full h-11 mt-1" disabled={pending}>
              {pending ? "Se creează contul..." : "Creați contul"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Prin înregistrare, acceptați{" "}
            <a href="/terms" className="underline underline-offset-2 hover:text-foreground">
              termenii
            </a>
            {" "}și{" "}
            <a href="/privacy" className="underline underline-offset-2 hover:text-foreground">
              confidențialitatea
            </a>
            .
          </p>

          <p className="text-center text-sm text-muted-foreground">
            Aveți deja un cont?{" "}
            <a
              href="/login"
              className="font-medium text-foreground underline underline-offset-2 hover:text-foreground/80"
            >
              Conectați-vă
            </a>
          </p>

        </div>
      </div>
    </main>
  )
}
