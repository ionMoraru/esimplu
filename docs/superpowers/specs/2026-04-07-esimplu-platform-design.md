# eSimplu — Design Spec Plateforme

**Date :** 2026-04-07
**Statut :** Approuvé

---

## Contexte

Site d'annonces et d'articles existant dédié à la diaspora roumaine/moldave en France, hébergé sur OVH avec WordPress classique (thème payant). Le projet évolue vers une plateforme multi-pays avec deux nouveaux modules : une marketplace producteurs ↔ diaspora et une plateforme de livraison point A → point B.

**Données clés :**
- 90% du traffic est mobile
- Contenu totalement distinct par pays
- Comptes utilisateurs globaux avec profil localisé (un login, plusieurs pays)
- 4 pays cibles : France, Allemagne, Italie, Angleterre

---

## Architecture globale

```
Cloudflare (esimplu.com)
├── /fr/*           → proxy WordPress Multisite FR (OVH)
├── /de/*           → proxy WordPress Multisite DE (OVH)
├── /it/*           → proxy WordPress Multisite IT (OVH)
├── /uk/*           → proxy WordPress Multisite UK (OVH)
├── /marketplace    → Next.js (OVH VPS)
└── /delivery       → Next.js (OVH VPS)
```

Tout hébergé sur OVH : WordPress Multisite + Next.js + PostgreSQL sur un VPS OVH.

---

## Structure du monorepo

```
esimplu/
├── wordpress/              → thème custom + plugins maison uniquement
│   ├── themes/esimplu/
│   └── plugins/
├── web/                    → Next.js App Router
│   ├── app/
│   │   ├── [locale]/       → pages annonces/articles (proxy WP)
│   │   ├── marketplace/    → marketplace producteurs
│   │   └── delivery/       → plateforme livreurs
│   ├── components/
│   └── lib/
├── packages/
│   └── types/              → types TypeScript partagés
└── docs/
    └── superpowers/specs/
```

> Le dossier `wordpress/` contient uniquement le thème et les plugins custom — pas l'installation WP complète.

---

## Stratégie domaine & routing

**Domaine unique `esimplu.com`** via Cloudflare comme routeur central.

- Cloudflare détecte le pays via l'IP et redirige automatiquement vers la locale correspondante (`esimplu.com` → `esimplu.com/fr`)
- L'utilisateur peut changer de locale manuellement via un sélecteur
- `esimplu.com/fr`, `/de`, `/it`, `/uk` pointent vers les sites WordPress Multisite correspondants via Cloudflare Proxy Rules
- `esimplu.com/marketplace` et `esimplu.com/delivery` pointent vers le serveur Next.js

**Pourquoi `/fr` et non `fr.esimplu.com` :** les sous-domaines fragmentent l'autorité SEO. Un seul domaine cumule tout le référencement.

---

## WordPress Multisite

- Une seule installation WordPress sur OVH
- Un site par pays dans le réseau Multisite (FR, DE, IT, UK)
- Contenu totalement distinct entre les sites (annonces, articles, événements)
- Le thème payant actuel est adapté pour fonctionner en Multisite
- Chaque site a sa propre langue, sa propre base d'annonces

---

## Authentification — WP JWT

**Principe :** WordPress reste le serveur d'authentification. Un token JWT est généré à la connexion et partagé entre WP et Next.js.

**Plugin :** `JWT Authentication for WP REST API` (gratuit)

```
Utilisateur se connecte sur WP
        ↓
WP génère un JWT (signé avec clé secrète)
        ↓
JWT stocké côté client (cookie httpOnly)
        ↓
Next.js valide le JWT sur chaque requête API
        ↓
Accès autorisé à marketplace + delivery
```

**Sessions mobile :** tokens JWT longue durée (30 jours) pour éviter les reconnexions fréquentes.

**Migration utilisateurs existants :**
- Export des emails depuis `wp_users`
- Envoi d'un email de réinitialisation de mot de passe
- Aucune migration de hash de mot de passe nécessaire

### Modèle utilisateur

```typescript
type User = {
  id: string               // WP user ID
  email: string
  locales: Locale[]        // pays actifs : ["fr", "de"]
  roles: Role[]            // ["reader", "seller", "buyer", "carrier"]
}

type Locale = "fr" | "de" | "it" | "uk"
type Role = "reader" | "seller" | "buyer" | "carrier"
```

Un utilisateur peut cumuler plusieurs rôles (ex: acheteur ET livreur).

---

## Base de données

**Deux bases distinctes :**

| Base | Technologie | Contenu |
|---|---|---|
| WP MySQL | MySQL OVH (existant) | Articles, annonces, utilisateurs WP |
| App PostgreSQL | PostgreSQL OVH VPS | Marketplace, livraisons, commandes |

Aucune donnée marketplace ou livreurs ne va dans la BDD WordPress. Séparation stricte des responsabilités.

---

## Module 1 — Marketplace producteurs ↔ diaspora (`/marketplace`)

**Principe :** Les producteurs roumains/moldaves publient leurs produits. La diaspora en Europe commande. Le filtrage se fait par pays de livraison (pas de contenu distinct par pays — un producteur peut livrer dans plusieurs pays).

### Modèle de données (PostgreSQL)

```typescript
type Seller = {
  userId: string           // WP user ID
  businessName: string
  country: "ro" | "md"
  deliveriesTo: Locale[]   // pays où il livre
  description: string
  verified: boolean
}

type Product = {
  id: string
  sellerId: string
  name: string
  description: string
  price: number
  currency: "EUR" | "RON" | "MDL"
  category: string
  attributes: Record<string, unknown>  // schéma flexible par catégorie
  availableIn: Locale[]   // filtrage par pays de livraison
  stock: number
  images: string[]
}

type Order = {
  id: string
  buyerId: string
  sellerId: string
  items: OrderItem[]
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  deliveryLocale: Locale
  createdAt: Date
}
```

---

## Module 2 — Plateforme livreurs (`/delivery`)

**Principe :** Les livreurs font des trajets entre deux points en Europe (Moldova/Roumanie ↔ pays de la diaspora). Ils publient leur trajet avec capacité disponible. Les utilisateurs réservent de l'espace pour envoyer des colis. Aucune locale imposée — l'utilisateur choisit départ et arrivée librement.

### Modèle de données (PostgreSQL)

```typescript
type Carrier = {
  userId: string           // WP user ID
  name: string
  phone: string
  vehicleType: string
  rating: number
}

type Trip = {
  id: string
  carrierId: string
  origin: Location
  destination: Location
  departureDate: Date
  arrivalDate: Date
  availableCapacity: number   // kg
  pricePerKg: number
  currency: "EUR" | "RON" | "MDL"
  status: "open" | "full" | "completed" | "cancelled"
}

type Booking = {
  id: string
  tripId: string
  userId: string
  weight: number
  description: string
  status: "pending" | "confirmed" | "delivered"
  createdAt: Date
}

type Location = {
  city: string
  country: string
  address?: string
}
```

---

## Mobile-first & PWA

- Toutes les pages Next.js conçues en 375px d'abord
- Configuration PWA via `next-pwa` : installable sur écran d'accueil, cache offline
- Images optimisées via `next/image`
- API Routes Next.js RESTful pour consommation future par React Native

---

## Infrastructure & Coûts

| Service | Usage | Coût/mois |
|---|---|---|
| OVH VPS | WP Multisite + Next.js + PostgreSQL | ~6–15 € |
| Cloudflare | DNS + CDN + Proxy Rules + Geo-detection | 0 € |
| Domaine esimplu.com | Renouvellement annuel | ~1 €/mois |
| **Total estimé** | | **~7–16 €/mois** |

---

## Phases de développement

### Phase 1 — Fondations multi-pays
- Activation WordPress Multisite (FR, DE, IT, UK) sur OVH existant
- Configuration Cloudflare routing (`/fr`, `/de`, `/it`, `/uk`)
- Geo-detection automatique via Cloudflare
- Installation WP JWT Auth plugin
- Init monorepo `esimplu/` avec structure décrite

### Phase 2 — Marketplace (`/marketplace`)
- Next.js App Router avec pages marketplace
- PostgreSQL sur OVH VPS — tables `sellers`, `products`, `orders`
- Interface mobile-first pour parcourir et commander
- Interface vendeur pour publier des produits
- Filtrage par pays de livraison

### Phase 3 — Plateforme livreurs (`/delivery`)
- Pages Next.js delivery
- PostgreSQL — tables `carriers`, `trips`, `bookings`
- Recherche de trajets par départ/arrivée
- Interface livreur pour publier des trajets
- Interface utilisateur pour réserver

### Phase 4 — PWA & API React Native
- Configuration next-pwa
- Audit et documentation des API Routes pour React Native
- Optimisations performance mobile (Core Web Vitals)

---

## Décisions techniques actées

| Décision | Choix | Raison |
|---|---|---|
| Framework frontend | Next.js (pas TanStack Start) | Maturité, SEO, ecosystem PWA |
| Auth | WP JWT (pas Clerk, pas Supabase Auth) | Gratuit, zéro migration |
| BDD nouvelles features | PostgreSQL self-hosted OVH | Contrôle total, coût minimal |
| Routing multi-pays | Cloudflare Proxy (`/fr`) | SEO unifié vs subdomains |
| Hébergement | OVH VPS | Infra existante, pas de migration |
| Monorepo | Un seul repo pour WP + Next.js | Simplicité opérationnelle |
