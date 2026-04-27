import { requireSellerSession } from "@/lib/auth/server-guards"
import { ProductForm } from "@/components/dashboard/product-form"

export default async function NewProductPage() {
  await requireSellerSession()

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Nouveau produit</h1>
      <ProductForm
        mode="create"
        initial={{
          name: "",
          description: "",
          imageUrl: "",
          priceEur: "",
          stock: "1",
          countriesAvailable: [],
          category: "",
          isPublished: false,
        }}
      />
    </main>
  )
}
