import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>
}) {
  const params = await searchParams
  const justRegistered = params.registered === "1"

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-card px-8 py-10 flex flex-col gap-6">

          {/* Success banner after registration */}
          {justRegistered && (
            <p className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700 text-center">
              Cont creat cu succes! Conectați-vă mai jos.
            </p>
          )}

          {/* Brand */}
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-2xl font-bold tracking-tight">eSimplu</span>
            <p className="text-sm text-muted-foreground">
              Platforma diasporei române în Europa
            </p>
          </div>

          {/* OAuth buttons */}
          <div className="flex flex-col gap-3">
            <form
              action={async () => {
                "use server"
                await signIn("google", { redirectTo: "/" })
              }}
            >
              <Button
                type="submit"
                variant="outline"
                size="lg"
                className="w-full gap-3 h-11 text-sm font-medium"
              >
                <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continuați cu Google
              </Button>
            </form>

            <form
              action={async () => {
                "use server"
                await signIn("facebook", { redirectTo: "/" })
              }}
            >
              <Button
                type="submit"
                size="lg"
                className="w-full gap-3 h-11 text-sm font-medium bg-[#1877F2] hover:bg-[#166FE5] text-white border-transparent"
              >
                <svg viewBox="0 0 24 24" className="size-5 shrink-0 fill-white" aria-hidden>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continuați cu Facebook
              </Button>
            </form>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">sau</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Credentials form */}
          <form
            className="flex flex-col gap-3"
            action={async (formData: FormData) => {
              "use server"
              await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirectTo: "/",
              })
            }}
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nume@exemplu.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Parolă
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" size="lg" className="w-full h-11 mt-1">
              Conectare
            </Button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-muted-foreground">
            Nu ai cont?{" "}
            <a href="/register" className="font-medium text-foreground underline underline-offset-2 hover:text-foreground/80">
              Creează un cont
            </a>
          </p>

        </div>
      </div>
    </main>
  )
}
