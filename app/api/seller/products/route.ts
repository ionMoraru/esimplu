import { NextResponse } from "next/server"
import { requireSeller } from "@/lib/auth/roles"
import { createProduct, listProducts } from "@/lib/services/products"
import { handleApiError, readJson } from "@/lib/api/respond"

export async function GET() {
  try {
    const { seller } = await requireSeller()
    const products = await listProducts({ sellerId: seller.id })
    return NextResponse.json({ products })
  } catch (err) {
    return handleApiError(err)
  }
}

export async function POST(request: Request) {
  try {
    const { seller } = await requireSeller()
    const body = await readJson<{
      name: string
      description: string
      imageUrl?: string
      priceCents: number
      stock?: number
      countriesAvailable: string[]
      category?: string
      isPublished?: boolean
    }>(request)
    const product = await createProduct(seller, body)
    return NextResponse.json({ product }, { status: 201 })
  } catch (err) {
    return handleApiError(err)
  }
}
