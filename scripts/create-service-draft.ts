/**
 * Create a service draft from publicly available info.
 *
 * Usage:
 *   npx tsx scripts/create-service-draft.ts \
 *     --title "Mutări, livrări..." \
 *     --category mutari-transport \
 *     --city Paris \
 *     --country fr \
 *     --phone +33758044791 \
 *     --description "..." \
 *     --languages ro,fr \
 *     --whatsapp +33758044791 \
 *     --source-url "https://www.facebook.com/..."
 *
 * Outputs the claim URL to copy-paste into your SMS/email/manual outreach.
 */
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { createServiceDraft } from "../lib/services/claim"
import { prisma } from "../lib/prisma"

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith("--")) {
      const key = a.slice(2)
      const val = argv[i + 1]
      if (val !== undefined && !val.startsWith("--")) {
        out[key] = val
        i++
      } else {
        out[key] = "true"
      }
    }
  }
  return out
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  const required = [
    "title",
    "category",
    "city",
    "country",
    "phone",
    "description",
  ]
  const missing = required.filter((k) => !args[k])
  if (missing.length) {
    console.error(`❌ Missing required args: ${missing.join(", ")}`)
    console.error(
      "Required: --title --category --city --country --phone --description"
    )
    console.error(
      "Optional: --languages (csv) --whatsapp --email --source-url"
    )
    process.exit(1)
  }

  const { service, claimUrl, expiresAt } = await createServiceDraft({
    title: args.title,
    categorySlug: args.category,
    city: args.city,
    country: args.country,
    phone: args.phone,
    description: args.description,
    languages: args.languages?.split(",").map((s) => s.trim()),
    whatsapp: args.whatsapp ?? null,
    email: args.email ?? null,
    sourceUrl: args["source-url"] ?? null,
  })

  console.log("\n✅ Draft created")
  console.log(`   id:        ${service.id}`)
  console.log(`   title:     ${service.title}`)
  console.log(`   status:    ${service.status}`)
  console.log(`   expires:   ${expiresAt.toISOString().slice(0, 10)} (60j)`)
  console.log(`\n📎 Claim URL (à envoyer à la personne) :`)
  console.log(`   ${claimUrl}\n`)
}

main()
  .catch((e) => {
    console.error("❌ Error:", e.message ?? e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
