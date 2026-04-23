import Link from "next/link"

type Product = {
  id: string
  sellerName: string
  name: string
  description: string
  price: number
  currency: "EUR"
  image: string
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/marketplace/${product.id}`}
      className="group flex flex-col rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-shadow"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <div className="aspect-square bg-muted overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <p className="text-xs text-muted-foreground font-medium">
          {product.sellerName} · Moldova
        </p>
        <h3
          className="text-base font-semibold leading-snug group-hover:text-primary transition-colors"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="text-lg font-bold text-primary">{product.price} €</span>
          <span className="text-sm font-medium text-primary">
            Vezi detalii →
          </span>
        </div>
      </div>
    </Link>
  )
}
