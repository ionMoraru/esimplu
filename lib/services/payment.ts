import type { Order } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { getStripe } from "@/lib/stripe"

export interface CheckoutSession {
  url: string
  sessionRef: string
  provider: PaymentProviderName
}

export type PaymentProviderName = "mock" | "manual" | "stripe"

export interface PaymentProvider {
  readonly name: PaymentProviderName
  createCheckout(order: Order): Promise<CheckoutSession>
}

class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock" as const

  async createCheckout(order: Order): Promise<CheckoutSession> {
    return {
      provider: this.name,
      url: `/marketplace/mock-payment/${order.id}`,
      sessionRef: `mock_${order.id}`,
    }
  }
}

class ManualPaymentProvider implements PaymentProvider {
  readonly name = "manual" as const

  async createCheckout(order: Order): Promise<CheckoutSession> {
    return {
      provider: this.name,
      url: `/marketplace/order-confirmation/${order.id}`,
      sessionRef: `manual_${order.id}`,
    }
  }
}

// Stripe Checkout simple. L'argent atterrit sur le compte Stripe plateforme ;
// le payout au vendeur se fait via virement manuel (l'IBAN est sur SellerProfile).
// Stripe Connect est volontairement écarté pour l'instant : le KYC vendeur
// imposerait une friction trop forte au démarrage.
class StripeProvider implements PaymentProvider {
  readonly name = "stripe" as const

  async createCheckout(order: Order): Promise<CheckoutSession> {
    const stripe = getStripe()

    // Charge les line items pour les afficher dans la session Stripe.
    const items = await prisma.orderItem.findMany({ where: { orderId: order.id } })

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000"
    // Stripe remplace `{CHECKOUT_SESSION_ID}` à la redirection — utile pour
    // côté front si on veut afficher un état "paiement en cours de confirmation".
    const successUrl = `${baseUrl}/orders/${order.id}?stripe_session={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/marketplace/${items[0]?.productId ?? ""}/checkout?cancelled=1`

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          unit_amount: item.unitPriceCents,
          product_data: { name: item.productName },
        },
        quantity: item.quantity,
      })),
      customer_email: order.customerEmail,
      // metadata.orderId est le lien essentiel : le webhook l'utilise pour
      // retrouver l'Order côté DB.
      metadata: { orderId: order.id },
      payment_intent_data: {
        metadata: { orderId: order.id },
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Stripe expire la session après 24h par défaut ; on la coupe à 1h
      // pour éviter les sessions orphelines qui traînent.
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
      locale: "auto",
    })

    if (!session.url) {
      throw new Error("Stripe n'a pas retourné d'URL de checkout")
    }

    // Persiste paymentRef = session.id pour identifier l'order côté webhook.
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentProvider: "stripe", paymentRef: session.id },
    })

    return {
      provider: this.name,
      url: session.url,
      sessionRef: session.id,
    }
  }
}

let cached: PaymentProvider | null = null

export function getPaymentProvider(): PaymentProvider {
  if (cached) return cached
  const name = (process.env.PAYMENT_PROVIDER ?? "mock").toLowerCase() as PaymentProviderName
  switch (name) {
    case "manual":
      cached = new ManualPaymentProvider()
      break
    case "stripe":
      cached = new StripeProvider()
      break
    case "mock":
    default:
      cached = new MockPaymentProvider()
  }
  return cached
}

export function resetPaymentProviderForTests() {
  cached = null
}
