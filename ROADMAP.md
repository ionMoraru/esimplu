# Roadmap eSimplu

> Source de vérité pour le suivi du projet. Mise à jour à chaque merge dans `main`.
> Dernière mise à jour : 2026-05-05 (admin import API : services / vendeurs / produits / livreurs / trajets via Bearer token)

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
- [x] Reset password (PR #26) — `/forgot-password` + `/reset-password/[token]`, modèle `PasswordResetToken`, envoi via Resend si `RESEND_API_KEY` set sinon log console. Pas de rate-limit.
- [x] Filtre pays par défaut depuis cookie `country` sur `/articles` et `/services` (PR #24)
- [x] Claim flow polymorphe (PR #28, anciennement #25) — modèle `Invitation` (targetType SERVICE | TRIP | PRODUCT), route générique `/claim/[token]`. Côté services : remplace `/services/claim/[token]`, drop des colonnes claim de `ServiceListing`, `ServiceStatus` simplifié à `PENDING|REJECTED`. Cron `/api/admin/purge-expired-drafts` réécrit pour expirer les invitations.
- [x] Pages institutionnelles redesign — `/despre` (hero, stats, pillars, values, steps), `/cum-functioneaza` (sectioned design), `/contact`, `/confidentialitate`, `/termeni`
- [x] Foundation RGPD — pages légales conformes + claim invitation sur les cards de services (`feat/rgpd-foundation`)
- [x] Navbar — lien "Despre" desktop + sheet mobile, dropdown utilisateur avec logout
- [ ] Auth Facebook — en attente vérification identité Meta (bloqué)
- [ ] Route RGPD `/api/auth/facebook/delete` — à faire quand Facebook OK

## Phase 2 — Marketplace

MVP « première vente » fonctionnel bout en bout (Lots 1–9 du plan, 6 PRs mergées). Stripe (Lot 11) intégré ; Resend (Lot 10) reste à activer pleinement en prod.

- [x] UI listing marketplace + recherche (DB-first depuis PR #18 — fini le mock public)
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
- [x] Marketplace public listing sur DB + security hardening H1-H4 (PR #18)
- [x] Stripe Checkout + webhook + admin seller editor (PR #16, Lot 11)
- [x] Self-service registration vendeur + livreur (PR #17)
- [ ] Resend pour emails réels (Lot 10) — abstraction prête, mode console pour l'instant (utilisé déjà par reset password si clé set)
- [ ] Variantes produit (tailles, déclinaisons) — workaround : 1 produit = 1 variante
- [ ] Panier multi-produits — MVP = 1 commande = 1 produit, 1 vendeur

## Phase 3 — Delivery

MVP point-à-point fonctionnel. Plateforme de mise en relation : transporteurs publient des trajets, clients réservent (passagers OU colis), email au transporteur, validation manuelle, coordonnées partagées au client après acceptation. eSimplu ne perçoit aucune commission et n'intervient pas dans le paiement.

- [x] Modèles Prisma + migration `add_delivery_models` — `Trip` (vehicleType, capacités passagers/colis, prix indicatifs, status `DRAFT/PUBLISHED/FULL/DEPARTED/COMPLETED/CANCELLED`), `Booking` (`PASSENGER|PARCEL`, status `PENDING/CONFIRMED/REJECTED/CANCELLED`) (PR #19)
- [x] Services métier `lib/services/trips.ts` + `lib/services/bookings.ts` (validation, state machine, doublons, capacité) (PR #19)
- [x] API routes publiques + courier (`/api/delivery/trips`, `/api/delivery/bookings`, accept/reject/cancel) (PR #19)
- [x] UI publication de trajets + recherche + détail trip + booking (PR #19)
- [x] Filtres ville départ/arrivée + date (index Prisma `(originCity, destinationCity, departureDate)`) (PR #19)
- [x] Landing `/transporteurs` pour acquisition légale des transporteurs (PR #20)
- [x] i18n roumain pour pages publiques delivery + emails + messages (PR #22)

## Phase 4 — Espace utilisateur unifié

Page « Mon compte » qui agrège tout ce que l'utilisateur peut publier sur la plateforme. Un même compte peut être prestataire de service ET vendeur ET transporteur — pas de profil distinct par rôle.

- [ ] Page `/dashboard` — dashboard unifié (services + produits + trajets)
- [ ] Section « Mes services » — liste des `ServiceListing` du user, avec édition / dépublier
- [ ] Action contextuelle sur les services de catégorie `transport` / `mutari-transport` / `livrare` : bouton « Propune o cursă » qui ouvre le formulaire de création `Trip` (lien Service → Trip via le user, pas de FK directe)
- [ ] Section « Mele produits » — onboarding `SellerProfile` (slug, IBAN, etc.) puis liste `Product` avec création / édition
- [ ] Section « Mele trajets » — liste `Trip` du user avec création directe
- [ ] Permissions : un service ne nécessite pas `SellerProfile` ; un produit le nécessite ; un trajet nécessite un `CourierProfile` (à créer si absent au moment de la première publication, comme le pattern existant)

---

## Infra & DevOps

- [x] VPS OVH configuré (Caddy + Node 22 + PM2 + PostgreSQL 17)
- [x] DNS OVH (A records @ et www)
- [x] HTTPS automatique via Caddy
- [x] Auth Google OAuth configuré et fonctionnel
- [x] Corriger `deploy.yml` — chemins et nom PM2
- [x] GitHub Secrets configurés (`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`) — CI/CD auto actif
- [x] Postinstall hook : `prisma generate` automatique au `npm install`
- [x] Scripts `db:seed` et `db:reset` (npm), avec `db:seed` qui marche sur VPS sans `.env.local`
- [ ] Redirection `esimplu.fr` → `esimplu.com`

## Outils admin / contenu

- [x] **Admin Import API** (`/api/admin/import/*`, doc `docs/import-api.md`) — 5 endpoints (`service`, `seller`, `product`, `courier`, `trip`) protégés par Bearer token (`ADMIN_IMPORT_TOKEN`, comparaison constant-time). Idempotents par clé naturelle (titre+ville+pays pour service, email pour seller/courier, sellerSlug+nom pour product, courier+villes+date pour trip). Audit complet via modèle `ImportLog` (SHA-256 du payload, IP, status). `seller`/`courier` génèrent un `claimUrl` 30 jours pour que la personne pose son mot de passe via `/reset-password/<token>`.
- [ ] Workflow articles Markdown — `content/articles/*.md` + `npm run content:sync` lancé en CI après build (à venir, demande utilisateur du 2026-05-05)
- [ ] Snapshot prod → local anonymisé — pour développer contre des données proches de la réalité sans copier de PII (RGPD)

---

## Branches actives

| Branche | Description | Statut |
|---|---|---|
| `main` | Production | Stable |
