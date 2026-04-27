import { notFound } from "next/navigation"
import { requireSellerSession } from "@/lib/auth/server-guards"
import { getProduct } from "@/lib/services/products"
import { ProductForm } from "@/components/dashboard/product-form"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { seller } = await requireSellerSession()
  const { id } = await params
  const product = await getProduct(id)
  if (!product || product.sellerId !== seller.id) notFound()

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Éditer le produit</h1>
      <ProductForm
        mode="edit"
        initial={{
          id: product.id,
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl ?? "",
          priceEur: (product.priceCents / 100).toFixed(2).replace(".", ","),
          stock: String(product.stock),
          countriesAvailable: product.countriesAvailable,
          category: product.category ?? "",
          isPublished: product.isPublished,
        }}
      />
    </main>
  )
}
