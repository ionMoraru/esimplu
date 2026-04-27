import type { Order } from "@/lib/generated/prisma/client"

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

let cached: PaymentProvider | null = null

export function getPaymentProvider(): PaymentProvider {
  if (cached) return cached
  const name = (process.env.PAYMENT_PROVIDER ?? "mock").toLowerCase() as PaymentProviderName
  switch (name) {
    case "manual":
      cached = new ManualPaymentProvider()
      break
    case "stripe":
      throw new Error("Stripe provider not yet implemented — set PAYMENT_PROVIDER=mock or manual")
    case "mock":
    default:
      cached = new MockPaymentProvider()
  }
  return cached
}

export function resetPaymentProviderForTests() {
  cached = null
}
