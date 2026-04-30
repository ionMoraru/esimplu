import { findActiveResetToken } from "@/lib/password-reset"
import { ResetForm } from "./reset-form"

export const dynamic = "force-dynamic"

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const active = await findActiveResetToken(token)

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-card px-8 py-10 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-2xl font-bold tracking-tight">eSimplu</span>
            <p className="text-sm text-muted-foreground">
              Alege o parolă nouă
            </p>
          </div>

          {!active ? (
            <div className="flex flex-col gap-4 text-center">
              <div className="text-5xl">⏳</div>
              <p className="text-sm text-muted-foreground">
                Acest link nu mai este valabil sau a fost deja folosit. Cere
                un nou link de resetare.
              </p>
              <a
                href="/forgot-password"
                className="text-sm font-medium underline underline-offset-2 hover:text-foreground/80"
              >
                Cere un link nou
              </a>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Pentru contul <strong>{active.user.email}</strong>. Link-ul
                expiră la{" "}
                {active.expiresAt.toLocaleTimeString("ro-RO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                .
              </p>
              <ResetForm token={token} />
            </>
          )}

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
