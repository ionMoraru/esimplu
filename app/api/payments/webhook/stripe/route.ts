import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripe, getWebhookSecret } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { markPaid } from "@/lib/services/orders"
import { getEmailService, tplSellerNewOrder } from "@/lib/services/email"

// Stripe webhook : signature HMAC obligatoire (header `stripe-signature`).
// Sans signature valide on rejette en 400 — Stripe retentera 3 fois sur
// 3 jours, ce qui laisse le temps de fixer une mauvaise config.
//
// Events consommés :
//   - checkout.session.completed     → l'order passe à PAID
//   - checkout.session.async_payment_failed → log dans OrderEvent
//   - checkout.session.expired       → log dans OrderEvent
//
// Les autres events sont ack-és en 200 sans action.

export async function POST(request: Request): Promise<NextResponse> {
  if ((process.env.PAYMENT_PROVIDER ?? "mock").toLowerCase() !== "stripe") {
    return NextResponse.json({ ignored: "PAYMENT_PROVIDER != stripe" }, { status: 200 })
  }

  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  // Stripe exige le body BRUT (string ou Buffer) pour la vérif HMAC ;
  // on ne doit PAS passer par request.json().
  const rawBody = await request.text()

  const stripe = getStripe()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, getWebhookSecret())
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature"
    console.error("Stripe webhook signature verification failed:", message)
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        // metadata.orderId est posé par notre StripeProvider.createCheckout.
        const orderId = session.metadata?.orderId
        if (!orderId) {
          console.warn("Stripe checkout.session.completed sans metadata.orderId", session.id)
          return NextResponse.json({ ignored: "no orderId in metadata" }, { status: 200 })
        }
        // Vérif explicite : l'argent est-il vraiment encaissé ?
        if (session.payment_status !== "paid") {
          console.warn("Stripe checkout.session.completed mais payment_status:", session.payment_status)
          return NextResponse.json({ ignored: `payment_status=${session.payment_status}` }, { status: 200 })
        }

        const order = await prisma.order.findUnique({ where: { id: orderId } })
        if (!order) {
          console.warn("Stripe webhook: order introuvable", orderId)
          return NextResponse.json({ ignored: "order not found" }, { status: 200 })
        }
        // Idempotent : si l'order est déjà PAID (re-livraison du webhook), on ack.
        if (order.status !== "PENDING_PAYMENT") {
          return NextResponse.json({ ignored: "already processed", status: order.status }, { status: 200 })
        }

        const updated = await markPaid(order.id, session.id, "stripe", null)

        // Email vendeur — best effort.
        try {
          const seller = await prisma.sellerProfile.findUnique({
            where: { id: updated.sellerId },
            include: { user: true },
          })
          const items = await prisma.orderItem.findMany({ where: { orderId: order.id } })
          if (seller?.user.email) {
            const totalEur = (updated.productsCents / 100).toFixed(2).replace(".", ",")
            const tpl = tplSellerNewOrder({
              orderId: order.id,
              productsLine: items.map((i) => `${i.productName} x${i.quantity}`).join(", "),
              totalEur,
              customerName: updated.customerName,
            })
            await getEmailService().send({ ...tpl, to: seller.user.email })
          }
        } catch (emailErr) {
          console.error("Stripe webhook: email vendeur échoué", emailErr)
        }

        return NextResponse.json({ ok: true, orderStatus: "PAID" }, { status: 200 })
      }

      case "checkout.session.async_payment_failed":
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.orderId
        if (orderId) {
          await prisma.orderEvent.create({
            data: {
              orderId,
              type: event.type === "checkout.session.expired" ? "PAYMENT_EXPIRED" : "PAYMENT_FAILED",
              payload: {
                stripeSessionId: session.id,
                paymentStatus: session.payment_status,
              },
              actorUserId: null,
            },
          })
        }
        return NextResponse.json({ ok: true }, { status: 200 })
      }

      default:
        // Tous les autres events : ack et continue.
        return NextResponse.json({ ignored: event.type }, { status: 200 })
    }
  } catch (err) {
    console.error("Stripe webhook handler error", err)
    // 500 ici : Stripe va retenter, ce qu'on veut si c'est un bug transitoire.
    return NextResponse.json({ error: "internal" }, { status: 500 })
  }
}
