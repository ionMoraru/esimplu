import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/roles"
import { getOrderForUser } from "@/lib/services/orders"
import { handleApiError, jsonError } from "@/lib/api/respond"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser()
    const { id } = await params
    const order = await getOrderForUser(id, user)
    if (!order) return jsonError("Order not found or access denied", 404)
    return NextResponse.json({ order })
  } catch (err) {
    return handleApiError(err)
  }
}
