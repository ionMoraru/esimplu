# Phase 1 — Restructuration Projet — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructurer le projet eSimplu : supprimer le monorepo/workspaces, remplacer WordPress/MySQL par PostgreSQL, installer Auth.js + Prisma + shadcn/ui, et implémenter le sélecteur de pays.

**Architecture:** Next.js App Router unique à la racine du projet (plus de dossier `web/`). Auth.js gère l'authentification (Google, Facebook) avec Prisma adapter vers PostgreSQL. Le pays est sélectionné par l'utilisateur via une modale (première visite) ou un sélecteur (header), stocké dans un cookie.

**Tech Stack:** Next.js 16, Auth.js v5, Prisma 6, PostgreSQL 16 (Docker), shadcn/ui, Tailwind CSS v4.

**Note importante:** Next.js 16 peut avoir des breaking changes par rapport aux versions précédentes. Avant d'écrire du code Next.js, consulter `node_modules/next/dist/docs/` pour vérifier les API actuelles.

---

## Structure des fichiers cible

```
esimplu/
├── package.json                    ← un seul, plus de workspaces
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── docker-compose.yml              ← PostgreSQL uniquement
├── .env.example
├── .env.local                      ← (gitignored)
├── .gitignore
├── middleware.ts                   ← Auth.js middleware
├── app/
│   ├── layout.tsx                  ← Root layout + providers
│   ├── page.tsx                    ← Landing page placeholder
│   ├── login/page.tsx              ← Page connexion Auth.js
│   ├── articles/page.tsx           ← Placeholder Phase 1B
│   ├── services/page.tsx           ← Placeholder Phase 1B
│   ├── marketplace/page.tsx        ← Placeholder Phase 2
│   ├── delivery/page.tsx           ← Placeholder Phase 3
│   └── api/auth/[...nextauth]/route.ts
├── components/
│   ├── ui/                         ← shadcn/ui (auto-généré)
│   ├── country-modal.tsx
│   ├── country-selector.tsx
│   └── providers.tsx               ← SessionProvider + CountryProvider
├── lib/
│   ├── prisma.ts                   ← Prisma client singleton
│   ├── auth.ts                     ← Auth.js config
│   └── countries.ts                ← Constantes pays
├── prisma/
│   └── schema.prisma
├── types/
│   └── index.ts                    ← Types partagés
├── public/
│   └── (vide pour l'instant)
├── CLAUDE.md
├── README.md
└── .github/workflows/deploy.yml
```

---

## Task 1: Flatten le monorepo — remonter web/ à la racine

**Files:**
- Delete: `web/` (contenu remonté)
- Delete: `packages/`
- Modify: `package.json` (merger root + web)
- Move: `web/app/`, `web/lib/`, `web/public/`, `web/next.config.ts`, `web/tsconfig.json`, `web/postcss.config.mjs`, `web/eslint.config.mjs`, `web/jest.config.ts`, `web/middleware.ts` → racine
- Move: `packages/types/index.ts` → `types/index.ts`

- [ ] **Step 1: Copier les fichiers de web/ vers la racine**

```bash
# Depuis la racine du projet
cp -r web/app .
cp -r web/lib .
cp -r web/public .
cp web/next.config.ts .
cp web/tsconfig.json .
cp web/postcss.config.mjs .
cp web/eslint.config.mjs .
cp web/jest.config.ts .
cp web/middleware.ts .
cp web/AGENTS.md .
```

- [ ] **Step 2: Déplacer les types**

```bash
mkdir -p types
cp packages/types/index.ts types/index.ts
```

- [ ] **Step 3: Créer le nouveau package.json unifié**

Remplacer le contenu de `package.json` par :

```json
{
  "name": "esimplu",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "jest",
    "test:watch": "jest --watch",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate"
  },
  "dependencies": {
    "next": "16.2.3",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/jest": "^30.0.0",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.3",
    "jest": "^30.3.0",
    "tailwindcss": "^4",
    "ts-jest": "^29.4.9",
    "ts-node": "^10.9.2",
    "typescript": "^5"
  },
  "engines": {
    "node": ">=20"
  }
}
```

> Note : `jose` et `@esimplu/types` sont retirés. Auth.js et Prisma seront ajoutés dans les tasks suivantes.

- [ ] **Step 4: Mettre à jour le jest.config.ts**

Remplacer le contenu de `jest.config.ts` :

```typescript
import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
}

export default config
```

- [ ] **Step 5: Mettre à jour le .gitignore**

Remplacer le contenu de `.gitignore` :

```gitignore
# Dependencies
node_modules/

# Next.js
.next/
out/

# Env
.env
.env.local
.env.*.local

# OS
.DS_Store

# IDE
.idea/
.vscode/

# Legacy archive
esimplu_global/

# Prisma
prisma/migrations/**/migration_lock.toml
```

- [ ] **Step 6: Supprimer les anciens dossiers**

```bash
rm -rf web/
rm -rf packages/
rm -rf docker/
rm -f package-lock.json
```

- [ ] **Step 7: Supprimer les fichiers obsolètes**

```bash
rm -f lib/jwt.ts
rm -f lib/jwt.test.ts
rm -f public/vercel.svg public/file.svg public/globe.svg public/next.svg public/window.svg
```

- [ ] **Step 8: Installer les dépendances**

```bash
npm install
```

- [ ] **Step 9: Vérifier que le build passe**

```bash
npm run build
```

Résultat attendu : `✓ Compiled successfully`

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "refactor: flatten monorepo — move web/ to root, remove packages/"
```

---

## Task 2: Nettoyer les pages et le layout

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/marketplace/page.tsx`
- Modify: `app/delivery/page.tsx`
- Modify: `app/login/page.tsx`
- Create: `app/articles/page.tsx`
- Create: `app/services/page.tsx`
- Delete: `middleware.ts` (sera recréé dans Task 5)
- Modify: `types/index.ts`

- [ ] **Step 1: Mettre à jour le root layout**

Remplacer le contenu de `app/layout.tsx` :

```tsx
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "eSimplu",
  description: "Platforma pentru diaspora română și moldovenească în Europa",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ro"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Remplacer la page d'accueil**

Remplacer le contenu de `app/page.tsx` :

```tsx
export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold">eSimplu</h1>
      <p className="mt-4 text-lg text-zinc-600">
        Platforma pentru diaspora română și moldovenească în Europa
      </p>
    </main>
  )
}
```

- [ ] **Step 3: Créer les pages placeholder articles et services**

Créer `app/articles/page.tsx` :

```tsx
export default function ArticlesPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold">Articole</h1>
      <p className="mt-4 text-zinc-600">În curând</p>
    </main>
  )
}
```

Créer `app/services/page.tsx` :

```tsx
export default function ServicesPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold">Servicii</h1>
      <p className="mt-4 text-zinc-600">În curând</p>
    </main>
  )
}
```

- [ ] **Step 4: Mettre à jour les pages placeholder existantes**

Remplacer `app/marketplace/page.tsx` :

```tsx
export default function MarketplacePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold">Marketplace</h1>
      <p className="mt-4 text-zinc-600">În curând</p>
    </main>
  )
}
```

Remplacer `app/delivery/page.tsx` :

```tsx
export default function DeliveryPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold">Livrări</h1>
      <p className="mt-4 text-zinc-600">În curând</p>
    </main>
  )
}
```

Remplacer `app/login/page.tsx` :

```tsx
export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold">Conectare</h1>
      <p className="mt-4 text-zinc-600">În curând</p>
    </main>
  )
}
```

- [ ] **Step 5: Supprimer l'ancien middleware JWT**

```bash
rm -f middleware.ts
```

- [ ] **Step 6: Mettre à jour les types**

Remplacer le contenu de `types/index.ts` :

```typescript
// === Country ===

export type Country = "fr" | "de" | "it" | "uk"

export const COUNTRIES: { code: Country; name: string; flag: string }[] = [
  { code: "fr", name: "Franța", flag: "🇫🇷" },
  { code: "de", name: "Germania", flag: "🇩🇪" },
  { code: "it", name: "Italia", flag: "🇮🇹" },
  { code: "uk", name: "Marea Britanie", flag: "🇬🇧" },
]

// === Service ===

export type ServiceStatus = "PENDING" | "PUBLISHED" | "REJECTED"

// === Marketplace (Phase 2) ===

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"

export type Currency = "EUR" | "RON" | "MDL"

// === Delivery (Phase 3) ===

export type TripStatus = "open" | "full" | "completed" | "cancelled"

export type BookingStatus = "pending" | "confirmed" | "delivered"

export type Location = {
  city: string
  country: string
  address?: string
}
```

- [ ] **Step 7: Vérifier que le build passe**

```bash
npm run build
```

Résultat attendu : `✓ Compiled successfully`

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: clean up pages, update layout and types for new architecture"
```

---

## Task 3: Installer Prisma + PostgreSQL

**Files:**
- Create: `prisma/schema.prisma`
- Create: `lib/prisma.ts`
- Modify: `package.json` (add dependencies)

- [ ] **Step 1: Installer Prisma**

```bash
npm install prisma @prisma/client --save-dev
npm install @prisma/client
```

> Note : `prisma` est un devDependency (CLI), `@prisma/client` est une dependency (runtime).

- [ ] **Step 2: Initialiser Prisma**

```bash
npx prisma init --datasource-provider postgresql
```

Cela crée `prisma/schema.prisma` et ajoute `DATABASE_URL` dans `.env` (si existant).

- [ ] **Step 3: Écrire le schéma Prisma**

Remplacer le contenu de `prisma/schema.prisma` :

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// === Auth.js tables ===

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  services      ServiceListing[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([provider, providerAccountId])
}

model Session {
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@id([identifier, token])
}

// === Content ===

model Article {
  id         String   @id @default(cuid())
  title      String
  slug       String   @unique
  content    String
  excerpt    String?
  coverImage String?
  countries  String[]
  published  Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model ServiceCategory {
  id       String           @id @default(cuid())
  name     String
  slug     String           @unique
  services ServiceListing[]
}

model ServiceListing {
  id          String          @id @default(cuid())
  userId      String
  title       String
  categoryId  String
  description String
  languages   String[]
  city        String
  countries   String[]
  phone       String
  email       String
  whatsapp    String?
  photo       String?
  status      ServiceStatus   @default(PENDING)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  user     User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  category ServiceCategory @relation(fields: [categoryId], references: [id])
}

enum ServiceStatus {
  PENDING
  PUBLISHED
  REJECTED
}
```

- [ ] **Step 4: Créer le client Prisma singleton**

Créer `lib/prisma.ts` :

```typescript
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

- [ ] **Step 5: Créer le fichier .env.local**

Créer `.env.local` à la racine :

```env
DATABASE_URL=postgresql://esimplu:esimplu_local@localhost:5432/esimplu
```

- [ ] **Step 6: Lancer PostgreSQL et exécuter la migration**

```bash
docker compose up -d
npx prisma migrate dev --name init
```

Résultat attendu : `Your database is now in sync with your schema.`

- [ ] **Step 7: Vérifier avec Prisma Studio**

```bash
npx prisma studio
```

Ouvrir `http://localhost:5555` — les tables `User`, `Account`, `Session`, `VerificationToken`, `Article`, `ServiceCategory`, `ServiceListing` doivent être visibles.

Fermer Prisma Studio (Ctrl+C).

- [ ] **Step 8: Vérifier que le build passe**

```bash
npm run build
```

Résultat attendu : `✓ Compiled successfully`

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add Prisma schema with PostgreSQL (auth + articles + services)"
```

---

## Task 4: Installer et configurer Auth.js

**Files:**
- Create: `lib/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `middleware.ts`
- Modify: `package.json` (add dependencies)
- Modify: `app/login/page.tsx`

- [ ] **Step 1: Installer Auth.js et l'adapter Prisma**

```bash
npm install next-auth@beta @auth/prisma-adapter
```

> Note : Auth.js v5 est publié sous `next-auth@beta` pour Next.js App Router.

- [ ] **Step 2: Ajouter les variables Auth.js dans .env.local**

Ajouter à `.env.local` :

```env
AUTH_SECRET=dev_secret_change_in_production_minimum_32_chars
AUTH_GOOGLE_ID=placeholder
AUTH_GOOGLE_SECRET=placeholder
AUTH_FACEBOOK_ID=placeholder
AUTH_FACEBOOK_SECRET=placeholder
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> Les placeholders Google/Facebook seront remplacés quand les OAuth apps seront créées. Auth.js ne crashe pas avec des placeholders — les boutons ne fonctionneront juste pas.

- [ ] **Step 3: Créer la config Auth.js**

Créer `lib/auth.ts` :

```typescript
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Facebook,
  ],
  pages: {
    signIn: "/login",
  },
})
```

- [ ] **Step 4: Créer le route handler Auth.js**

Créer le dossier et le fichier :

```bash
mkdir -p app/api/auth/\[...nextauth\]
```

Créer `app/api/auth/[...nextauth]/route.ts` :

```typescript
import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
```

- [ ] **Step 5: Créer le middleware Auth.js**

Créer `middleware.ts` à la racine :

```typescript
export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
```

- [ ] **Step 6: Mettre à jour la page login**

Remplacer `app/login/page.tsx` :

```tsx
import { signIn } from "@/lib/auth"

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8 gap-4">
      <h1 className="text-3xl font-bold">Conectare</h1>
      <p className="text-zinc-600 mb-8">Conectați-vă cu contul dvs.</p>

      <form
        action={async () => {
          "use server"
          await signIn("google", { redirectTo: "/" })
        }}
      >
        <button
          type="submit"
          className="w-64 rounded-lg bg-white border border-zinc-300 px-4 py-3 text-sm font-medium hover:bg-zinc-50"
        >
          Continuați cu Google
        </button>
      </form>

      <form
        action={async () => {
          "use server"
          await signIn("facebook", { redirectTo: "/" })
        }}
      >
        <button
          type="submit"
          className="w-64 rounded-lg bg-[#1877F2] px-4 py-3 text-sm font-medium text-white hover:bg-[#166FE5]"
        >
          Continuați cu Facebook
        </button>
      </form>
    </main>
  )
}
```

- [ ] **Step 7: Vérifier que le build passe**

```bash
npm run build
```

Résultat attendu : `✓ Compiled successfully`

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add Auth.js with Google + Facebook providers"
```

---

## Task 5: Installer shadcn/ui

**Files:**
- Create: `components.json`
- Create: `components/ui/button.tsx` (premier composant)
- Modify: `app/globals.css`
- Modify: `package.json` (add dependencies)

- [ ] **Step 1: Initialiser shadcn/ui**

```bash
npx shadcn@latest init
```

Répondre aux questions :
- Style: `Default`
- Base color: `Zinc`
- CSS variables: `yes`

Cela crée `components.json` et met à jour `app/globals.css` et `tsconfig.json`.

- [ ] **Step 2: Installer le premier composant (Button)**

```bash
npx shadcn@latest add button
```

Cela crée `components/ui/button.tsx`.

- [ ] **Step 3: Installer les composants nécessaires pour le country selector**

```bash
npx shadcn@latest add dialog select
```

- [ ] **Step 4: Vérifier que le build passe**

```bash
npm run build
```

Résultat attendu : `✓ Compiled successfully`

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add shadcn/ui with button, dialog, and select components"
```

---

## Task 6: Country selector + modal première visite

**Files:**
- Create: `lib/countries.ts`
- Create: `components/country-modal.tsx`
- Create: `components/country-selector.tsx`
- Create: `components/providers.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Créer les constantes pays**

Créer `lib/countries.ts` :

```typescript
import type { Country } from "@/types"

export const COUNTRIES: { code: Country; name: string; flag: string }[] = [
  { code: "fr", name: "Franța", flag: "🇫🇷" },
  { code: "de", name: "Germania", flag: "🇩🇪" },
  { code: "it", name: "Italia", flag: "🇮🇹" },
  { code: "uk", name: "Marea Britanie", flag: "🇬🇧" },
]

export function getCountryName(code: Country): string {
  return COUNTRIES.find((c) => c.code === code)?.name ?? code
}

export function getCountryFlag(code: Country): string {
  return COUNTRIES.find((c) => c.code === code)?.flag ?? ""
}

export const COUNTRY_COOKIE = "country"
export const COUNTRY_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year
```

- [ ] **Step 2: Créer la modale de première visite**

Créer `components/country-modal.tsx` :

```tsx
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { COUNTRIES, COUNTRY_COOKIE, COUNTRY_COOKIE_MAX_AGE } from "@/lib/countries"
import type { Country } from "@/types"

export function CountryModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const hasCountry = document.cookie
      .split("; ")
      .some((c) => c.startsWith(`${COUNTRY_COOKIE}=`))
    if (!hasCountry) {
      setOpen(true)
    }
  }, [])

  function selectCountry(code: Country) {
    document.cookie = `${COUNTRY_COOKIE}=${code}; path=/; max-age=${COUNTRY_COOKIE_MAX_AGE}`
    setOpen(false)
    window.location.reload()
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Alegeți țara dvs.
          </DialogTitle>
        </DialogHeader>
        <p className="text-center text-sm text-zinc-500 mb-4">
          Pentru a vedea conținut specific regiunii dvs.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {COUNTRIES.map((country) => (
            <Button
              key={country.code}
              variant="outline"
              className="h-16 text-lg"
              onClick={() => selectCountry(country.code)}
            >
              {country.flag} {country.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 3: Créer le sélecteur de pays (header)**

Créer `components/country-selector.tsx` :

```tsx
"use client"

import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { COUNTRIES, COUNTRY_COOKIE, COUNTRY_COOKIE_MAX_AGE } from "@/lib/countries"
import type { Country } from "@/types"

export function CountrySelector() {
  const [country, setCountry] = useState<Country | null>(null)

  useEffect(() => {
    const match = document.cookie.match(new RegExp(`${COUNTRY_COOKIE}=([^;]+)`))
    if (match) {
      setCountry(match[1] as Country)
    }
  }, [])

  function handleChange(value: string) {
    const code = value as Country
    document.cookie = `${COUNTRY_COOKIE}=${code}; path=/; max-age=${COUNTRY_COOKIE_MAX_AGE}`
    setCountry(code)
    window.location.reload()
  }

  if (!country) return null

  const current = COUNTRIES.find((c) => c.code === country)

  return (
    <Select value={country} onValueChange={handleChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue>
          {current?.flag} {current?.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {COUNTRIES.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            {c.flag} {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

- [ ] **Step 4: Créer le composant Providers**

Créer `components/providers.tsx` :

```tsx
"use client"

import { SessionProvider } from "next-auth/react"
import { CountryModal } from "@/components/country-modal"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <CountryModal />
    </SessionProvider>
  )
}
```

- [ ] **Step 5: Mettre à jour le root layout pour inclure les providers et le header**

Remplacer `app/layout.tsx` :

```tsx
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { CountrySelector } from "@/components/country-selector"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "eSimplu",
  description: "Platforma pentru diaspora română și moldovenească în Europa",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ro"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <header className="flex items-center justify-between px-6 py-4 border-b">
            <a href="/" className="text-xl font-bold">
              eSimplu
            </a>
            <div className="flex items-center gap-4">
              <CountrySelector />
              <a
                href="/login"
                className="text-sm font-medium hover:underline"
              >
                Conectare
              </a>
            </div>
          </header>
          <div className="flex-1">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Vérifier que le build passe**

```bash
npm run build
```

Résultat attendu : `✓ Compiled successfully`

- [ ] **Step 7: Tester dans le navigateur**

```bash
npm run dev
```

Ouvrir `http://localhost:3000` :
1. La modale de choix de pays doit apparaître (4 boutons)
2. Cliquer sur un pays — la modale se ferme, le sélecteur dans le header affiche le pays choisi
3. Changer de pays via le sélecteur — la page recharge avec le nouveau pays
4. Recharger la page — la modale ne réapparaît pas (cookie existant)

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add country selector modal and header component"
```

---

## Task 7: Mettre à jour le GitHub Actions deploy

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1: Mettre à jour le workflow**

Remplacer le contenu de `.github/workflows/deploy.yml` :

```yaml
name: Deploy to VPS

on:
  push:
    branches:
      - main
    paths-ignore:
      - 'docs/**'
      - '*.md'
      - 'docker-compose.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/esimplu
            git pull origin main
            npm install --omit=dev
            npx prisma migrate deploy
            npm run build
            pm2 restart esimplu-web
```

> Changements : plus de `--workspace=web`, ajout de `prisma migrate deploy` avant le build.

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: update deploy workflow for flat project structure"
```

---

## Task 8: Mettre à jour .env.example

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Vérifier le contenu de .env.example**

Le fichier doit contenir :

```env
# Database
DATABASE_URL=postgresql://esimplu:esimplu_local@localhost:5432/esimplu

# Auth.js
AUTH_SECRET=          # Generate with: npx auth secret
AUTH_GOOGLE_ID=       # Google OAuth client ID
AUTH_GOOGLE_SECRET=   # Google OAuth client secret
AUTH_FACEBOOK_ID=     # Facebook app ID
AUTH_FACEBOOK_SECRET= # Facebook app secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Si le contenu est déjà à jour (il devrait l'être), passer à l'étape suivante. Sinon, le mettre à jour.

- [ ] **Step 2: Commit (si modifié)**

```bash
git add .env.example
git commit -m "chore: update .env.example for new architecture"
```

---

## Vérification finale

- [ ] `docker compose up -d` → PostgreSQL démarre
- [ ] `npm run build` → compile sans erreur
- [ ] `npm run dev` → app accessible sur `http://localhost:3000`
- [ ] Modale de choix de pays apparaît à la première visite
- [ ] Sélecteur de pays dans le header fonctionne
- [ ] Page `/login` affiche les boutons Google et Facebook
- [ ] Page `/articles` affiche le placeholder
- [ ] Page `/services` affiche le placeholder
- [ ] Page `/marketplace` affiche le placeholder
- [ ] Page `/delivery` affiche le placeholder
- [ ] `npx prisma studio` → toutes les tables visibles
- [ ] Plus de dossier `web/` ni `packages/`
- [ ] Plus de fichiers WordPress (`jwt.ts`, `uploads.ini`, etc.)

---

## Prochaine étape

Plan B — Pages de contenu : articles (liste + détail), services (répertoire + formulaire soumission), landing page.
