import { NextResponse } from "next/server"
import { getProduct } from "@/lib/services/products"
import { handleApiError, jsonError } from "@/lib/api/respond"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await getProduct(id)
    if (!product) return jsonError("Product not found", 404)
    return NextResponse.json({ product })
  } catch (err) {
    return handleApiError(err)
  }
}
