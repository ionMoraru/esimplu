"use server"

import { redirect } from "next/navigation"
import { requestPasswordReset } from "@/lib/password-reset"

export async function forgotPassword(formData: FormData) {
  const email = (formData.get("email") as string | null)?.trim()
  if (!email) {
    redirect("/forgot-password?error=missing")
  }

  // Réponse identique pour email connu/inconnu (anti-énumération).
  // Les erreurs réseau Resend ne sont pas masquées : elles remontent en 500
  // (utile pour debug, mais l'email n'apparaît pas dans le message d'erreur).
  await requestPasswordReset(email)

  redirect("/forgot-password/sent")
}
