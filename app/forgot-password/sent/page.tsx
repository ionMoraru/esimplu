export default function ForgotPasswordSentPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-card px-8 py-10 flex flex-col gap-5 text-center">
          <div className="text-5xl">📬</div>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold">Verifică-ți emailul</h1>
            <p className="text-sm text-muted-foreground">
              Dacă există un cont asociat acestei adrese, ți-am trimis un link
              pentru a-ți reseta parola. Link-ul este valabil 30 de minute.
            </p>
          </div>

          <p className="text-xs text-muted-foreground pt-2 border-t">
            Nu primești emailul ? Verifică folderul de spam sau{" "}
            <a
              href="/forgot-password"
              className="underline underline-offset-2 hover:text-foreground"
            >
              încearcă din nou
            </a>
            .
          </p>

          <a
            href="/login"
            className="text-sm font-medium underline underline-offset-2 hover:text-foreground/80"
          >
            ← Înapoi la conectare
          </a>
        </div>
      </div>
    </main>
  )
}
