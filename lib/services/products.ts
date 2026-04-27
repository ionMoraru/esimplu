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

function validateInput(input: CreateProductInput | UpdateProductInput) {
  if ("priceCents" in input && input.priceCents !== undefined && input.priceCents < 0) {
    throw new Error("priceCents must be >= 0")
  }
  if ("stock" in input && input.stock !== undefined && input.stock < 0) {
    throw new Error("stock must be >= 0")
  }
  if ("countriesAvailable" in input && input.countriesAvailable !== undefined) {
    if (input.countriesAvailable.length === 0) {
      throw new Error("countriesAvailable must contain at least one country")
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
