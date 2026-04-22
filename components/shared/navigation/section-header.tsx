import Link from "next/link"

type SectionHeaderProps = {
  title: string
  subtitle?: string
  href?: string
  linkLabel?: string
  /** Si true, affiche le lien uniquement sur sm+ (hidden sur mobile) */
  hideLinkOnMobile?: boolean
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel,
  hideLinkOnMobile = false,
}: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
        )}
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className={`text-sm font-medium text-primary hover:underline shrink-0 ${
            hideLinkOnMobile ? "hidden sm:block" : ""
          }`}
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  )
}
