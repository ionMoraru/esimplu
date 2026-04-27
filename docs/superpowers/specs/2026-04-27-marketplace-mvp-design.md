# Spec — Marketplace MVP (« première vente »)

> **Statut :** Brouillon initial — 2026-04-27
> **Auteurs :** Ion Morarou + Claude (assistant IA)
> **Objectif :** Permettre la **toute première vente complète** sur eSimplu (vendeur → client → livreur → règlement) avec un périmètre minimal mais bout en bout.

## 1. Contexte

eSimplu doit pouvoir réaliser une première vente avec :
- Un vendeur qui publie un produit
- Un client qui commande et paie en ligne
- Un livreur qui prend en charge et livre
- Une plateforme (toi) qui détient l'argent en escrow puis le reverse au vendeur (moins commission)

À terme :
- Les livreurs sont **recommandés automatiquement** par le module Delivery selon proximité géographique
- Variantes produit riches (taille, déclinaison, sur commande)
- Stripe Connect avec split automatique
- Module Delivery complet (Trip, Booking, matching ville origine ↔ destination)

Pour le MVP « première vente » on **simplifie volontairement**, en gardant l'architecture extensible.

## 2. Acteurs et rôles

| Acteur | User role | Capacités MVP |
|---|---|---|
| **Customer** | `CUSTOMER` (par défaut) | Parcourir, commander, payer, suivre la commande, confirmer la livraison |
| **Seller** | `SELLER` | Dashboard simple, créer/éditer ses produits, voir ses commandes |
| **Courier** | `COURIER` | Voir les commandes assignées, confirmer prise en charge + livraison |
| **Admin** | `ADMIN` | Toutes les commandes, attribution manuelle livreur, validation paiements, déblocage escrow |

Un User peut cumuler plusieurs rôles à terme, mais pour le MVP : un rôle = un compte (champ `role` enum sur `User`).

## 3. Flow nominal (vente type)

```
1. Vendeur publie un produit (dashboard /dashboard/seller)
2. Client voit le produit sur /marketplace, l'ajoute au panier (1 produit MVP)
3. Client va au checkout, choisit la livraison (parmi les livreurs proposés)
4. Client paie → Order créé statut `PENDING_PAYMENT`
5. Paiement validé → statut `PAID`, escrow plateforme
   - Email vendeur : « Nouvelle commande »
   - Email courier : « Nouvelle commande à prendre en charge »
   - Email client : « Confirmation de commande »
6. Vendeur prépare le colis, le remet au courier
7. Courier confirme la prise en charge → statut `HANDED_OVER`
   - Email client : « Votre commande est en route »
8. Courier livre au client
9. Validation conjointe livraison :
   - Courier appuie sur « Livré » dans son interface → statut `COURIER_DELIVERED`
   - Client confirme la réception via lien email ou page de suivi → statut `DELIVERED`
   - Quand les deux sont validés, statut final `DELIVERED`
10. Plateforme libère l'escrow :
    - MVP : libération **manuelle** par admin (toi)
    - Cible : automatique sur passage à `DELIVERED`
    - Statut → `SETTLED`
11. Vendeur reçoit le virement (montant produit − commission plateforme)
12. Le livreur est payé en cash sur place par le client (hors plateforme — pas de flux financier)
```

### Cas non-nominaux MVP

| Cas | Traitement |
|---|---|
| Client ne confirme pas la livraison sous 7 jours | Auto-confirm si courier a validé (réduit le risque de blocage) |
| Courier valide « Livré » mais client conteste | Statut `DISPUTED` — admin tranche manuellement |
| Vendeur annule avant `HANDED_OVER` | Refund client (manuel MVP) |
| Paiement échoué | Order purgé après 24h en `PENDING_PAYMENT` |

## 4. Modèle de données

### Champs ajoutés à `User`

```prisma
enum UserRole {
  CUSTOMER
  SELLER
  COURIER
  ADMIN
}

model User {
  // existing fields
  role          UserRole @default(CUSTOMER)
  sellerProfile SellerProfile?
  courierProfile CourierProfile?
}
```

### `SellerProfile`

```prisma
model SellerProfile {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  displayName String
  description String?
  city        String?
  country     Country
  phone       String?
  iban        String?  // pour le virement plateforme → vendeur (MVP : à la main)
  commissionPct Int    @default(12)  // % commission plateforme

  approved    Boolean  @default(false)  // validé par admin avant publication
  createdAt   DateTime @default(now())

  products    Product[]
  orders      Order[]
}
```

### `CourierProfile`

```prisma
model CourierProfile {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  displayName String
  phone       String
  baseCity    String?  // ville de base, pour matching futur
  baseCountry Country

  approved    Boolean  @default(false)
  createdAt   DateTime @default(now())

  orders      Order[]
}
```

### `Product`

```prisma
model Product {
  id          String   @id @default(cuid())
  sellerId    String
  seller      SellerProfile @relation(fields: [sellerId], references: [id], onDelete: Cascade)

  name        String
  description String   @db.Text
  imageUrl    String?  // URL hébergée externe en MVP (Cloudinary, S3 plus tard)
  priceCents  Int      // en centimes EUR
  currency    String   @default("EUR")
  stock       Int      @default(1)

  countriesAvailable Country[]  // pays où ce produit est livré
  category    String?  // taxonomie libre MVP : "ferme", "viande", "artisanat", ...

  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  orderItems  OrderItem[]
}
```

> **Variantes** (boîte 5/10/25 kg) : pas dans le MVP. Workaround : créer 3 produits séparés au début.

### `Order`

```prisma
enum OrderStatus {
  PENDING_PAYMENT
  PAID
  HANDED_OVER
  COURIER_DELIVERED
  DELIVERED
  SETTLED
  CANCELLED
  DISPUTED
}

model Order {
  id          String   @id @default(cuid())
  customerId  String
  customer    User     @relation("CustomerOrders", fields: [customerId], references: [id])
  sellerId    String
  seller      SellerProfile @relation(fields: [sellerId], references: [id])
  courierId   String?
  courier     CourierProfile? @relation(fields: [courierId], references: [id])

  status      OrderStatus @default(PENDING_PAYMENT)

  // Infos contact / livraison
  customerName     String
  customerEmail    String
  customerPhone    String
  deliveryAddress  String   @db.Text
  deliveryCity     String
  deliveryCountry  Country
  notes            String?  @db.Text

  // Montants en centimes
  productsCents    Int       // somme prix produits
  commissionCents  Int       // commission plateforme
  payoutCents      Int       // ce que touche le vendeur (productsCents - commissionCents)

  // Paiement
  paymentProvider  String?   // "stripe", "manual", "mock"
  paymentRef       String?   // id externe (Stripe session id, etc.)
  paidAt           DateTime?

  // Validation livraison (double validation)
  courierConfirmedAt  DateTime?
  customerConfirmedAt DateTime?

  // Escrow
  settledAt        DateTime?

  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  items            OrderItem[]
  events           OrderEvent[]
}

model OrderItem {
  id          String   @id @default(cuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId   String
  product     Product  @relation(fields: [productId], references: [id])

  productName String   // snapshot
  unitPriceCents Int   // snapshot
  quantity    Int      @default(1)
}

model OrderEvent {
  id          String   @id @default(cuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)

  type        String   // "PAID", "HANDED_OVER", "COURIER_DELIVERED", "CUSTOMER_CONFIRMED", "SETTLED", "CANCELLED", "DISPUTED"
  payload     Json?    // détails libres
  createdAt   DateTime @default(now())
  actorUserId String?  // qui a déclenché l'event
}
```

> Le `OrderEvent` sert d'audit trail — utile pour la transparence et le débogage.

## 5. Endpoints API

### Public / Customer

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/products` | Liste produits (filtres : country, category, sellerId) |
| `GET` | `/api/products/[id]` | Détail produit |
| `POST` | `/api/orders` | Crée une commande (statut `PENDING_PAYMENT`) |
| `GET` | `/api/orders/[id]` | Détail commande (auth : owner customer ou seller ou courier ou admin) |
| `POST` | `/api/orders/[id]/confirm-delivery` | Client confirme la réception |

### Seller

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/seller/products` | Liste mes produits |
| `POST` | `/api/seller/products` | Crée un produit |
| `PATCH` | `/api/seller/products/[id]` | Édite un produit |
| `DELETE` | `/api/seller/products/[id]` | Supprime un produit |
| `GET` | `/api/seller/orders` | Mes commandes |

### Courier

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/courier/orders` | Mes commandes assignées |
| `POST` | `/api/courier/orders/[id]/handover` | Confirme la prise en charge |
| `POST` | `/api/courier/orders/[id]/deliver` | Confirme la livraison |

### Admin

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/admin/orders/[id]/assign-courier` | Attribuer un courier (MVP : manuel) |
| `POST` | `/api/admin/orders/[id]/settle` | Libérer l'escrow → marquer `SETTLED` |
| `POST` | `/api/admin/sellers/[id]/approve` | Valider un vendeur |
| `POST` | `/api/admin/couriers/[id]/approve` | Valider un courier |

## 6. Pages UI

### Pages publiques

- `/marketplace` — listing produits (existe en mock data, à brancher sur DB)
- `/marketplace/[id]` — détail produit + bouton « Commander » (existe en mock data, à brancher)
- `/marketplace/checkout` — formulaire commande + adresse + paiement (nouveau)
- `/marketplace/order-confirmation/[id]` — confirmation post-paiement (nouveau)
- `/orders/[id]` — page de suivi client (auth) avec historique d'événements + bouton « J'ai bien reçu »

### Dashboards (auth requise)

- `/dashboard/seller` — liste produits + bouton « Nouveau produit »
- `/dashboard/seller/products/new` — formulaire création produit
- `/dashboard/seller/products/[id]/edit` — formulaire édition
- `/dashboard/seller/orders` — liste commandes vendeur

- `/dashboard/courier` — liste commandes assignées avec statut + boutons « Pris en charge » / « Livré »

- `/dashboard/admin/orders` — toutes les commandes + actions assign / settle
- `/dashboard/admin/sellers` — liste vendeurs + bouton approve
- `/dashboard/admin/couriers` — liste couriers + bouton approve

## 7. Paiement

**Statut MVP : pas de Stripe configuré.**

Architecture : interface `PaymentProvider` avec deux implémentations.

```typescript
interface PaymentProvider {
  createCheckout(order: Order): Promise<{ url: string; sessionRef: string }>
  verifyWebhook(payload: unknown): Promise<{ orderId: string; status: 'paid' | 'failed' }>
}
```

| Provider | Quand l'utiliser |
|---|---|
| `MockPaymentProvider` | Dev local, tests. Renvoie une URL fake `/marketplace/mock-payment/[orderId]` qui marque la commande `PAID` direct. |
| `ManualPaymentProvider` | **MVP première vente production**. L'order reste `PENDING_PAYMENT`. Admin marque manuellement `PAID` après réception virement bancaire ou autre canal hors plateforme. |
| `StripeProvider` | Plus tard, quand le compte Stripe est activé. |

Sélection via env var `PAYMENT_PROVIDER=mock|manual|stripe`.

## 8. Notifications email

**Statut MVP : pas d'envoi réel configuré.**

Interface :
```typescript
interface EmailService {
  send(to: string, template: EmailTemplate, vars: Record<string, unknown>): Promise<void>
}
```

| Implémentation | Quand l'utiliser |
|---|---|
| `ConsoleEmailService` | Dev local. Logue dans la console le contenu de l'email. |
| `ResendEmailService` | Production, quand `RESEND_API_KEY` configuré. |

Templates MVP :
- `seller_new_order` — au vendeur quand `PAID`
- `courier_new_assignment` — au courier quand assigné
- `customer_order_confirmation` — au client quand `PAID`
- `customer_order_handed_over` — au client quand `HANDED_OVER`
- `customer_order_delivered_by_courier` — au client quand `COURIER_DELIVERED`, avec lien pour confirmer

## 9. Calcul commission

```
productsCents     = somme des prix unitaires × quantités
commissionPct     = SellerProfile.commissionPct (par défaut 12, range 10–15)
commissionCents   = floor(productsCents × commissionPct / 100)
payoutCents       = productsCents - commissionCents
```

Stocké dans l'`Order` au moment de la création (snapshot — la commission ne change pas si le seller change son taux ensuite).

## 10. Sécurité / autorisations

Sur chaque route API :
- Auth via `auth()` Next-Auth
- Vérification du `role` ET du lien d'appartenance (ex : seller ne voit que ses produits, courier ne voit que ses commandes)
- Routes admin : check `role === 'ADMIN'`

Côté UI : guard via middleware Next.js (déjà en place pour `/login`) à étendre pour `/dashboard/*`.

## 11. Hors périmètre MVP (explicitement)

- Variantes produit (taille, déclinaisons) → 1 produit = 1 prix au début
- Panier multi-produits → 1 commande = 1 produit, 1 vendeur
- Stripe Connect / split automatique
- Matching automatique courier ↔ commande (admin assigne à la main)
- Auto-libération de l'escrow (admin libère à la main)
- Système de notation / avis
- Tracking en temps réel (GPS courier)
- Gestion des litiges automatisée
- Multi-devises (EUR uniquement)
- Codes promo
- Refund automatique

## 12. Critères de réussite (definition of done MVP)

Une **première vente complète** est réussie quand :
1. ✅ Un seller approuvé peut publier un produit visible sur `/marketplace`
2. ✅ Un customer peut commander, le système crée un `Order` en `PENDING_PAYMENT`
3. ✅ L'admin peut marquer le paiement reçu (mode `manual`) → statut `PAID`, emails envoyés
4. ✅ L'admin peut assigner un courier → statut inchangé, courier reçoit email
5. ✅ Le courier confirme la prise en charge → statut `HANDED_OVER`, client notifié
6. ✅ Le courier confirme la livraison → statut `COURIER_DELIVERED`
7. ✅ Le client confirme la réception (page de suivi) → statut `DELIVERED`
8. ✅ L'admin libère l'escrow → statut `SETTLED`, audit trail complet dans `OrderEvent`
9. ✅ Tous les emails ont été soit envoyés (Resend) soit logués (console)
