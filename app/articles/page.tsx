import { cookies } from "next/headers"
import { ArticlesList } from "@/components/articles/articles-list"
import { PageHero } from "@/components/shared/navigation/page-hero"
import { COUNTRIES, COUNTRY_COOKIE } from "@/lib/countries"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function ArticlesPage() {
  const cookieCountry = (await cookies()).get(COUNTRY_COOKIE)?.value
  const initialCountry =
    cookieCountry && COUNTRIES.some((c) => c.code === cookieCountry)
      ? cookieCountry
      : "all"

  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.articleCategory.findMany({
      orderBy: { name: "asc" },
    }),
  ])

  return (
    <main>
      <PageHero
        title="Articole"
        subtitle="Ghiduri practice pentru diaspora română în Europa"
      />

      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <ArticlesList
            articles={articles}
            categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
            initialCountry={initialCountry}
          />
        </div>
      </section>
    </main>
  )
}
