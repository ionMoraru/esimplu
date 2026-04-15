import { signIn } from "@/lib/auth"

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8 gap-4">
      <h1 className="text-3xl font-bold">Conectare</h1>
      <p className="text-zinc-600 mb-8">Conectați-vă cu contul dvs.</p>

      <form
        action={async () => {
          "use server"
          await signIn("google", { redirectTo: "/" })
        }}
      >
        <button
          type="submit"
          className="w-64 rounded-lg bg-white border border-zinc-300 px-4 py-3 text-sm font-medium hover:bg-zinc-50"
        >
          Continuați cu Google
        </button>
      </form>

      <form
        action={async () => {
          "use server"
          await signIn("facebook", { redirectTo: "/" })
        }}
      >
        <button
          type="submit"
          className="w-64 rounded-lg bg-[#1877F2] px-4 py-3 text-sm font-medium text-white hover:bg-[#166FE5]"
        >
          Continuați cu Facebook
        </button>
      </form>
    </main>
  )
}
