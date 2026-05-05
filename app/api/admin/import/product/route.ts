import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireImportToken, ImportAuthError, importAuthErrorResponse } from "@/lib/api/import-auth"
import { logImport } from "@/lib/api/import-log"
import { createProduct } from "@/lib/services/products"

interface ImportProductBody {
  sellerSlug: string
  name: string
  description: string
  imageUrl?: string | null
  priceCents: number
  stock?: number
  countriesAvailable: string[]
  category?: string | null
  isPublished?: boolean
}

function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status })
}

function validateBody(b: Partial<ImportProductBody>): string | null {
  if (!b.sellerSlug?.trim()) return "sellerSlug required"
  if (!b.name?.trim() || b.name.length > 200) return "name required (max 200)"
  if (!b.description?.trim() || b.description.length > 5000) {
    return "description required (max 5000)"
  }
  if (typeof b.priceCents !== "number" || !Number.isFinite(b.priceCents)) {
    return "priceCents required (integer)"
  }
  if (b.stock !== undefined && (typeof b.stock !== "number" || b.stock < 0)) {
    return "stock must be a non-negative integer"
  }
  if (!Array.isArray(b.countriesAvailable) || b.countriesAvailable.length === 0) {
    return "countriesAvailable required (non-empty array)"
  }
  return null
}

export async function POST(request: Request) {
  let body: Partial<ImportProductBody> = {}
  try {
    requireImportToken(request)
    body = (await request.json()) as Partial<ImportProductBody>

    const err = validateBody(body)
    if (err) {
      await logImport({ type: "product", action: "duplicate", payload: body, request, status: 400 })
      return jsonError(err, 400)
    }

    const seller = await prisma.sellerProfile.findUnique({
      where: { slug: body.sellerSlug!.trim().toLowerCase() },
    })
    if (!seller) {
      await logImport({ type: "product", action: "duplicate", payload: body, request, status: 404 })
      return jsonError(`seller not found for slug "${body.sellerSlug}"`, 404)
    }

    const name = body.name!.trim()

    // Idempotence : un produit avec même seller + nom (case-insensitive) →
    // doublon, on retourne tel quel.
    const existing = await prisma.product.findFirst({
      where: {
        sellerId: seller.id,
        name: { equals: name, mode: "insensitive" },
      },
    })
    if (existing) {
      await logImport({
        type: "product",
        action: "duplicate",
        targetId: existing.id,
        targetSlug: `${seller.slug}/${existing.name}`,
        payload: body,
        request,
        status: 200,
      })
      return NextResponse.json({ product: existing, alreadyExists: true }, { status: 200 })
    }

    // Délègue les validations métier (prix mini/maxi, pays autorisés) à
    // `createProduct`, qui sait lever des Errors explicites.
    const product = await createProduct(seller, {
      name,
      description: body.description!.trim(),
      imageUrl: body.imageUrl?.trim() || null,
      priceCents: body.priceCents!,
      stock: body.stock,
      countriesAvailable: body.countriesAvailable!.map((c) => c.toLowerCase()),
      category: body.category?.trim() || null,
      isPublished: body.isPublished ?? false,
    })

    await logImport({
      type: "product",
      action: "created",
      targetId: product.id,
      targetSlug: `${seller.slug}/${product.name}`,
      payload: body,
      request,
      status: 201,
    })

    return NextResponse.json({ product, alreadyExists: false }, { status: 201 })
  } catch (e) {
    if (e instanceof ImportAuthError) return importAuthErrorResponse(e)
    const message = e instanceof Error ? e.message : "unknown error"
    // Erreurs de validation métier (createProduct) → 400.
    const status = message.includes("must") || message.includes("doit") ? 400 : 500
    await logImport({ type: "product", action: "duplicate", payload: body, request, status })
    return jsonError(message, status)
  }
}
