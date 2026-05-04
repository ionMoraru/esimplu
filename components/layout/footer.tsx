import Link from "next/link"

const footerLinks = {
  platform: [
    { href: "/articles", label: "Articole" },
    { href: "/services", label: "Servicii" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/delivery", label: "Livrare" },
  ],
  info: [
    { href: "/despre", label: "Despre noi" },
    { href: "/cum-functioneaza", label: "Cum funcționează" },
    { href: "/contact", label: "Contact" },
    { href: "/confidentialitate", label: "Confidențialitate" },
    { href: "/termeni", label: "Termeni" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-muted border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <span
              className="text-xl font-bold text-primary"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              eSimplu
            </span>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Platforma diasporei române și moldovene în Europa. Articole practice, servicii de încredere și produse din acasă.
            </p>
          </div>

          {/* Platform links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Platformă
            </p>
            <ul className="flex flex-col gap-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Informații
            </p>
            <ul className="flex flex-col gap-2">
              {footerLinks.info.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© 2026 eSimplu · Făcut cu ♥ pentru diaspora română</span>
          <span>Franța · Germania · Italia · Marea Britanie</span>
        </div>
      </div>
    </footer>
  )
}
