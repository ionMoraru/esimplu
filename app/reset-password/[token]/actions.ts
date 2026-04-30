"use server"

import { redirect } from "next/navigation"
import bcryptjs from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { findActiveResetToken } from "@/lib/password-reset"

export type ResetState = { error?: string } | null

export async function resetPassword(
  token: string,
  _prev: ResetState,
  formData: FormData
): Promise<ResetState> {
  const password = formData.get("password") as string
  const confirm = formData.get("confirm") as string

  if (!password || password.length < 8) {
    return { error: "Parola trebuie să aibă minim 8 caractere." }
  }
  if (password !== confirm) {
    return { error: "Parolele nu coincid." }
  }

  const row = await findActiveResetToken(token)
  if (!row) {
    return {
      error:
        "Acest link nu mai este valabil. Cere un nou link de resetare.",
    }
  }

  const hashed = await bcryptjs.hash(password, 12)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: row.userId },
      data: { password: hashed },
    }),
    prisma.passwordResetToken.update({
      where: { id: row.id },
      data: { usedAt: new Date() },
    }),
    // Invalide les autres tokens encore actifs du même user.
    prisma.passwordResetToken.updateMany({
      where: {
        userId: row.userId,
        usedAt: null,
        id: { not: row.id },
      },
      data: { usedAt: new Date() },
    }),
  ])

  redirect("/login?reset=1")
}
