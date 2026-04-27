import Link from "next/link"
import { notFound } from "next/navigation"
import { ArticleCard } from "@/components/shared/cards/article-card"
import { COUNTRIES } from "@/lib/countries"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  })
  if (!article || !article.published) notFound()

  const category = article.category

  const relatedArticles = article.categoryId
    ? await prisma.article.findMany({
        where: {
          categoryId: article.categoryId,
          id: { not: article.id },
          published: true,
        },
        include: { category: true },
        take: 3,
        orderBy: { createdAt: "desc" },
      })
    : []

  return (
    <main className="py-8 px-6">
      <article className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-8 flex items-center gap-2 flex-wrap">
          <Link
            href="/articles"
            className="hover:text-foreground transition-colors"
          >
            Articole
          </Link>
          {category && (
            <>
              <span>/</span>
              <span>{category.name}</span>
            </>
          )}
          <span>/</span>
          <span className="text-foreground font-medium line-clamp-1">
            {article.title}
          </span>
        </nav>

        {/* Header */}
        <header className="flex flex-col gap-4 mb-8">
          <div className="flex flex-wrap gap-1.5">
            {category && (
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                {category.name}
              </span>
            )}
            {article.countries.map((code) => {
              const country = COUNTRIES.find((c) => c.code === code)
              if (!country) return null
              return (
                <span
                  key={code}
                  className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground"
                >
                  {country.flag} {country.name}
                </span>
              )
            })}
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {article.title}
          </h1>

          <p className="text-sm text-muted-foreground">
            {article.readingTime
              ? `${article.readingTime} min de lectură · `
              : ""}
            Publicat pe {formatDate(article.createdAt)}
          </p>

          {article.excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed border-l-2 border-primary pl-4 italic">
              {article.excerpt}
            </p>
          )}
        </header>

        {/* Cover image */}
        {article.coverImage && (
          <div className="aspect-video bg-muted rounded-2xl overflow-hidden mb-10">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content — injection HTML contrôlée (contenu vient de mock-data, pas de l'utilisateur) */}
        {article.content && (
          <div
            className="text-base leading-relaxed text-foreground
              [&_p]:mb-5
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2
              [&_li]:leading-relaxed
              [&_strong]:font-semibold [&_strong]:text-foreground"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}

        {/* Navigation retour */}
        <div className="mt-16 pt-8 border-t">
          <Link
            href="/articles"
            className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            ← Toate articolele
          </Link>
        </div>
      </article>

      {/* Articles similaires */}
      {relatedArticles.length > 0 && (
        <section className="max-w-6xl mx-auto mt-20 pt-12 border-t">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-8"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Articole similare
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map((a) => (
              <ArticleCard
                key={a.id}
                article={{
                  id: a.id,
                  title: a.title,
                  slug: a.slug,
                  excerpt: a.excerpt ?? undefined,
                  coverImage: a.coverImage ?? undefined,
                  countries: a.countries,
                  createdAt: a.createdAt,
                  readingTime: a.readingTime ?? undefined,
                  category: a.category?.slug,
                  categoryName: a.category?.name,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
