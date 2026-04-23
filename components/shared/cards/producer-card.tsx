import Link from "next/link"

type Producer = {
  id: string
  slug: string
  name: string
  region: string
  since: number
  shortStory: string
  image: string
}

export function ProducerCard({ producer }: { producer: Producer }) {
  return (
    <Link
      href={`/marketplace/producer/${producer.slug}`}
      className="group flex gap-4 rounded-2xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="w-32 shrink-0 bg-muted overflow-hidden">
        <img
          src={producer.image}
          alt={producer.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex flex-col gap-2 py-4 pr-4 flex-1 min-w-0">
        <div>
          <h3
            className="text-base font-semibold leading-tight group-hover:text-primary transition-colors"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {producer.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            📍 {producer.region} · din {producer.since}
          </p>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {producer.shortStory}
        </p>
        <span className="text-xs font-medium text-primary mt-auto">
          Vezi producător →
        </span>
      </div>
    </Link>
  )
}
