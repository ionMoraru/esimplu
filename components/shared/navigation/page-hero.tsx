type PageHeroProps = {
  title: string
  subtitle?: string
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="bg-muted/40 border-b py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1
          className="text-3xl sm:text-4xl font-bold"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
