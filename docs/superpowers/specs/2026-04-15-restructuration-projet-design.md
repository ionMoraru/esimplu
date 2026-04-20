# Restructuration Projet eSimplu — Design Spec

**Date :** 2026-04-15
**Statut :** Approuvé
**Remplace :** `2026-04-07-esimplu-platform-design.md`, `2026-04-14-architecture-headless-design.md`

---

## Contexte

L'architecture du projet a évolué à travers plusieurs itérations :
1. WordPress front + Next.js pour marketplace/delivery
2. WordPress headless + Next.js pour tout le front
3. **Final : Next.js uniquement** — plus de WordPress

Le contenu (articles) sera généré par IA. Les utilisateurs s'authentifient via Google/Facebook. PostgreSQL remplace MySQL. Le pays n'est plus dans l'URL — l'utilisateur le choisit via un sélecteur.

---

## Stack technique

| Composant | Technologie |
|---|---|
| Front + API | Next.js (App Router) |
| UI | shadcn/ui + Tailwind CSS |
| Auth | Auth.js (NextAuth) — Google, Facebook |
| ORM | Prisma |
| Base de données | PostgreSQL 17 |
| Hébergement | VPS-1 OVH (Ubuntu 25.04, Allemagne) |
| Reverse proxy / SSL | Caddy 2 (HTTPS auto via Let's Encrypt) |
| DNS | OVH (A records → VPS) |
| Process manager | PM2 |
| CI/CD | GitHub Actions (SSH deploy) |

---

## Architecture

```
DNS OVH (esimplu.com)
└── VPS OVH (57.129.122.163)
    └── Caddy (HTTPS auto)
        └── Next.js (port 3000, PM2)
              ├── App Router (pages publiques)
              ├── API Routes (CRUD)
              ├── Auth.js (Google, Facebook, email/password)
              └── Prisma → PostgreSQL 17
```

Un seul service, une seule base, une seule app. Caddy gère le reverse proxy et le HTTPS automatiquement.

---

## Structure du projet

```
esimplu/
├── package.json
├── next.config.ts
├── docker-compose.yml                ← PostgreSQL (dev local)
├── .github/workflows/deploy.yml      ← CI/CD
├── middleware.ts                      ← Auth.js middleware
├── app/
│   ├── layout.tsx                    ← Root layout + providers
│   ├── page.tsx                      ← Landing page
│   ├── articles/
│   │   ├── page.tsx                  ← Liste articles (filtré par pays)
│   │   └── [slug]/page.tsx           ← Article détail
│   ├── services/
│   │   ├── page.tsx                  ← Répertoire services (filtré par pays)
│   │   └── proposer/page.tsx         ← Formulaire soumission
│   ├── marketplace/
│   │   └── page.tsx                  ← Phase 2
│   ├── delivery/
│   │   └── page.tsx                  ← Phase 3
│   ├── login/page.tsx                ← Page connexion
│   └── api/
│       └── auth/[...nextauth]/route.ts
├── components/
│   ├── ui/                           ← shadcn/ui
│   ├── country-selector.tsx          ← Sélecteur de pays (header)
│   └── country-modal.tsx             ← Modale première visite
├── lib/
│   ├── prisma.ts                     ← Client Prisma singleton
│   ├── auth.ts                       ← Config Auth.js
│   └── countries.ts                  ← Constantes pays + helpers
├── prisma/
│   └── schema.prisma                 ← Schéma BDD
└── types/
    └── index.ts                      ← Types partagés
```

> **Plus de monorepo / workspaces.** Le contenu de `web/` est remonté à la racine. `packages/types/` devient `types/`. Un seul `package.json`.

---

## Sélection du pays

**Pas de pays dans l'URL.** Le pays est un filtre côté données.

### Première visite
- Pas de cookie `country` détecté
- Modale plein écran : "Choisissez votre pays pour voir du contenu spécifique"
- 4 choix : France, Allemagne, Italie, Royaume-Uni
- Le choix est stocké dans un cookie `country` (durée : 1 an)
- La modale ne réapparaît plus

### Visites suivantes
- Le cookie `country` est lu
- Le sélecteur de pays dans le header affiche le pays actif
- L'utilisateur peut changer de pays à tout moment via le sélecteur
- Changer de pays met à jour le cookie et recharge le contenu filtré

### Filtrage par pays

| Module | Comportement |
|---|---|
| Articles | `countries[]` contient le pays sélectionné |
| Services | `countries[]` contient le pays sélectionné |
| Marketplace | `deliveriesTo[]` du vendeur contient le pays sélectionné |
| Delivery | Pas de filtre auto — l'utilisateur filtre par ville départ/arrivée |

### Liens partageables
- `?country=fr` en query param force le pays affiché (override le cookie)

---

## Authentification — Auth.js

### Providers
- Google
- Facebook

### Flow
1. L'utilisateur clique "Se connecter" (header ou page login)
2. Auth.js redirige vers Google/Facebook
3. Retour → session créée, cookie de session
4. L'utilisateur est connecté sur toute l'app

### Pages protégées
- `/services/proposer` — formulaire accessible à tous, mais soumission nécessite d'être connecté
- `/marketplace` — connexion requise (Phase 2)
- `/delivery` — connexion requise (Phase 3)

### Adapter Prisma
Auth.js crée automatiquement les tables : `User`, `Account`, `Session`, `VerificationToken`.

---

## Schéma base de données (Prisma)

### Tables Auth.js (auto-générées)

```
User
├── id            String @id
├── name          String?
├── email         String? @unique
├── emailVerified DateTime?
├── image         String?
├── accounts      Account[]
├── sessions      Session[]

Account (providers Google/Facebook)
├── userId, provider, providerAccountId...

Session
├── sessionToken, userId, expires...
```

### Tables contenu

```
Article
├── id            String @id @default(cuid())
├── title         String
├── slug          String @unique
├── content       String (HTML)
├── excerpt       String?
├── coverImage    String?
├── countries     String[] (ex: ["fr", "de"])
├── published     Boolean @default(false)
├── createdAt     DateTime @default(now())
├── updatedAt     DateTime @updatedAt

ServiceCategory
├── id            String @id @default(cuid())
├── name          String
├── slug          String @unique

ServiceListing
├── id            String @id @default(cuid())
├── userId        String → User
├── title         String
├── categoryId    String → ServiceCategory
├── description   String
├── languages     String[] (ex: ["ro", "ru", "fr"])
├── city          String
├── countries     String[] (ex: ["fr"] ou ["fr", "de", "it", "uk"])
├── phone         String
├── email         String
├── whatsapp      String?
├── photo         String?
├── status        Enum: PENDING, PUBLISHED, REJECTED
├── createdAt     DateTime @default(now())
├── updatedAt     DateTime @updatedAt
```

### Tables marketplace (Phase 2)

```
Seller
├── id, userId, businessName, country, deliveriesTo[], description, verified

Product
├── id, sellerId, name, description, price, currency, category
├── attributes (Json), availableIn[], stock, images[]

Order
├── id, buyerId, sellerId, items[], status, deliveryCountry, createdAt

OrderItem
├── id, orderId, productId, quantity, unitPrice
```

### Tables delivery (Phase 3)

```
Carrier
├── id, userId, name, phone, vehicleType, rating

Trip
├── id, carrierId, origin (Json), destination (Json)
├── departureDate, arrivalDate, availableCapacity, pricePerKg
├── currency, status

Booking
├── id, tripId, userId, weight, description, status, createdAt
```

---

## Docker Compose (dev local)

```yaml
services:
  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_DB: esimplu
      POSTGRES_USER: esimplu
      POSTGRES_PASSWORD: esimplu_local
    volumes:
      - esimplu_db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  esimplu_db_data:
```

Next.js tourne en natif (`npm run dev`). Pour inspecter la base : `npx prisma studio`.

---

## Variables d'environnement

```env
# Base de données
DATABASE_URL=postgresql://esimplu:esimplu_local@localhost:5432/esimplu

# Auth.js
AUTH_SECRET=<random_secret>
AUTH_GOOGLE_ID=<google_client_id>
AUTH_GOOGLE_SECRET=<google_client_secret>
AUTH_FACEBOOK_ID=<facebook_app_id>
AUTH_FACEBOOK_SECRET=<facebook_app_secret>

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Fichiers à supprimer

| Fichier | Raison |
|---|---|
| `web/` | Dossier entier — contenu remonté à la racine |
| `packages/` | Dossier workspace — supprimé, types déplacés dans `types/` |
| `docker/wordpress/uploads.ini` | Plus de WordPress |

**Fichiers supprimés lors de la remontée (ne pas recréer) :**
- `lib/jwt.ts` — plus de JWT custom, Auth.js gère les sessions
- `lib/jwt.test.ts` — tests associés
- `middleware.ts` — sera réécrit pour Auth.js
- `public/vercel.svg`, `file.svg`, `globe.svg`, `next.svg`, `window.svg` — assets boilerplate

---

## Fichiers à modifier

| Fichier | Changement |
|---|---|
| `docker-compose.yml` | Remplacer WordPress + MySQL par PostgreSQL |
| `package.json` | Retirer workspaces, merger les dépendances, retirer `jose`, ajouter `next-auth`, `@auth/prisma-adapter`, `prisma`, `@prisma/client` |
| `app/layout.tsx` | Metadata eSimplu, `lang="ro"`, providers (session, country) |
| `.env.example` | Variables PostgreSQL + Auth.js |
| `types/index.ts` | Retirer `WpJwtPayload`, adapter les types |
| `.gitignore` | Retirer les entrées WordPress, adapter les chemins (plus de `web/`) |

---

## Ce qui ne change PAS

- Repo Git + GitHub privé
- VPS OVH (même serveur)
- Caddy en reverse proxy (HTTPS auto)
- GitHub privé + GitHub Actions CI/CD
- PM2 pour le process management
- Tailwind CSS (déjà installé)
- Domaine `esimplu.com`
- Redirection `esimplu.fr` → `esimplu.com`
- 4 pays cibles : France, Allemagne, Italie, Royaume-Uni
- Langue interface : roumain par défaut

---

## Phases de développement

### Phase 1 — Fondations (ce spec)
- Restructurer le projet (supprimer WordPress, installer Auth.js, Prisma, PostgreSQL)
- Installer shadcn/ui
- Sélecteur de pays + modale première visite
- Page articles (liste + détail) — contenu généré par IA
- Page services (répertoire + formulaire soumission)
- Auth Google + Facebook
- Déploiement VPS

### Phase 2 — Marketplace
- Module marketplace type Crowdfarming
- Tables Seller, Product, Order
- Interface vendeur + interface acheteur
- Filtrage par pays de livraison

### Phase 3 — Delivery
- Module delivery (covoiturage colis)
- Tables Carrier, Trip, Booking
- Publication de trajets + réservation
- Filtres par ville départ/arrivée
