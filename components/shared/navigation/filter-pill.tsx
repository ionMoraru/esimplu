type FilterPillProps = {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

export function FilterPill({ active, onClick, children }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </button>
  )
}
