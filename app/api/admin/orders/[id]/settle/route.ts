import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/roles"
import { settleOrder } from "@/lib/services/orders"
import { handleApiError } from "@/lib/api/respond"

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    const { id } = await params
    const order = await settleOrder(id, admin)
    return NextResponse.json({ order })
  } catch (err) {
    return handleApiError(err)
  }
}
