# Phase 1 — Fondations Multi-Pays — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Poser les fondations du monorepo, scaffolder l'app Next.js, configurer WordPress Multisite sur OVH, activer JWT Auth, et router le traffic via Cloudflare.

**Architecture:** WordPress Multisite (OVH) sert le contenu FR/DE/IT/UK via des chemins `/fr`, `/de`, etc. proxifiés par Cloudflare. Next.js (OVH VPS) gère `/marketplace` et `/delivery`. Un JWT signé par WordPress valide les sessions dans Next.js.

**Tech Stack:** Next.js 14 (App Router, TypeScript), `jose` (JWT edge-compatible), Tailwind CSS, WordPress Multisite + plugin JWT Authentication for WP REST API, Cloudflare (Proxy Rules + Transform Rules).

---

## Structure des fichiers créés / modifiés

```
esimplu/                          ← racine du monorepo
├── package.json                  ← workspaces config
├── .gitignore
├── .env.example
├── packages/
│   └── types/
│       ├── package.json
│       └── index.ts              ← types partagés : User, Locale, Role, etc.
├── web/                          ← app Next.js
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── middleware.ts             ← validation JWT sur routes protégées
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx             ← redirect vers /fr par défaut
│   │   ├── marketplace/
│   │   │   └── page.tsx         ← placeholder Phase 2
│   │   └── delivery/
│   │       └── page.tsx         ← placeholder Phase 3
│   └── lib/
│       └── jwt.ts               ← helper vérification JWT
└── wordpress/
    └── themes/
        └── esimplu/             ← copie du thème actuel (à faire manuellement)
```

---

## Task 1: Init monorepo

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `.env.example`

- [ ] **Step 1: Créer le `package.json` racine avec workspaces**

```json
{
  "name": "esimplu",
  "private": true,
  "workspaces": [
    "web",
    "packages/*"
  ],
  "scripts": {
    "dev": "npm run dev --workspace=web",
    "build": "npm run build --workspace=web",
    "lint": "npm run lint --workspace=web"
  },
  "engines": {
    "node": ">=20"
  }
}
```

- [ ] **Step 2: Créer `.gitignore`**

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Next.js
web/.next/
web/out/

# Env
.env
.env.local
.env.*.local

# OS
.DS_Store

# IDE
.idea/
.vscode/

# WordPress uploads (ne pas versionner les médias)
wordpress/uploads/
```

- [ ] **Step 3: Créer `.env.example`**

```env
# Clé secrète JWT — doit correspondre exactement à JWT_AUTH_SECRET_KEY dans wp-config.php
JWT_SECRET_KEY=change_me_to_a_random_64char_string

# URL de l'API WordPress (site principal FR)
NEXT_PUBLIC_WP_API_URL=https://esimplu.com/fr/wp-json
```

- [ ] **Step 4: Commit**

```bash
git add package.json .gitignore .env.example
git commit -m "chore: init monorepo structure"
```

---

## Task 2: Package de types partagés

**Files:**
- Create: `packages/types/package.json`
- Create: `packages/types/index.ts`

- [ ] **Step 1: Créer `packages/types/package.json`**

```json
{
  "name": "@esimplu/types",
  "version": "0.0.1",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts"
}
```

- [ ] **Step 2: Créer `packages/types/index.ts`**

```typescript
export type Locale = "fr" | "de" | "it" | "uk"

export type Role = "reader" | "seller" | "buyer" | "carrier"

export type User = {
  id: string         // WP user ID (numérique sous forme de string)
  email: string
  displayName: string
  locales: Locale[]  // pays où l'utilisateur est actif
  roles: Role[]      // rôles cumulables
}

export type Seller = {
  userId: string
  businessName: string
  country: "ro" | "md"
  deliveriesTo: Locale[]
  description: string
  verified: boolean
}

export type Product = {
  id: string
  sellerId: string
  name: string
  description: string
  price: number
  currency: "EUR" | "RON" | "MDL"
  category: string
  attributes: Record<string, unknown>
  availableIn: Locale[]
  stock: number
  images: string[]
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"

export type OrderItem = {
  productId: string
  quantity: number
  unitPrice: number
}

export type Order = {
  id: string
  buyerId: string
  sellerId: string
  items: OrderItem[]
  status: OrderStatus
  deliveryLocale: Locale
  createdAt: Date
}

export type Carrier = {
  userId: string
  name: string
  phone: string
  vehicleType: string
  rating: number
}

export type Location = {
  city: string
  country: string
  address?: string
}

export type TripStatus = "open" | "full" | "completed" | "cancelled"

export type Trip = {
  id: string
  carrierId: string
  origin: Location
  destination: Location
  departureDate: Date
  arrivalDate: Date
  availableCapacity: number  // kg
  pricePerKg: number
  currency: "EUR" | "RON" | "MDL"
  status: TripStatus
}

export type BookingStatus = "pending" | "confirmed" | "delivered"

export type Booking = {
  id: string
  tripId: string
  userId: string
  weight: number
  description: string
  status: BookingStatus
  createdAt: Date
}

// Payload décodé du JWT WordPress
export type WpJwtPayload = {
  iss: string   // URL du site WP
  iat: number   // issued at (timestamp)
  nbf: number   // not before
  exp: number   // expiration
  data: {
    user: {
      id: string
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add packages/
git commit -m "feat: add shared types package"
```

---

## Task 3: Scaffolding Next.js

**Files:**
- Create: `web/` (via create-next-app)

- [ ] **Step 1: Créer l'app Next.js**

Depuis la racine du monorepo :

```bash
npx create-next-app@latest web \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*"
```

Répondre `No` à "Would you like to use Turbopack" (compatibilité PWA plus stable sans).

- [ ] **Step 2: Ajouter la dépendance aux types partagés dans `web/package.json`**

Ouvrir `web/package.json` et ajouter dans `dependencies` :

```json
{
  "dependencies": {
    "@esimplu/types": "*",
    "jose": "^5.9.6"
  }
}
```

- [ ] **Step 3: Installer les dépendances**

```bash
npm install
```

Vérifier que `web/node_modules/@esimplu/types` existe (symlink workspace).

- [ ] **Step 4: Vérifier que le build passe**

```bash
npm run build --workspace=web
```

Résultat attendu : `✓ Compiled successfully`

- [ ] **Step 5: Commit**

```bash
git add web/
git commit -m "feat: scaffold Next.js app"
```

---

## Task 4: Helper JWT + middleware de protection des routes

**Files:**
- Create: `web/lib/jwt.ts`
- Create: `web/middleware.ts`
- Test: via `curl` (pas de test framework dans ce task — voir Task 5)

- [ ] **Step 1: Créer `web/lib/jwt.ts`**

```typescript
import { jwtVerify } from "jose"
import type { WpJwtPayload } from "@esimplu/types"

const getSecret = () => {
  const key = process.env.JWT_SECRET_KEY
  if (!key) throw new Error("JWT_SECRET_KEY is not set")
  return new TextEncoder().encode(key)
}

export async function verifyWpJwt(token: string): Promise<WpJwtPayload> {
  const { payload } = await jwtVerify(token, getSecret(), {
    algorithms: ["HS256"],
  })
  return payload as unknown as WpJwtPayload
}

export function extractJwtFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(/wp_jwt=([^;]+)/)
  return match ? match[1] : null
}
```

- [ ] **Step 2: Créer `web/middleware.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server"
import { verifyWpJwt } from "@/lib/jwt"

const PROTECTED_PATHS = ["/marketplace", "/delivery"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))

  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get("wp_jwt")?.value

  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    await verifyWpJwt(token)
    return NextResponse.next()
  } catch {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ["/marketplace/:path*", "/delivery/:path*"],
}
```

- [ ] **Step 3: Créer les pages placeholder**

`web/app/marketplace/page.tsx` :
```typescript
export default function MarketplacePage() {
  return <main><h1>Marketplace — Coming Soon</h1></main>
}
```

`web/app/delivery/page.tsx` :
```typescript
export default function DeliveryPage() {
  return <main><h1>Delivery — Coming Soon</h1></main>
}
```

`web/app/login/page.tsx` :
```typescript
export default function LoginPage() {
  return <main><h1>Login</h1></main>
}
```

- [ ] **Step 4: Vérifier que le build passe**

```bash
npm run build --workspace=web
```

Résultat attendu : `✓ Compiled successfully`

- [ ] **Step 5: Commit**

```bash
git add web/lib/jwt.ts web/middleware.ts web/app/
git commit -m "feat: add JWT middleware for protected routes"
```

---

## Task 5: Tests du helper JWT

**Files:**
- Create: `web/lib/jwt.test.ts`

- [ ] **Step 1: Installer Jest + ts-jest**

```bash
npm install --save-dev jest ts-jest @types/jest --workspace=web
```

- [ ] **Step 2: Créer `web/jest.config.ts`**

```typescript
import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@esimplu/types$": "<rootDir>/../packages/types/index.ts",
  },
}

export default config
```

- [ ] **Step 3: Ajouter le script test dans `web/package.json`**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

- [ ] **Step 4: Écrire le test**

Créer `web/lib/jwt.test.ts` :

```typescript
import { SignJWT } from "jose"
import { verifyWpJwt, extractJwtFromCookie } from "./jwt"

const SECRET = "test_secret_key_minimum_32_characters_long_ok"

beforeAll(() => {
  process.env.JWT_SECRET_KEY = SECRET
})

async function signTestToken(overrides: Record<string, unknown> = {}) {
  const payload = {
    iss: "https://esimplu.com",
    iat: Math.floor(Date.now() / 1000),
    nbf: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    data: { user: { id: "42" } },
    ...overrides,
  }
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(SECRET))
}

describe("verifyWpJwt", () => {
  it("retourne le payload pour un token valide", async () => {
    const token = await signTestToken()
    const payload = await verifyWpJwt(token)
    expect(payload.data.user.id).toBe("42")
  })

  it("rejette un token signé avec une mauvaise clé", async () => {
    const badToken = await new SignJWT({ data: { user: { id: "1" } } })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode("wrong_secret_key_minimum_32_chars"))
    await expect(verifyWpJwt(badToken)).rejects.toThrow()
  })

  it("rejette un token expiré", async () => {
    const token = await signTestToken({ exp: Math.floor(Date.now() / 1000) - 1 })
    await expect(verifyWpJwt(token)).rejects.toThrow()
  })
})

describe("extractJwtFromCookie", () => {
  it("extrait le token depuis un header cookie", () => {
    const token = extractJwtFromCookie("wp_jwt=abc123; other=val")
    expect(token).toBe("abc123")
  })

  it("retourne null si wp_jwt absent", () => {
    expect(extractJwtFromCookie("session=xyz")).toBeNull()
    expect(extractJwtFromCookie(null)).toBeNull()
  })
})
```

- [ ] **Step 5: Lancer les tests pour vérifier qu'ils passent**

```bash
npm test --workspace=web
```

Résultat attendu :
```
PASS  lib/jwt.test.ts
  verifyWpJwt
    ✓ retourne le payload pour un token valide
    ✓ rejette un token signé avec une mauvaise clé
    ✓ rejette un token expiré
  extractJwtFromCookie
    ✓ extrait le token depuis un header cookie
    ✓ retourne null si wp_jwt absent
```

- [ ] **Step 6: Commit**

```bash
git add web/lib/jwt.test.ts web/jest.config.ts web/package.json
git commit -m "test: add JWT helper unit tests"
```

---

## Task 6: WordPress Multisite — activation (manuel, OVH)

> Ces étapes sont à effectuer sur le serveur OVH via SSH ou l'interface WP.

**Files (sur le serveur OVH) :**
- Modify: `wp-config.php`
- Modify: `.htaccess`

- [ ] **Step 1: Se connecter au serveur OVH en SSH**

```bash
ssh user@votre-vps.ovh.net
cd /var/www/html  # ou le chemin de votre WP
```

- [ ] **Step 2: Ajouter dans `wp-config.php` avant `/* That's all, stop editing! */`**

```php
/* Multisite */
define( 'WP_ALLOW_MULTISITE', true );
```

- [ ] **Step 3: Aller dans WP Admin → Outils → Configuration du réseau**

- Choisir **Sous-répertoires** (pas sous-domaines) — pour avoir `/fr`, `/de` etc.
- Nom du réseau : `eSimplu`
- Email : votre email admin
- Cliquer "Installer"

- [ ] **Step 4: WP Admin affiche deux blocs de code à copier**

Copier les lignes indiquées dans `wp-config.php` (ressemblent à ceci) :

```php
define( 'MULTISITE', true );
define( 'SUBDOMAIN_INSTALL', false );
define( 'DOMAIN_CURRENT_SITE', 'esimplu.com' );
define( 'PATH_CURRENT_SITE', '/' );
define( 'SITE_ID_CURRENT_SITE', 1 );
define( 'BLOG_ID_CURRENT_SITE', 1 );
```

Copier les lignes indiquées dans `.htaccess` (remplace le contenu existant).

- [ ] **Step 5: Vérifier que le réseau WP est actif**

Aller sur `https://esimplu.com/wp-admin/network/` — la page "Tableau de bord du réseau" doit s'afficher.

- [ ] **Step 6: Créer les 3 nouveaux sites dans le réseau**

Dans WP Admin Réseau → Sites → Ajouter :
- Path: `/de` — Titre: `eSimplu Deutschland` — Email: admin@esimplu.com
- Path: `/it` — Titre: `eSimplu Italia` — Email: admin@esimplu.com
- Path: `/uk` — Titre: `eSimplu UK` — Email: admin@esimplu.com

Le site FR existant est déjà le site principal (path `/`).

- [ ] **Step 7: Vérifier que les 4 sites sont accessibles**

```bash
curl -I https://esimplu.com/fr/
curl -I https://esimplu.com/de/
curl -I https://esimplu.com/it/
curl -I https://esimplu.com/uk/
```

Chaque commande doit retourner `HTTP/2 200`.

---

## Task 7: WordPress JWT Auth — configuration (manuel, OVH)

> Ces étapes sont à effectuer sur le serveur OVH.

**Files (sur le serveur OVH) :**
- Modify: `wp-config.php`
- Action: installation du plugin via WP Admin

- [ ] **Step 1: Ajouter dans `wp-config.php` la clé secrète JWT**

Générer une clé aléatoire :
```bash
openssl rand -base64 48
```

Copier le résultat et l'ajouter dans `wp-config.php` :
```php
define( 'JWT_AUTH_SECRET_KEY', 'COLLER_LA_CLE_GENEREE_ICI' );
define( 'JWT_AUTH_CORS_ENABLE', true );
```

Cette valeur **doit être identique** à `JWT_SECRET_KEY` dans le `.env` du projet Next.js.

- [ ] **Step 2: Installer le plugin via WP Admin**

WP Admin Réseau → Plugins → Ajouter
Rechercher : `JWT Authentication for WP REST API`
Auteur : Enrique Chavez
Cliquer **Installer** puis **Activer sur le réseau** (activer sur tous les sites).

- [ ] **Step 3: Tester que l'endpoint JWT fonctionne**

```bash
curl -X POST https://esimplu.com/fr/wp-json/jwt-auth/v1/token \
  -H "Content-Type: application/json" \
  -d '{"username": "votre_user_wp", "password": "votre_mdp_wp"}'
```

Résultat attendu (JSON avec token) :
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user_email": "user@esimplu.com",
  "user_nicename": "user",
  "user_display_name": "User Name"
}
```

- [ ] **Step 4: Vérifier la validation du token**

```bash
TOKEN="eyJ0eXAiOiJKV1Qi..."  # token obtenu à l'étape précédente
curl -X POST https://esimplu.com/fr/wp-json/jwt-auth/v1/token/validate \
  -H "Authorization: Bearer $TOKEN"
```

Résultat attendu :
```json
{
  "code": "jwt_auth_valid_token",
  "data": { "status": 200 }
}
```

---

## Task 8: Copier le thème WP dans le monorepo

> Étape locale — depuis votre machine.

**Files:**
- Create: `wordpress/themes/esimplu/` (copie du thème existant)

- [ ] **Step 1: Copier le thème depuis l'ancien dossier vers le monorepo**

```bash
# Adapter le chemin selon l'emplacement de votre WP actuel
cp -r /chemin/vers/ancien-projet/wp-content/themes/nom-du-theme \
      /Users/ionmoraru/Documents/CLAUDE/Projects/esimplu/wordpress/themes/esimplu
```

- [ ] **Step 2: Vérifier la structure**

```bash
ls wordpress/themes/esimplu/
```

Doit contenir au minimum : `style.css`, `functions.php`, et les fichiers du thème.

- [ ] **Step 3: Commit**

```bash
git add wordpress/
git commit -m "chore: add WP theme to monorepo"
```

---

## Task 9: Configuration Cloudflare (manuel, dashboard)

> Ces étapes sont à effectuer sur https://dash.cloudflare.com

**Prérequis :** Le domaine `esimplu.com` doit être géré par Cloudflare (nameservers OVH → Cloudflare).

- [ ] **Step 1: Configurer les DNS**

Dans Cloudflare → DNS → Records :
- Type A, Name `esimplu.com`, IP de votre VPS OVH, **Proxy activé** (nuage orange)
- Type A, Name `www`, même IP, Proxy activé

- [ ] **Step 2: Créer la règle de redirection geo-detection**

Dans Cloudflare → Rules → Transform Rules → URL Rewrite :

Nom : `Geo-detection redirect`
Condition :
```
(http.request.uri.path eq "/") and 
(not http.cookie contains "locale_override") and
(ip.geoip.country in {"FR" "MC"})
```
Action : Redirect to `https://esimplu.com/fr`

Répéter pour chaque pays :
- `ip.geoip.country in {"DE" "AT" "CH"}` → redirect vers `/de`
- `ip.geoip.country in {"IT"}` → redirect vers `/it`
- `ip.geoip.country in {"GB"}` → redirect vers `/uk`

Ordre des règles : FR, DE, IT, UK (la dernière sans condition = fallback `/fr`).

- [ ] **Step 3: Créer la règle de réécriture URL pour `/fr`**

Le site WP principal (FR) est à la racine `/` sur le serveur. Cloudflare doit strip le préfixe `/fr` avant de transmettre à WP.

Dans Cloudflare → Rules → Transform Rules → URL Rewrite :

Nom : `Strip /fr prefix for WP main site`
Condition :
```
(http.request.uri.path starts_with "/fr")
```
Action : Rewrite path → `concat("/", substring(http.request.uri.path, 4))`

Les sites `/de`, `/it`, `/uk` n'ont pas besoin de cette règle — WP Multisite les sert directement à ces chemins.

- [ ] **Step 4: Créer la règle Proxy pour Next.js**

Dans Cloudflare → Rules → Origin Rules :

Nom : `Route Next.js apps`
Condition :
```
(http.request.uri.path starts_with "/marketplace") or
(http.request.uri.path starts_with "/delivery")
```
Action : Set origin → IP du VPS OVH + port 3000

- [ ] **Step 5: Tester la geo-detection depuis la France**

```bash
curl -I https://esimplu.com/
```

Résultat attendu (depuis IP française) : `HTTP/2 302` avec `Location: https://esimplu.com/fr`

- [ ] **Step 6: Tester que le sélecteur de locale override la geo-detection**

Le cookie `locale_override` doit court-circuiter la geo-detection. On testera cela dans la Phase 2 lors du développement du sélecteur de locale dans Next.js.

---

## Task 10: Déployer Next.js sur OVH VPS

**Files:**
- Create: `web/.env.local` (sur le serveur, ne pas committer)

- [ ] **Step 1: Se connecter au VPS OVH et installer Node.js 20**

```bash
ssh user@votre-vps.ovh.net
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # doit afficher v20.x.x
```

- [ ] **Step 2: Installer PM2 pour garder Next.js actif**

```bash
sudo npm install -g pm2
```

- [ ] **Step 3: Cloner le repo sur le VPS**

```bash
git clone https://github.com/VOTRE_USER/esimplu.git /var/www/esimplu
cd /var/www/esimplu
npm install
```

- [ ] **Step 4: Créer `.env.local` sur le serveur**

```bash
cat > /var/www/esimplu/web/.env.local << 'EOF'
JWT_SECRET_KEY=MEME_CLE_QUE_DANS_WP_CONFIG
NEXT_PUBLIC_WP_API_URL=https://esimplu.com/fr/wp-json
EOF
```

- [ ] **Step 5: Builder et démarrer Next.js avec PM2**

```bash
cd /var/www/esimplu
npm run build --workspace=web
pm2 start "npm run start --workspace=web" --name esimplu-web -- -p 3000
pm2 save
pm2 startup  # copier-coller la commande affichée pour démarrage auto
```

- [ ] **Step 6: Vérifier que Next.js répond**

```bash
curl -I http://localhost:3000
```

Résultat attendu : `HTTP/1.1 200 OK`

- [ ] **Step 7: Vérifier que Cloudflare route bien vers Next.js**

```bash
curl -I https://esimplu.com/marketplace
```

Résultat attendu : `HTTP/2 200` (page placeholder "Coming Soon")

---

## Vérification finale Phase 1

- [ ] `https://esimplu.com/fr` → site WP FR accessible
- [ ] `https://esimplu.com/de` → site WP DE accessible
- [ ] `https://esimplu.com/it` → site WP IT accessible
- [ ] `https://esimplu.com/uk` → site WP UK accessible
- [ ] `https://esimplu.com/marketplace` → page Next.js "Coming Soon"
- [ ] `https://esimplu.com/delivery` → page Next.js "Coming Soon"
- [ ] Geo-detection redirige vers la bonne locale
- [ ] Endpoint JWT WP retourne un token valide
- [ ] `npm test --workspace=web` passe en vert
- [ ] `npm run build --workspace=web` compile sans erreur

---

## Prochaine étape

Une fois la Phase 1 validée → créer `docs/superpowers/plans/2026-XX-XX-phase2-marketplace.md`
