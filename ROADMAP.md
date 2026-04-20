# Roadmap eSimplu

> Source de vérité pour le suivi du projet. Mise à jour à chaque merge dans `main`.
> Dernière mise à jour : 2026-04-20

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
- [x] Installer shadcn/ui (button, dialog, select)
- [x] Country selector + modale première visite
- [x] Mettre à jour GitHub Actions deploy
- [x] Docs onboarding + mock data pour dev junior

## Phase 1.5 — Auth & contenu

- [ ] **Auth email/password + page inscription** — branche `feat/login` (en cours)
- [ ] Auth Facebook — en attente vérification identité Meta (bloqué)
- [ ] Route RGPD `/api/auth/facebook/delete` — à faire quand Facebook OK
- [ ] Landing page (design + contenu)
- [ ] Page articles (liste + détail avec mock data)
- [ ] Page services (répertoire + formulaire soumission avec mock data)

## Phase 2 — Marketplace

- [ ] Design spec marketplace (tables Seller, Product, Order)
- [ ] Interface vendeur
- [ ] Interface acheteur
- [ ] Filtrage par pays de livraison

## Phase 3 — Delivery

- [ ] Design spec delivery (tables Carrier, Trip, Booking)
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
- [ ] Configurer les GitHub Secrets (VPS_HOST, VPS_USER, VPS_SSH_KEY) pour CI/CD auto
- [ ] Redirection `esimplu.fr` → `esimplu.com`

---

## Branches actives

| Branche | Description | Statut |
|---|---|---|
| `main` | Production | Stable |
| `feat/login` | Auth email/password + inscription | En cours |
