# Import API — créer du contenu en prod depuis le terminal

API admin pour créer **services**, **vendeurs**, **produits**, **livreurs** et
**trajets** depuis l'extérieur (terminal, copilote IA, script CLI).

## Configuration

Sur le VPS (`~/ecosystem.config.js`) **et** en local (`.env.local` si tu testes
contre ton instance dev) :

```bash
ADMIN_IMPORT_TOKEN=$(openssl rand -hex 32)
```

⚠️ Min. 16 caractères, sinon l'API refuse en 503 « non configuré ».

Sur le VPS, après modification :

```bash
pm2 restart esimplu --update-env
```

## Conventions communes

- Toutes les routes attendent `Authorization: Bearer <ADMIN_IMPORT_TOKEN>` et
  `Content-Type: application/json`.
- Toutes sont **idempotentes** : si une fiche équivalente existe déjà, on
  renvoie `200 { ..., alreadyExists: true }` sans rien créer ni modifier.
- Création réussie → `201 { ..., alreadyExists: false }`.
- Erreur de validation → `400`. Auth → `401`. Référence absente → `404`.
- Chaque appel est tracé dans la table `ImportLog` (timestamp, type, action,
  payloadHash SHA-256, IP, status).

## Endpoints

### `POST /api/admin/import/service`

Crée un service draft + invitation (claim flow).

```bash
curl -X POST https://esimplu.com/api/admin/import/service \
  -H "Authorization: Bearer $ADMIN_IMPORT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mutări internaționale Paris-București",
    "categorySlug": "mutari-transport",
    "description": "Transport profesional de mobilier și colete între Franța și România. Camion 20m³.",
    "city": "Paris",
    "country": "fr",
    "phone": "+33758044791",
    "languages": ["ro", "fr"],
    "whatsapp": "+33758044791",
    "sourceUrl": "https://www.facebook.com/...",
    "contactName": "Ion Popescu"
  }'
```

**Idempotence** : même `title` + `city` + `country` (case-insensitive) avec
status PENDING non soft-deleted → renvoie l'existant.

**Réponse 201** :

```json
{
  "service": { "id": "...", "title": "...", "status": "PENDING", ... },
  "invitation": { "token": "...", "expiresAt": "..." },
  "claimUrl": "https://esimplu.com/claim/<token>",
  "alreadyExists": false
}
```

### `POST /api/admin/import/seller`

Crée un User (si inexistant) + SellerProfile (`approved=false`).

```bash
curl -X POST https://esimplu.com/api/admin/import/seller \
  -H "Authorization: Bearer $ADMIN_IMPORT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "marie@example.com",
    "userName": "Marie Dupont",
    "displayName": "Boulangerie Marie",
    "slug": "boulangerie-marie",
    "city": "Paris",
    "country": "fr",
    "phone": "+33...",
    "iban": "FR7610107001010101010101010",
    "description": "Pâine artizanală moldovenească..."
  }'
```

`slug` est optionnel — auto-généré depuis `displayName` si absent, dé-dupliqué
en `<slug>-2`, `<slug>-3`, etc. en cas de collision.

**Idempotence** : `userEmail` (le User ne peut avoir qu'un seul SellerProfile).

**Réponse 201** : inclut un `claimUrl` valide 30 jours pour que le vendeur pose
son mot de passe via `/reset-password/<token>`.

### `POST /api/admin/import/product`

Ajoute un produit à un vendeur existant. Le vendeur doit être créé avant
(via `/seller`) et identifié par son `slug`.

```bash
curl -X POST https://esimplu.com/api/admin/import/product \
  -H "Authorization: Bearer $ADMIN_IMPORT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sellerSlug": "boulangerie-marie",
    "name": "Pâine de casă 1kg",
    "description": "Pâine albă cu maia, coaptă în fiecare dimineață.",
    "imageUrl": "https://images.example.com/paine.jpg",
    "priceCents": 690,
    "stock": 20,
    "countriesAvailable": ["fr"],
    "category": "panificatie",
    "isPublished": true
  }'
```

**Validation** (déléguée à `lib/services/products.ts`) :
- `priceCents` : 100 ≤ prix ≤ 1 000 000 (1 € à 10 000 €)
- `countriesAvailable` : whitelist `fr|de|it|uk`, au moins une

**Idempotence** : même `sellerSlug` + même `name` (case-insensitive).

### `POST /api/admin/import/courier`

Crée un User + CourierProfile (`approved=false`). Symétrique de `/seller`.

```bash
curl -X POST https://esimplu.com/api/admin/import/courier \
  -H "Authorization: Bearer $ADMIN_IMPORT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "andrei@example.com",
    "userName": "Andrei Munteanu",
    "displayName": "Andrei Transport",
    "phone": "+33758044791",
    "baseCity": "Lyon",
    "baseCountry": "fr"
  }'
```

**Idempotence** : `userEmail`. Réponse inclut un `claimUrl` 30 jours.

### `POST /api/admin/import/trip`

Crée un Trip pour un livreur **déjà approuvé**. Refuse en 409 si pas approuvé.

```bash
curl -X POST https://esimplu.com/api/admin/import/trip \
  -H "Authorization: Bearer $ADMIN_IMPORT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courierEmail": "andrei@example.com",
    "originCity": "Paris",
    "originCountry": "fr",
    "destinationCity": "București",
    "destinationCountry": "ro",
    "departureDate": "2026-06-15T08:00:00Z",
    "arrivalDate": "2026-06-17T20:00:00Z",
    "vehicleType": "VAN",
    "passengerSeatsOffered": 4,
    "parcelCapacityKg": 500,
    "pricePerSeatCents": 12000,
    "pricePerKgCents": 200,
    "notes": "Plecare din Porte de Bagnolet."
  }'
```

`vehicleType` ∈ `CAR | VAN | BUS | PLANE | TRAIN | OTHER`.

**Idempotence** : même livreur + mêmes villes origine/destination + même
minute de départ.

## Bonnes pratiques

1. **Token rotation** : si le token fuite (commit accidentel), régénère-le
   avec `openssl rand -hex 32`, mets à jour `~/ecosystem.config.js` sur le
   VPS, puis `pm2 restart esimplu --update-env`. Tous les anciens appels
   retournent immédiatement 401.
2. **Audit** : pour voir l'historique des imports, sur le VPS :
   ```sql
   SELECT type, action, "targetSlug", status, ip, "createdAt"
   FROM "ImportLog" ORDER BY "createdAt" DESC LIMIT 50;
   ```
3. **Retry sûr** : tu peux relancer le même `curl` 100 fois — l'idempotence
   garantit qu'aucune duplication ne sera créée.
4. **Local-first** : tu peux tester contre `http://localhost:3000` (avec ton
   `ADMIN_IMPORT_TOKEN` local) avant de tirer en prod.
