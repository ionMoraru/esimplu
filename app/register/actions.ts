"use server"

import { redirect } from "next/navigation"
import bcryptjs from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function register(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const name = (formData.get("name") as string).trim()
  const email = (formData.get("email") as string).trim().toLowerCase()
  const password = formData.get("password") as string
  const confirm = formData.get("confirm") as string

  if (password !== confirm) {
    return { error: "Parolele nu coincid." }
  }

  if (password.length < 8) {
    return { error: "Parola trebuie să aibă minim 8 caractere." }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: "Această adresă de email este deja folosită." }
  }

  const hashed = await bcryptjs.hash(password, 12)

  await prisma.user.create({
    data: { name, email, password: hashed },
  })

  redirect("/login?registered=1")
}
