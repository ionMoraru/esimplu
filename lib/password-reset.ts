import { randomBytes } from "crypto"
import { prisma } from "@/lib/prisma"

export const PASSWORD_RESET_TTL_MINUTES = 30

export function generateResetToken(): string {
  return randomBytes(32).toString("base64url")
}

export function resetExpiry(now: Date = new Date()): Date {
  return new Date(now.getTime() + PASSWORD_RESET_TTL_MINUTES * 60 * 1000)
}

export function resetUrl(token: string, baseUrl?: string): string {
  const base = baseUrl ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000"
  return `${base.replace(/\/$/, "")}/reset-password/${token}`
}

// Crée un token de reset s'il existe un compte avec ce mot de passe.
// Retourne toujours sans révéler si l'email existe (anti-énumération).
export async function requestPasswordReset(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase()
  const user = await prisma.user.findUnique({ where: { email: normalized } })

  // Pas d'utilisateur OU pas de mot de passe (compte OAuth pur) → silencieux.
  // Le caller ne doit pas pouvoir distinguer ces cas du cas "envoyé".
  if (!user || !user.password) return

  const token = generateResetToken()
  const expiresAt = resetExpiry()

  // Invalide les tokens encore valides du même user pour éviter qu'un ancien
  // mail ressuscite si plusieurs demandes ont été faites.
  await prisma.$transaction([
    prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
      data: { usedAt: new Date() },
    }),
    prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    }),
  ])

  await sendResetEmail({ to: normalized, name: user.name, url: resetUrl(token) })
}

type SendArgs = { to: string; name: string | null; url: string }

async function sendResetEmail({ to, name, url }: SendArgs): Promise<void> {
  // En dev sans provider configuré : log dans la console serveur. Tu copies
  // l'URL et tu la testes manuellement. Pas d'envoi réel.
  if (!process.env.RESEND_API_KEY) {
    console.log(
      `\n📧 [DEV] Reset password email to ${to} (${name ?? "—"})\n   ${url}\n   (configure RESEND_API_KEY in .env.local pour envoyer pour de vrai)\n`
    )
    return
  }

  // Provider configuré : envoyer via Resend HTTP API directement (pas de SDK
  // npm pour rester light). Throw si l'API renvoie une erreur — on veut
  // savoir si l'envoi a échoué (le caller silence ne masque pas les bugs).
  const from = process.env.PASSWORD_RESET_FROM ?? "noreply@esimplu.com"
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Resetează parola — eSimplu",
      text: buildResetEmailText({ name, url }),
      html: buildResetEmailHtml({ name, url }),
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Resend API error ${res.status}: ${body}`)
  }
}

function buildResetEmailText({
  name,
  url,
}: {
  name: string | null
  url: string
}): string {
  return `Salut${name ? " " + name : ""},

Ai cerut resetarea parolei contului tău eSimplu.

Folosește acest link pentru a alege o parolă nouă (valabil ${PASSWORD_RESET_TTL_MINUTES} minute) :
${url}

Dacă nu tu ai cerut acest reset, poți ignora acest mesaj — parola ta rămâne neschimbată.

— echipa eSimplu`
}

function buildResetEmailHtml({
  name,
  url,
}: {
  name: string | null
  url: string
}): string {
  return `<!doctype html>
<html lang="ro">
<body style="font-family:system-ui,-apple-system,sans-serif;color:#1a1a1a;line-height:1.5">
  <p>Salut${name ? " " + escapeHtml(name) : ""},</p>
  <p>Ai cerut resetarea parolei contului tău <strong>eSimplu</strong>.</p>
  <p>Apasă pe butonul de mai jos pentru a alege o parolă nouă (valabil ${PASSWORD_RESET_TTL_MINUTES} minute) :</p>
  <p><a href="${url}" style="display:inline-block;padding:12px 20px;background:#1a1a1a;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Resetează parola</a></p>
  <p style="font-size:13px;color:#666">Sau copiază această adresă în browser :<br>${url}</p>
  <p style="font-size:13px;color:#666">Dacă nu tu ai cerut acest reset, poți ignora acest mesaj — parola ta rămâne neschimbată.</p>
  <p style="font-size:13px;color:#666">— echipa eSimplu</p>
</body>
</html>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export async function findActiveResetToken(token: string) {
  const row = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  })
  if (!row) return null
  if (row.usedAt) return null
  if (row.expiresAt < new Date()) return null
  return row
}
