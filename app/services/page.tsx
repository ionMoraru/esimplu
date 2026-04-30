import { cookies } from "next/headers"
import { ServicesList } from "@/components/services/services-list"
import { PageHero } from "@/components/shared/navigation/page-hero"
import { COUNTRIES, COUNTRY_COOKIE } from "@/lib/countries"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function ServicesPage() {
  const cookieCountry = (await cookies()).get(COUNTRY_COOKIE)?.value
  const initialCountry =
    cookieCountry && COUNTRIES.some((c) => c.code === cookieCountry)
      ? cookieCountry
      : "all"

  const [services, categories] = await Promise.all([
    prisma.serviceListing.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.serviceCategory.findMany({
      where: { services: { some: { status: "PUBLISHED" } } },
      orderBy: { name: "asc" },
    }),
  ])

  return (
    <main>
      <PageHero
        title="Servicii"
        subtitle="Directorul serviciilor pentru diaspora română în Europa — consulate, administrații publice, urgențe, asociații"
      />

      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <ServicesList
            services={services.map((s) => ({
              id: s.id,
              title: s.title,
              description: s.description,
              languages: s.languages,
              city: s.city,
              countries: s.countries,
              phone: s.phone,
              email: s.email,
              whatsapp: s.whatsapp,
              photo: s.photo,
              category: s.category
                ? { slug: s.category.slug, name: s.category.name }
                : null,
            }))}
            categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
            initialCountry={initialCountry}
          />
        </div>
      </section>
    </main>
  )
}
