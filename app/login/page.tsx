import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { OAuthButtons } from "@/components/shared/forms/oauth-buttons"
import { AlertBanner } from "@/components/shared/forms/alert-banner"
import { FormField } from "@/components/shared/forms/form-field"
import { login } from "./actions"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; error?: string }>
}) {
  const params = await searchParams
  const justRegistered = params.registered === "1"
  const hasError = params.error === "invalid"

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-card px-8 py-10 flex flex-col gap-6">

          {hasError && (
            <AlertBanner variant="error">Email sau parolă incorectă.</AlertBanner>
          )}

          {justRegistered && (
            <AlertBanner variant="success">Cont creat cu succes! Conectați-vă mai jos.</AlertBanner>
          )}

          {/* Brand */}
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-2xl font-bold tracking-tight">eSimplu</span>
            <p className="text-sm text-muted-foreground">
              Platforma diasporei române în Europa
            </p>
          </div>

          <OAuthButtons mode="login" />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">sau</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Credentials form */}
          <form className="flex flex-col gap-3" action={login}>
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
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <Button type="submit" size="lg" className="w-full h-11 mt-1">
              Conectare
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Nu ai cont?{" "}
            <a
              href="/register"
              className="font-medium text-foreground underline underline-offset-2 hover:text-foreground/80"
            >
              Creează un cont
            </a>
          </p>

        </div>
      </div>
    </main>
  )
}
