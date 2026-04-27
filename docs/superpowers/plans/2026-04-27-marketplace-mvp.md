# Plan d'implémentation — Marketplace MVP

> **Spec :** `docs/superpowers/specs/2026-04-27-marketplace-mvp-design.md`
> **Mode :** MVP « première vente », sans Stripe pour l'instant.
> **Date :** 2026-04-27

## Découpage en lots (PRs)

L'implémentation est découpée en lots livrables et testables indépendamment. Chaque lot = 1 PR.

### Lot 1 — Spec & plan (cette PR)
*Documentation uniquement. Permet de cadrer avant de coder.*

- [x] Spec design (`docs/superpowers/specs/...`)
- [x] Plan d'implémentation (ce fichier)

### Lot 2 — Modèles de données

Fondations en base de données. Aucune UI ni route, juste les tables et le typage.

- [x] `prisma/schema.prisma` :
  - Enum `UserRole` (CUSTOMER, SELLER, COURIER, ADMIN)
  - Enum `OrderStatus`
  - Enum `Country` (FR, DE, IT, UK) — promote du type TS vers enum DB
  - Champ `role` sur `User`
  - Modèles `SellerProfile`, `CourierProfile`
  - Modèles `Product`, `Order`, `OrderItem`, `OrderEvent`
  - Indexes pertinents (sur `customerId`, `sellerId`, `courierId`, `status`)
- [x] Migration SQL `20260427150000_marketplace_mvp_models` (validée localement)
- [x] `npx prisma generate` (via postinstall)

**Critère de complétion :** `npm run build` passe, le client Prisma expose les nouveaux modèles.

### Lot 3 — Services applicatifs (couche métier)

Avant les API routes, on isole la logique métier dans `lib/services/` pour qu'elle soit testable et réutilisable.

- [x] `lib/services/orders.ts` : state machine complète + audit trail
- [x] `lib/services/products.ts`
- [x] `lib/services/payment.ts` : `MockPaymentProvider` + `ManualPaymentProvider`
- [x] `lib/services/email.ts` : `ConsoleEmailService` + 5 templates FR
- [x] `lib/auth/roles.ts` : helpers + erreurs typées

**Critère de complétion :** services exportés, `npm run build` passe. ✅

### Lot 4 — API routes

Couche HTTP au-dessus des services. Erreurs gérées via `lib/api/respond.ts`.

- [x] Routes `/api/products/...`
- [x] Routes `/api/orders/...`
- [x] Routes `/api/seller/...`
- [x] Routes `/api/courier/...`
- [x] Routes `/api/admin/...`
- [x] `/api/payments/mock-confirm` (mode mock)
- [x] `/api/admin/orders/[id]/mark-paid` (mode manual)
- [ ] Webhook signé Stripe — Lot 11

**Critère de complétion :** chaque route protégée par auth + role check, `npm run build` passe. ✅

### Lot 5 — Dashboard Seller

- [x] `/dashboard/seller` — liste de mes produits
- [x] `/dashboard/seller/products/new` — formulaire création
- [x] `/dashboard/seller/products/[id]/edit`
- [x] `/dashboard/seller/orders` — liste commandes
- [x] Server-side guard `requireSellerSession()` (redirige si non-eligible)

**Critère de complétion :** un user `SELLER` approuvé peut créer un produit qui apparaît en DB. ✅

### Lot 6 — Brancher la marketplace publique sur la DB

- [x] `app/marketplace/[id]/page.tsx` : DB-first lookup, fallback sur mock data si pas trouvé en DB
- [ ] `app/marketplace/page.tsx` (listing) — toujours en mock data, **laissé à l'associé** qui travaille dessus
- [ ] `app/marketplace/producer/[slug]/page.tsx` — non modifié

**Critère de complétion partielle :** un produit publié par un seller est accessible et achetable directement via son URL `/marketplace/[id]`. Le listing public reste en mock data pour ne pas marcher sur le travail de l'associé.

### Lot 7 — Checkout customer

- [x] `/marketplace/[id]/checkout` — formulaire de commande
- [x] Création de l'`Order` en DB statut `PENDING_PAYMENT`
- [x] Redirection vers `PaymentProvider.createCheckout(order).url`
- [x] `/marketplace/mock-payment/[id]` (mode mock)
- [x] `/marketplace/order-confirmation/[id]` (mode manual)

**Critère de complétion :** un visiteur peut passer commande, l'admin la voit en DB. ✅

### Lot 8 — Suivi client + dashboard courier

- [x] `/orders/[id]` — timeline + bouton « J'ai bien reçu » sur `COURIER_DELIVERED`
- [x] `/dashboard/courier` — commandes en cours + archives, boutons « Pris en charge » et « Livré »
- [x] Emails (mode console) à chaque transition

**Critère de complétion :** une commande peut passer de `PAID` à `DELIVERED` via les actions courier + customer. ✅

### Lot 9 — Dashboard admin

- [x] `/dashboard/admin` — hub avec 5 compteurs
- [x] `/dashboard/admin/sellers` — liste + approve
- [x] `/dashboard/admin/couriers` — liste + approve
- [x] `/dashboard/admin/orders` — filtre par statut + 3 actions (mark-paid / assign-courier / settle)
- [x] Server-side guard `requireAdminSession()`

**Critère de complétion :** toi en tant qu'admin tu peux faire tourner une commande de bout en bout. ✅

### Lot 10 — Email réel via Resend (optionnel pour la 1ʳᵉ vente)

- [ ] Implémentation `ResendEmailService`
- [ ] Templates HTML + texte
- [ ] Activation via env var `RESEND_API_KEY`
- [ ] Documentation pour configurer le domaine d'envoi

**Critère de complétion :** les emails arrivent vraiment dans la boîte du destinataire.

### Lot 11 — Stripe (post-1ʳᵉ vente)

Hors périmètre 1ʳᵉ vente — à activer quand le compte Stripe est validé.

- [ ] Implémentation `StripeProvider`
- [ ] Webhook signé
- [ ] Plus tard : Stripe Connect pour split auto

## Ordre d'exécution recommandé

```
Lot 1 (docs) → Lot 2 (modèles) → Lot 3 (services) → Lot 4 (API)
                                          ↘
                                            Lot 5 (seller) → Lot 6 (marketplace branchée)
                                                                  ↘
                                                                    Lot 7 (checkout)
                                                                         ↓
                                                              Lot 8 (suivi + courier)
                                                                         ↓
                                                                   Lot 9 (admin)
                                                                         ↓
                                                          Lot 10 (Resend) — optionnel
                                                                         ↓
                                                          Lot 11 (Stripe) — post 1ʳᵉ vente
```

## Risques identifiés

| Risque | Impact | Mitigation |
|---|---|---|
| Migration Prisma casse en prod | High | Tester à fond en local, et lancer la migration manuellement la 1ʳᵉ fois sur le VPS au lieu de laisser le CI le faire |
| Pas de gestion images native (S3/Cloudinary) | Medium | MVP : URL externe (Imgur, etc.) collée par le seller. À fixer tôt. |
| Validation conjointe livreur+client peut bloquer | Medium | Auto-confirm client après 7 jours si courier a validé |
| Email non envoyé (mode console) | High pour 1ʳᵉ vente | Tu suis manuellement les logs, ou on active Resend dès Lot 10 |
| Pas d'authentification courier au début | Low | Courier est un User normal avec role `COURIER` créé par admin |

## Estimation grossière

| Lot | Effort |
|---|---|
| 1 — Docs | ~1h (fait) |
| 2 — Modèles | 2-3h |
| 3 — Services | 4-6h |
| 4 — API | 4-6h |
| 5 — Seller dashboard | 4-6h |
| 6 — Marketplace branchée | 2-3h |
| 7 — Checkout | 4-6h |
| 8 — Suivi + Courier | 4-6h |
| 9 — Admin | 3-4h |
| 10 — Resend (optionnel) | 2-3h |
| 11 — Stripe (post-1ʳᵉ vente) | 4-6h |

**Total MVP « 1ʳᵉ vente » (Lots 1-9) : ~30-40h de dev concentré.**

## Comment ce plan évolue

À chaque lot terminé : MAJ du status `[x]` ici + commit. Si une décision architecturale change en cours de route, MAJ de la spec et note dans `OrderEvent` ou commentaire de migration.
