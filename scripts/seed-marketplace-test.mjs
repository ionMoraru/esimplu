 
// Run with: node scripts/seed-marketplace-test.mjs
// Idempotent fixture seeder for marketplace MVP E2E tests.
// Creates: admin / seller / courier / customer (all password: password1234)

import { PrismaClient } from "../lib/generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"
import bcryptjs from "bcryptjs"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  const passwordHash = await bcryptjs.hash("password1234", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@e2e.local" },
    update: { role: "ADMIN", password: passwordHash },
    create: {
      email: "admin@e2e.local",
      name: "Admin Test",
      password: passwordHash,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  })

  const seller = await prisma.user.upsert({
    where: { email: "seller@e2e.local" },
    update: { role: "SELLER", password: passwordHash },
    create: {
      email: "seller@e2e.local",
      name: "Vendeur Test",
      password: passwordHash,
      role: "SELLER",
      emailVerified: new Date(),
    },
  })
  await prisma.sellerProfile.upsert({
    where: { userId: seller.id },
    update: { approved: true },
    create: {
      userId: seller.id,
      displayName: "Ferma Test",
      slug: "ferma-test",
      city: "Chișinău",
      country: "md",
      phone: "+373 22 000 000",
      iban: "MD00000000000000000000",
      commissionPct: 12,
      approved: true,
    },
  })

  const courier = await prisma.user.upsert({
    where: { email: "courier@e2e.local" },
    update: { role: "COURIER", password: passwordHash },
    create: {
      email: "courier@e2e.local",
      name: "Livreur Test",
      password: passwordHash,
      role: "COURIER",
      emailVerified: new Date(),
    },
  })
  await prisma.courierProfile.upsert({
    where: { userId: courier.id },
    update: { approved: true },
    create: {
      userId: courier.id,
      displayName: "Express Test",
      phone: "+33 1 00 00 00 00",
      baseCity: "Paris",
      baseCountry: "fr",
      approved: true,
    },
  })

  const customer = await prisma.user.upsert({
    where: { email: "customer@e2e.local" },
    update: { password: passwordHash },
    create: {
      email: "customer@e2e.local",
      name: "Client Test",
      password: passwordHash,
      role: "CUSTOMER",
      emailVerified: new Date(),
    },
  })

  console.log("admin:", admin.id)
  console.log("seller:", seller.id)
  console.log("courier:", courier.id)
  console.log("customer:", customer.id)
  console.log("\nFixtures ready. Login: <role>@e2e.local / password1234")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
