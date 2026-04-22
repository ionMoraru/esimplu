import Link from "next/link"

const NAV_ITEMS = [
  { id: "couleurs", label: "Couleurs" },
  { id: "typographie", label: "Typographie" },
  { id: "boutons", label: "Boutons" },
  { id: "badges", label: "Badges & Tags" },
  { id: "inputs", label: "Champs de saisie" },
  { id: "cartes-articles", label: "Cartes Articles" },
  { id: "cartes-produits", label: "Cartes Produits" },
  { id: "cartes-services", label: "Cartes Services" },
  { id: "avatars", label: "Avatars & States" },
  { id: "espacement", label: "Radius & Ombres" },
]

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-background flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 h-full overflow-y-auto border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            eSimplu
          </p>
          <h1 className="text-lg font-semibold mt-0.5 text-foreground">Design System</h1>
          <p className="text-[10px] text-muted-foreground mt-1 font-mono">CrowdFarming × Medium</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="flex items-center rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Retour au site
          </Link>
          <p className="text-[10px] text-muted-foreground/60 mt-2 leading-relaxed">
            Modifie{" "}
            <code className="font-mono bg-muted px-1 rounded">globals.css</code> pour
            changer les tokens
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
