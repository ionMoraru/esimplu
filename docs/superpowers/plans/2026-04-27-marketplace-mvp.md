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

- [ ] `prisma/schema.prisma` :
  - Enum `UserRole` (CUSTOMER, SELLER, COURIER, ADMIN)
  - Enum `OrderStatus`
  - Enum `Country` (FR, DE, IT, UK) — promote du type TS vers enum DB
  - Champ `role` sur `User`
  - Modèles `SellerProfile`, `CourierProfile`
  - Modèles `Product`, `Order`, `OrderItem`, `OrderEvent`
  - Indexes pertinents (sur `customerId`, `sellerId`, `courierId`, `status`)
- [ ] `npx prisma migrate dev --name marketplace_mvp` (génère la migration)
- [ ] `npx prisma generate` (déjà via postinstall)
- [ ] Types partagés dans `types/` si nécessaire

**Critère de complétion :** `npm run build` passe, le client Prisma expose les nouveaux modèles.

### Lot 3 — Services applicatifs (couche métier)

Avant les API routes, on isole la logique métier dans `lib/services/` pour qu'elle soit testable et réutilisable.

- [ ] `lib/services/orders.ts` : `createOrder`, `markPaid`, `handover`, `confirmDelivery`, `settleOrder`, `getOrderForUser`
- [ ] `lib/services/products.ts` : `createProduct`, `updateProduct`, `listProducts`, `getProduct`
- [ ] `lib/services/payment.ts` : interface `PaymentProvider` + `MockPaymentProvider` + `ManualPaymentProvider`
- [ ] `lib/services/email.ts` : interface `EmailService` + `ConsoleEmailService` + templates statiques (string-templated)
- [ ] `lib/auth/roles.ts` : helpers `requireRole(role)`, `getCurrentUser()`, `assertSellerOwns(productId)`...

**Critère de complétion :** services exportés, `npm run build` passe.

### Lot 4 — API routes

Couche HTTP au-dessus des services. Validation des entrées (Zod ou similaire).

- [ ] Routes `/api/products/...`
- [ ] Routes `/api/orders/...`
- [ ] Routes `/api/seller/...`
- [ ] Routes `/api/courier/...`
- [ ] Routes `/api/admin/...`
- [ ] Webhook paiement `/api/payments/webhook` (no-op pour mock/manual, prêt pour Stripe)

**Critère de complétion :** chaque route protégée par auth + role check, `npm run build` passe.

### Lot 5 — Dashboard Seller

UI minimale pour qu'un vendeur publie ses produits.

- [ ] `/dashboard/seller` — liste de mes produits
- [ ] `/dashboard/seller/products/new` — formulaire création (nom, description, prix, image URL externe, pays disponibles)
- [ ] `/dashboard/seller/products/[id]/edit`
- [ ] `/dashboard/seller/orders` — liste commandes
- [ ] Middleware Next.js pour bloquer l'accès si pas `SELLER` ou pas `approved`

**Critère de complétion :** un user `SELLER` approuvé peut créer un produit qui apparaît en DB.

### Lot 6 — Brancher la marketplace publique sur la DB

Remplacement progressif des mock data par les vraies données.

- [ ] `app/marketplace/page.tsx` : `getServerSideProducts({ country })` → vraie liste
- [ ] `app/marketplace/[id]/page.tsx` : `getProduct(id)`
- [ ] `app/marketplace/producer/[slug]/page.tsx` : `getSeller(slug)` (slug = `displayName` lowercased)
- [ ] Garder les mock data en fallback de dev (ex. si DB vide)

**Critère de complétion :** la marketplace affiche les produits saisis via le dashboard seller, filtrés par cookie pays.

### Lot 7 — Checkout customer

Le flux qui transforme un visiteur en commande.

- [ ] `/marketplace/[id]/checkout` — formulaire de commande (nom, email, tel, adresse, ville, notes)
- [ ] Création de l'`Order` en DB statut `PENDING_PAYMENT`
- [ ] Redirection vers le `PaymentProvider.createCheckout(order)`
- [ ] Mode mock : redirige vers `/marketplace/mock-payment/[orderId]` qui marque payé
- [ ] Mode manual : redirige vers `/marketplace/order-confirmation/[id]` avec instructions virement
- [ ] Page `/marketplace/order-confirmation/[id]` : récap commande

**Critère de complétion :** un visiteur peut passer commande, l'admin la voit en DB.

### Lot 8 — Suivi client + dashboard courier

Le flux de validation conjointe.

- [ ] `/orders/[id]` — page de suivi client : timeline des événements + bouton « J'ai bien reçu ma commande » (visible quand statut = `COURIER_DELIVERED`)
- [ ] `/dashboard/courier` — liste commandes assignées au courier connecté + 2 boutons par ordre :
  - « Pris en charge » (visible si statut = `PAID`)
  - « Livré » (visible si statut = `HANDED_OVER`)
- [ ] Emails déclenchés à chaque transition de statut (au minimum loggés en console)

**Critère de complétion :** une commande peut passer de `PAID` à `DELIVERED` via les actions courier + customer.

### Lot 9 — Dashboard admin

Outils opérateurs pour gérer le MVP avant l'auto.

- [ ] `/dashboard/admin/sellers` — liste + approve
- [ ] `/dashboard/admin/couriers` — liste + approve
- [ ] `/dashboard/admin/orders` — toutes les commandes + actions :
  - Marquer paiement reçu (manual mode)
  - Assigner un courier
  - Libérer l'escrow → `SETTLED`
- [ ] Garde middleware : `role === 'ADMIN'`

**Critère de complétion :** toi en tant qu'admin tu peux faire tourner une commande de bout en bout.

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
