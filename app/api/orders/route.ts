import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/roles"
import { createOrder } from "@/lib/services/orders"
import { getPaymentProvider } from "@/lib/services/payment"
import { getEmailService, tplCustomerOrderConfirmation } from "@/lib/services/email"
import { handleApiError, readJson } from "@/lib/api/respond"

interface CreateOrderBody {
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: string
  deliveryCity: string
  deliveryCountry: string
  notes?: string | null
  items: Array<{ productId: string; quantity?: number }>
}

export async function POST(request: Request) {
  try {
    const user = await requireUser()
    const body = await readJson<CreateOrderBody>(request)

    const order = await createOrder({
      customerId: user.id,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      deliveryAddress: body.deliveryAddress,
      deliveryCity: body.deliveryCity,
      deliveryCountry: body.deliveryCountry,
      notes: body.notes ?? null,
      items: body.items,
    })

    const provider = getPaymentProvider()
    const checkout = await provider.createCheckout(order)

    // Customer confirmation email — note: order is still PENDING_PAYMENT.
    const email = getEmailService()
    const totalEur = (order.productsCents / 100).toFixed(2).replace(".", ",")
    const tpl = tplCustomerOrderConfirmation({
      orderId: order.id,
      productsLine: `${body.items.length} produit(s)`,
      totalEur,
      customerName: body.customerName,
    })
    await email.send({ ...tpl, to: body.customerEmail })

    return NextResponse.json({ order, checkout })
  } catch (err) {
    return handleApiError(err)
  }
}
