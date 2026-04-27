# Roadmap eSimplu

> Source de vérité pour le suivi du projet. Mise à jour à chaque merge dans `main`.
> Dernière mise à jour : 2026-04-27

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

UI partiellement implémentée en mock data ; backend (modèles, API, persistance) reste à faire.

- [x] UI listing marketplace + recherche
- [x] UI détail produit
- [x] UI page producteur (story + grille produits)
- [ ] Design spec marketplace (tables Seller, Product, Order)
- [ ] Modèles Prisma + migrations (Seller, Product, Order)
- [ ] Interface vendeur (création produits, gestion commandes)
- [ ] Interface acheteur (panier, checkout)
- [ ] Filtrage par pays de livraison (`deliveriesTo[]`)

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
