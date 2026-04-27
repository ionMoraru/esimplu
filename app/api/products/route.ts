import { NextResponse } from "next/server"
import { listProducts } from "@/lib/services/products"
import { handleApiError } from "@/lib/api/respond"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const country = url.searchParams.get("country") ?? undefined
    const category = url.searchParams.get("category") ?? undefined
    const sellerId = url.searchParams.get("sellerId") ?? undefined
    const products = await listProducts({ country, category, sellerId, publishedOnly: true })
    return NextResponse.json({ products })
  } catch (err) {
    return handleApiError(err)
  }
}
