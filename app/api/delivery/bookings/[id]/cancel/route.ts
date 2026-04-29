import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/roles"
import { handleApiError } from "@/lib/api/respond"
import { cancelBookingAsCustomer, BookingStateError } from "@/lib/services/bookings"

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser()
    const { id } = await params
    const booking = await cancelBookingAsCustomer(id, user.id)
    return NextResponse.json({ booking })
  } catch (err) {
    if (err instanceof BookingStateError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    return handleApiError(err)
  }
}
