import Link from "next/link"

type ServiceCategoryButtonProps = {
  href: string
  icon: string
  name: string
  variant?: "default" | "cta"
}

export function ServiceCategoryButton({
  href,
  icon,
  name,
  variant = "default",
}: ServiceCategoryButtonProps) {
  if (variant === "cta") {
    return (
      <Link
        href={href}
        className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/30 rounded-xl px-5 py-3 text-sm font-medium hover:bg-primary/20 transition-colors"
      >
        <span>{icon}</span>
        {name}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-2 bg-card border rounded-xl px-5 py-3 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
    >
      <span>{icon}</span>
      {name}
    </Link>
  )
}
