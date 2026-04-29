import { prisma } from "@/lib/prisma"
import { mockProducts, mockProductCategories, mockProducers } from "@/lib/mock-data"
import {
  dbProductToDisplayWithMeta,
  dbSellerToDisplayProducer,
  type DisplayProductWithMeta,
} from "@/lib/marketplace/display"
import { MarketplaceClient } from "@/components/marketplace/marketplace-client"

export default async function MarketplacePage() {
  // Charge tous les produits DB publiés (sellers approuvés implicitement —
  // si l'admin retire l'approbation, les produits deviennent muets côté API
  // mais on les filtre ici aussi par sécurité).
  const dbProducts = await prisma.product.findMany({
    where: {
      isPublished: true,
      seller: { approved: true },
    },
    include: { seller: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  })

  // Sellers à mettre en avant (3-6 selon ce qu'on a en DB).
  const dbSellers = await prisma.sellerProfile.findMany({
    where: {
      approved: true,
      products: { some: { isPublished: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  })

  // Adapte les DB products. On préserve les mock products en complément
  // pour ne pas avoir une marketplace vide pendant l'amorçage.
  const dbDisplay: DisplayProductWithMeta[] = dbProducts.map((p) =>
    dbProductToDisplayWithMeta(p, p.seller),
  )
  const mockDisplay: DisplayProductWithMeta[] = mockProducts.map((p) => ({
    id: p.id,
    sellerName: p.sellerName,
    name: p.name,
    description: p.description,
    price: p.price,
    currency: "EUR",
    image: p.image,
    countriesAvailable: p.deliveriesTo,
    category: p.category,
    source: "mock",
  }))

  // DB d'abord (vrais produits), mocks ensuite (démo).
  const products: DisplayProductWithMeta[] = [...dbDisplay, ...mockDisplay]

  // Producers : DB en premier, complétés par les mocks pour avoir au moins 3.
  const dbProducers = dbSellers.map(dbSellerToDisplayProducer)
  const producers = dbProducers.length >= 3
    ? dbProducers.slice(0, 6)
    : [...dbProducers, ...mockProducers].slice(0, 3)

  return (
    <MarketplaceClient
      products={products}
      producers={producers}
      categories={mockProductCategories}
    />
  )
}
