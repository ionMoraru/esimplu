import type { Product, SellerProfile } from "@/lib/generated/prisma/client"

// Format unifié pour ProductCard / ProducerCard, qui acceptent les mêmes
// shapes pour les produits/producteurs DB et mock data.
//
// On garde la signature identique aux mock objects pour ne pas avoir à
// modifier les composants partagés (ProductCard / ProducerCard).

export interface DisplayProduct {
  id: string
  sellerName: string
  name: string
  description: string
  price: number // EUR (pas cents)
  currency: "EUR"
  image: string
}

export interface DisplayProducer {
  id: string
  slug: string
  name: string
  region: string
  since: number
  shortStory: string
  image: string
}

const PLACEHOLDER_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600"
const PLACEHOLDER_PRODUCER_IMAGE =
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600"

export function dbProductToDisplay(
  product: Product,
  seller: { displayName: string },
): DisplayProduct {
  return {
    id: product.id,
    sellerName: seller.displayName,
    name: product.name,
    description: product.description,
    price: product.priceCents / 100,
    currency: "EUR",
    image: product.imageUrl?.trim() || PLACEHOLDER_PRODUCT_IMAGE,
  }
}

export function dbSellerToDisplayProducer(seller: SellerProfile): DisplayProducer {
  return {
    id: seller.id,
    slug: seller.slug,
    name: seller.displayName,
    region: seller.city ?? seller.country.toUpperCase(),
    since: seller.createdAt.getFullYear(),
    shortStory:
      seller.description?.slice(0, 140) ??
      `Producător din ${seller.city ?? seller.country.toUpperCase()}`,
    image: PLACEHOLDER_PRODUCER_IMAGE,
  }
}

// Type pour le filtre côté client : on porte les pays de livraison (pour les
// produits DB on les a, pour les mocks aussi). On l'annexe au DisplayProduct
// uniquement quand on en a besoin (filtre).
export interface DisplayProductWithMeta extends DisplayProduct {
  countriesAvailable: string[]
  category: string | null
  source: "db" | "mock"
}

export function dbProductToDisplayWithMeta(
  product: Product,
  seller: { displayName: string },
): DisplayProductWithMeta {
  return {
    ...dbProductToDisplay(product, seller),
    countriesAvailable: product.countriesAvailable,
    category: product.category,
    source: "db",
  }
}
