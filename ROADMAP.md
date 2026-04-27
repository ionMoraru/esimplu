# Roadmap eSimplu

> Source de vérité pour le suivi du projet. Mise à jour à chaque merge dans `main`.
> Dernière mise à jour : 2026-04-27 (post marketplace MVP)

## Légende

- [x] Terminé (mergé dans `main`)
- [ ] **En cours** — branche indiquée
- [ ] À faire

---

## Phase 1 — Fondations (restructuration)

- [x] Flatten monorepo — supprimer `web/` et `packages/`, un seul `package.json`
- [x] Nettoyer pages et layout (placeholders articles, services, marketplace, delivery)
- [x] Installer Prisma + PostgreSQL (schema auth + articles + services)
- [x] Installer et configurer Auth.js (Google + Facebook providers)
- [x] Installer shadcn/ui (button, dialog, select, avatar, badge, separator, sheet, skeleton)
- [x] Country selector + modale première visite
- [x] Mettre à jour GitHub Actions deploy
- [x] Docs onboarding + mock data pour dev junior

## Phase 1.5 — Auth & contenu

- [x] Auth email/password + page inscription
- [x] Landing page (hero slider, sections grid, design tokens)
- [x] Header + Footer (composants layout)
- [x] Design system — composants partagés (`components/shared/{cards,forms,navigation}`)
- [x] Page articles (liste + détail dynamique avec mock data)
- [x] Page services (répertoire avec filtres catégorie/pays)
- [x] Formulaire soumission service (`/services/new` avec validation)
- [x] Page `/design` — showcase du design system
- [ ] Auth Facebook — en attente vérification identité Meta (bloqué)
- [ ] Route RGPD `/api/auth/facebook/delete` — à faire quand Facebook OK

## Phase 2 — Marketplace

MVP « première vente » fonctionnel bout en bout (Lots 1–9 du plan, 6 PRs mergées). Stripe et Resend (Lots 10–11) restent à activer pour la production.

- [x] UI listing marketplace + recherche (mock data — **listing public toujours en mock**, à brancher quand l'associé sera dispo)
- [x] UI détail produit (DB-first, fallback mock)
- [x] UI page producteur (story + grille produits)
- [x] Spec design + plan d'implémentation (`docs/superpowers/specs|plans/2026-04-27-marketplace-mvp*`)
- [x] Modèles Prisma + migration (`SellerProfile`, `CourierProfile`, `Product`, `Order`, `OrderItem`, `OrderEvent`, enums `UserRole` + `OrderStatus`)
- [x] Services métier (`lib/services/orders|products|payment|email`) avec state machine + audit trail
- [x] API routes (18) — public, seller, courier, admin
- [x] Dashboard vendeur (création produit, édition, liste commandes)
- [x] Dashboard livreur (Pris en charge / Livré, double validation avec client)
- [x] Dashboard admin (approve seller/courier, mark-paid, assign-courier, settle)
- [x] Checkout customer (formulaire + provider abstraction `mock` / `manual` / `stripe`)
- [x] Page de suivi client `/orders/[id]` avec confirmation de réception
- [x] Filtrage par pays de livraison (`countriesAvailable[]`)
- [ ] Stripe Connect / Stripe Checkout réel (Lot 11) — abstraction prête
- [ ] Resend pour emails réels (Lot 10) — abstraction prête, mode console pour l'instant
- [ ] Variantes produit (tailles, déclinaisons) — workaround : 1 produit = 1 variante
- [ ] Panier multi-produits — MVP = 1 commande = 1 produit, 1 vendeur

## Phase 3 — Delivery

- [ ] Design spec delivery (tables Carrier, Trip, Booking)
- [ ] Modèles Prisma + migrations
- [ ] Publication de trajets
- [ ] Réservation
- [ ] Filtres par ville départ/arrivée

---

## Infra & DevOps

- [x] VPS OVH configuré (Caddy + Node 22 + PM2 + PostgreSQL 17)
- [x] DNS OVH (A records @ et www)
- [x] HTTPS automatique via Caddy
- [x] Auth Google OAuth configuré et fonctionnel
- [x] Corriger `deploy.yml` — chemins et nom PM2
- [x] GitHub Secrets configurés (`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`) — CI/CD auto actif
- [x] Postinstall hook : `prisma generate` automatique au `npm install`
- [ ] Redirection `esimplu.fr` → `esimplu.com`

---

## Branches actives

| Branche | Description | Statut |
|---|---|---|
| `main` | Production | Stable |
