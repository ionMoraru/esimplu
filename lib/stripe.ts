// Wrapper singleton autour du SDK Stripe. Le client n'est instancié qu'au
// premier appel à `getStripe()`, ce qui permet aux tests / au mode
// `PAYMENT_PROVIDER=mock` de tourner sans configuration Stripe.

import Stripe from "stripe"

let cached: Stripe | null = null

function readRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Variable d'environnement manquante : ${name}. Voir .env.example pour la configuration Stripe.`,
    )
  }
  return value
}

export function getStripe(): Stripe {
  if (cached) return cached
  cached = new Stripe(readRequiredEnv("STRIPE_SECRET_KEY"), {
    // Pin l'API version pour éviter les surprises sur les types de réponse.
    apiVersion: "2026-04-22.dahlia",
    typescript: true,
  })
  return cached
}

export function getWebhookSecret(): string {
  return readRequiredEnv("STRIPE_WEBHOOK_SECRET")
}

// Pour les tests uniquement.
export function resetStripeForTests(): void {
  cached = null
}
