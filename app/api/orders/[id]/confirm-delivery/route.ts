import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/roles"
import { confirmDeliveryByCustomer } from "@/lib/services/orders"
import { handleApiError } from "@/lib/api/respond"

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser()
    const { id } = await params
    const order = await confirmDeliveryByCustomer(id, user.id)
    return NextResponse.json({ order })
  } catch (err) {
    return handleApiError(err)
  }
}
