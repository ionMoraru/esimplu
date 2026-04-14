# Architecture Headless — Design Spec

**Date :** 2026-04-14
**Statut :** Approuvé
**Remplace :** Certaines décisions de `2026-04-07-esimplu-platform-design.md` (routing, thème WP, PostgreSQL)

---

## Contexte

Suite à la réévaluation des besoins, le rôle de WordPress change : il ne sert plus de front-end mais uniquement de backoffice (CMS headless). Next.js gère l'intégralité du front. Le thème ClassiPress est abandonné — il n'y a plus d'annonces classées. PostgreSQL est remplacé par une seconde base MySQL.

---

## Architecture

```
Cloudflare (esimplu.com) — DNS + CDN + SSL + Geo-detection
│
└── VPS-1 OVH (Ubuntu 25.04)
    │
    Nginx (reverse proxy)
    ├── /*               → Next.js (port 3000) — tout le front
    ├── /wp-admin/*      → WordPress (PHP-FPM) — backoffice
    ├── /wp-json/*       → WordPress API REST — données CMS
    └── /wp-content/*    → WordPress (fichiers statiques, médias)

MySQL (même serveur)
├── esimplu_wp           ← WordPress : articles, services (CPT), utilisateurs
└── esimplu_app          ← App : marketplace (produits, commandes), delivery (trajets, réservations)
```

---

## WordPress — Backoffice headless

**Rôle :** CMS pour rédiger des articles et modérer les fiches de services. Aucun front WordPress n'est exposé aux visiteurs.

**Fonctionnalités WordPress utilisées :**
- Éditeur Gutenberg pour rédiger des articles
- Custom Post Type "Service" pour les fiches de prestataires
- API REST pour exposer le contenu à Next.js
- Gestion des utilisateurs (WP Users)
- Gestion des médias (images)

**Fonctionnalités WordPress NON utilisées :**
- Thèmes (aucun thème actif côté front)
- Commentaires
- Widgets / Menus WordPress
- Annonces classées (ClassiPress abandonné)

**Custom Post Type "Service" :**

| Champ | Type | Description |
|---|---|---|
| Titre | string | Nom du prestataire ou du commerce |
| Catégorie | taxonomy | comptable, avocat, magasin, livreur, etc. |
| Description | textarea | Description libre du service |
| Langues | taxonomy/meta | roumain, moldave, russe, français, etc. |
| Ville | string | Ville ou zone géographique |
| Téléphone | string | Numéro de contact |
| Email | string | Email de contact |
| WhatsApp | string | Numéro WhatsApp (optionnel) |
| Photo | image | Photo du prestataire ou du commerce (optionnel) |
| Statut | post_status | pending (en attente) → publish (validé par admin) |

Les services sont soumis par les utilisateurs via un formulaire Next.js qui appelle l'API REST WordPress. L'admin modère dans WP Admin.

---

## Next.js — Front unique

**Rôle :** Afficher tout le contenu et gérer toutes les interactions utilisateur.

### Pages

| Route | Source de données | Description |
|---|---|---|
| `/fr` | — | Landing page, présentation eSimplu, liens vers sections |
| `/fr/articles` | WP API (`/wp-json/wp/v2/posts`) | Liste des articles |
| `/fr/articles/[slug]` | WP API (`/wp-json/wp/v2/posts?slug=...`) | Article complet |
| `/fr/services` | WP API (`/wp-json/wp/v2/services`) | Répertoire des services avec filtres par catégorie |
| `/fr/services/proposer` | WP API (POST) | Formulaire de soumission de service |
| `/marketplace` | MySQL `esimplu_app` | Marketplace producteurs (Phase 2) |
| `/delivery` | MySQL `esimplu_app` | Plateforme livreurs (Phase 3) |
| `/login` | WP API JWT | Page de connexion |

### Rendu

- **Articles et services :** SSR ou SSG via l'API REST WordPress. Next.js récupère le contenu brut (titre, contenu HTML, champs custom) et l'affiche dans des composants React avec un design custom.
- **Marketplace et delivery :** Pages dynamiques alimentées par la base `esimplu_app` via des API Routes Next.js.

### Bandeaux de renvoi

- Page services catégorie "livraison" → bandeau CTA vers `/delivery`
- Page services catégorie "magasin" → bandeau CTA vers `/marketplace` ("Commander des produits chez des producteurs moldaves")

---

## Base de données

### MySQL — esimplu_wp (WordPress)

Base WordPress standard. Contient :
- `wp_posts` — articles + services (CPT)
- `wp_postmeta` — champs custom des services
- `wp_users` — utilisateurs
- `wp_terms` / `wp_term_taxonomy` — catégories de services, langues

### MySQL — esimplu_app (Application)

Base dédiée aux modules marketplace et delivery. Schéma relationnel propre avec tables typées (pas de postmeta key/value).

Tables marketplace : `sellers`, `products`, `orders`, `order_items`
Tables delivery : `carriers`, `trips`, `bookings`

> Le schéma détaillé sera défini dans les specs Phase 2 et Phase 3. Les types sont déjà définis dans `packages/types/index.ts`.

---

## Routing Nginx (mis à jour)

```nginx
server {
    listen 80;
    server_name esimplu.com www.esimplu.com;

    # WordPress backoffice
    location /wp-admin {
        # → PHP-FPM → WordPress
    }

    location /wp-json {
        # → PHP-FPM → WordPress API REST
    }

    location /wp-content {
        # → fichiers statiques WordPress (médias, uploads)
    }

    location /wp-login.php {
        # → PHP-FPM → WordPress login
    }

    # Tout le reste → Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}
```

---

## Routing Cloudflare (simplifié)

Plus besoin de router `/fr/*` vers WordPress séparément. Tout va vers le VPS, Nginx dispatche.

- Redirect rule : `/` → `/fr` (geo-detection, comme avant)
- Tout le traffic → VPS (un seul origin)

---

## Ce qui change par rapport au spec initial

| Aspect | Avant | Maintenant |
|---|---|---|
| WordPress | Front + backoffice (avec thème) | Backoffice headless uniquement |
| Thème WP | ClassiPress (payant) | Aucun (pas de front WP) |
| Front-end | WordPress (`/fr/*`) + Next.js (`/marketplace`, `/delivery`) | Next.js uniquement (tout le front) |
| BDD app | PostgreSQL | MySQL (base `esimplu_app` séparée) |
| Nginx routing | `/fr` → WP, `/marketplace` → Next.js | `/wp-admin` → WP, tout le reste → Next.js |
| Annonces | ClassiPress listings | Supprimées |
| Services | N/A | Custom Post Type WP + formulaire Next.js |

---

## Ce qui ne change PAS

- Authentification JWT (WordPress génère, Next.js valide)
- Cloudflare en façade (DNS, CDN, SSL, geo-detection)
- VPS OVH (même serveur pour tout)
- Monorepo structure (`web/`, `packages/`)
- Types partagés (`@esimplu/types`)
- Domaine `esimplu.com` avec paths localisés (`/fr`, `/de`, etc.)
- Redirection `esimplu.fr` → `esimplu.com/fr`
