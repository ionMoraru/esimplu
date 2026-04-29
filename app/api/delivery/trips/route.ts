import { NextResponse } from "next/server"
import { searchPublishedTrips } from "@/lib/services/trips"
import { handleApiError } from "@/lib/api/respond"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const originCity = url.searchParams.get("originCity") ?? undefined
    const destinationCity = url.searchParams.get("destinationCity") ?? undefined
    const fromDateStr = url.searchParams.get("fromDate")
    const toDateStr = url.searchParams.get("toDate")
    const typeStr = url.searchParams.get("type")
    const type = typeStr === "PASSENGER" || typeStr === "PARCEL" ? typeStr : undefined

    const trips = await searchPublishedTrips({
      originCity,
      destinationCity,
      fromDate: fromDateStr ? new Date(fromDateStr) : undefined,
      toDate: toDateStr ? new Date(toDateStr) : undefined,
      type,
    })
    return NextResponse.json({ trips })
  } catch (err) {
    return handleApiError(err)
  }
}
