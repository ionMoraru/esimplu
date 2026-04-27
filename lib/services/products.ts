import { prisma } from "@/lib/prisma"
import { ForbiddenError } from "@/lib/auth/roles"
import type { Product, SellerProfile } from "@/lib/generated/prisma/client"

export interface CreateProductInput {
  name: string
  description: string
  imageUrl?: string | null
  priceCents: number
  stock?: number
  countriesAvailable: string[]
  category?: string | null
  isPublished?: boolean
}

export type UpdateProductInput = Partial<CreateProductInput>

export interface ListProductsFilters {
  country?: string
  category?: string
  sellerId?: string
  publishedOnly?: boolean
}

// H4 fix: whitelist explicite des pays supportés (Phase 1.5).
const ALLOWED_COUNTRIES = ["fr", "de", "it", "uk"] as const

// C4 fix: prix mini de 1€ pour éviter "produit gratuit" qui abuserait du
// réseau courier sans aucune contrepartie. Cap haut pour bloquer une virgule
// perdue (ex. saisie "10000" au lieu de "100,00").
const MIN_PRICE_CENTS = 100
const MAX_PRICE_CENTS = 10_000_00 // 10 000 €

function validateInput(input: CreateProductInput | UpdateProductInput) {
  if ("priceCents" in input && input.priceCents !== undefined) {
    if (input.priceCents < MIN_PRICE_CENTS) {
      throw new Error(`Le prix doit être supérieur ou égal à ${MIN_PRICE_CENTS / 100} €`)
    }
    if (input.priceCents > MAX_PRICE_CENTS) {
      throw new Error(`Le prix doit être inférieur à ${MAX_PRICE_CENTS / 100} €`)
    }
  }
  if ("stock" in input && input.stock !== undefined && input.stock < 0) {
    throw new Error("stock must be >= 0")
  }
  if ("countriesAvailable" in input && input.countriesAvailable !== undefined) {
    if (input.countriesAvailable.length === 0) {
      throw new Error("countriesAvailable must contain at least one country")
    }
    const invalid = input.countriesAvailable.filter(
      (c) => !ALLOWED_COUNTRIES.includes(c as (typeof ALLOWED_COUNTRIES)[number]),
    )
    if (invalid.length > 0) {
      throw new Error(`Pays non supporté(s) : ${invalid.join(", ")}`)
    }
  }
}

export async function createProduct(seller: SellerProfile, input: CreateProductInput): Promise<Product> {
  validateInput(input)
  return prisma.product.create({
    data: {
      sellerId: seller.id,
      name: input.name,
      description: input.description,
      imageUrl: input.imageUrl ?? null,
      priceCents: input.priceCents,
      stock: input.stock ?? 1,
      countriesAvailable: input.countriesAvailable,
      category: input.category ?? null,
      isPublished: input.isPublished ?? false,
    },
  })
}

export async function updateProduct(productId: string, sellerId: string, input: UpdateProductInput): Promise<Product> {
  validateInput(input)
  const existing = await prisma.product.findUnique({ where: { id: productId } })
  if (!existing) throw new Error("Product not found")
  if (existing.sellerId !== sellerId) {
    throw new ForbiddenError("You do not own this product")
  }
  return prisma.product.update({
    where: { id: productId },
    data: {
      name: input.name ?? undefined,
      description: input.description ?? undefined,
      imageUrl: input.imageUrl ?? undefined,
      priceCents: input.priceCents ?? undefined,
      stock: input.stock ?? undefined,
      countriesAvailable: input.countriesAvailable ?? undefined,
      category: input.category ?? undefined,
      isPublished: input.isPublished ?? undefined,
    },
  })
}

export async function deleteProduct(productId: string, sellerId: string): Promise<void> {
  const existing = await prisma.product.findUnique({ where: { id: productId } })
  if (!existing) throw new Error("Product not found")
  if (existing.sellerId !== sellerId) {
    throw new ForbiddenError("You do not own this product")
  }
  await prisma.product.delete({ where: { id: productId } })
}

export async function getProduct(productId: string): Promise<Product | null> {
  return prisma.product.findUnique({ where: { id: productId } })
}

export async function listProducts(filters: ListProductsFilters = {}): Promise<Product[]> {
  return prisma.product.findMany({
    where: {
      isPublished: filters.publishedOnly ? true : undefined,
      sellerId: filters.sellerId,
      category: filters.category,
      countriesAvailable: filters.country ? { has: filters.country } : undefined,
    },
    orderBy: { createdAt: "desc" },
  })
}
