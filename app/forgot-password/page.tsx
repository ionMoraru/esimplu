import { Button } from "@/components/ui/button"
import { AlertBanner } from "@/components/shared/forms/alert-banner"
import { FormField } from "@/components/shared/forms/form-field"
import { forgotPassword } from "./actions"

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const hasError = params.error === "missing"

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-card px-8 py-10 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-2xl font-bold tracking-tight">eSimplu</span>
            <p className="text-sm text-muted-foreground">
              Resetează-ți parola
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Introdu adresa de email asociată contului tău. Îți vom trimite un
            link pentru a alege o parolă nouă.
          </p>

          {hasError && (
            <AlertBanner variant="error">
              Te rugăm să introduci adresa de email.
            </AlertBanner>
          )}

          <form className="flex flex-col gap-3" action={forgotPassword}>
            <FormField
              id="email"
              label="Email"
              name="email"
              type="email"
              placeholder="nume@exemplu.com"
              required
              autoComplete="email"
            />
            <Button type="submit" size="lg" className="w-full h-11 mt-1">
              Trimite link-ul de resetare
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            <a
              href="/login"
              className="font-medium text-foreground underline underline-offset-2 hover:text-foreground/80"
            >
              ← Înapoi la conectare
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
