import { NextResponse } from "next/server"
import { requireSeller } from "@/lib/auth/roles"
import { deleteProduct, updateProduct } from "@/lib/services/products"
import { handleApiError, readJson } from "@/lib/api/respond"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { seller } = await requireSeller()
    const { id } = await params
    const body = await readJson<{
      name?: string
      description?: string
      imageUrl?: string | null
      priceCents?: number
      stock?: number
      countriesAvailable?: string[]
      category?: string | null
      isPublished?: boolean
    }>(request)
    const product = await updateProduct(id, seller.id, body)
    return NextResponse.json({ product })
  } catch (err) {
    return handleApiError(err)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { seller } = await requireSeller()
    const { id } = await params
    await deleteProduct(id, seller.id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return handleApiError(err)
  }
}
