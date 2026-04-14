# Migration esimplu.fr → esimplu.com — Design Spec

**Date :** 2026-04-14
**Statut :** Approuvé

---

## Contexte

Le site `esimplu.fr` est actuellement hébergé sur un mutualisé OVH avec WordPress. Le domaine `esimplu.com` vient d'être acheté chez OVH. Un VPS-1 OVH (Ubuntu 25.04, 4 vCores, 8 Go RAM, 75 Go SSD NVMe, datacenter Allemagne) a été commandé pour héberger l'ensemble de la plateforme.

**Objectif :** Migrer le site WordPress de `esimplu.fr` vers `esimplu.com/fr` sur le VPS, avec Cloudflare en façade, et préparer l'infrastructure pour Next.js (marketplace/delivery).

---

## Architecture cible

```
Cloudflare (esimplu.com) — DNS + CDN + SSL + Geo-detection
│
└── VPS-1 OVH (Ubuntu 25.04, Allemagne)
    │
    Nginx (reverse proxy, port 80)
    ├── /fr/*            → PHP-FPM → WordPress
    ├── /marketplace/*   → proxy_pass → Node.js :3000 (Next.js via PM2)
    └── /delivery/*      → proxy_pass → Node.js :3000 (Next.js via PM2)

Services sur le VPS :
├── Nginx              — reverse proxy + static files
├── PHP 8.3 + FPM      — WordPress
├── MySQL 8            — base WordPress
├── Node.js 20 + PM2   — Next.js
└── PostgreSQL 16      — base marketplace/delivery (installé, pas utilisé en Phase 1)
```

---

## Domaines

| Domaine | Rôle | DNS |
|---|---|---|
| `esimplu.com` | Site principal | Cloudflare → IP du VPS |
| `esimplu.fr` | Redirection | 301 → `esimplu.com/fr` (via mutualisé OVH puis Cloudflare) |

---

## Étape 1 — Préparer le VPS

### 1.1 Sécurisation

- Connexion SSH avec clé (désactiver l'authentification par mot de passe)
- Firewall UFW : autoriser SSH (22), HTTP (80), HTTPS (443)
- Mises à jour automatiques de sécurité (`unattended-upgrades`)

### 1.2 Installation des services

| Service | Version | Rôle |
|---|---|---|
| Nginx | dernière stable | Reverse proxy |
| PHP | 8.3 + FPM | WordPress |
| MySQL | 8.x | Base WordPress |
| Node.js | 20 LTS | Next.js |
| PM2 | dernière | Process manager Node.js |
| PostgreSQL | 16 | Base marketplace/delivery |

### 1.3 Configuration Nginx

```nginx
server {
    listen 80;
    server_name esimplu.com www.esimplu.com;

    # WordPress sur /fr
    location /fr {
        alias /var/www/esimplu-wp;
        index index.php;
        try_files $uri $uri/ /fr/index.php?$args;

        location ~ \.php$ {
            fastcgi_pass unix:/run/php/php8.3-fpm.sock;
            fastcgi_param SCRIPT_FILENAME $request_filename;
            include fastcgi_params;
        }
    }

    # Next.js — marketplace & delivery
    location /marketplace {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /delivery {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Racine — redirection vers /fr par défaut (fallback si Cloudflare ne redirige pas)
    location = / {
        return 302 /fr;
    }
}
```

> Le SSL est géré par Cloudflare (mode Full). Nginx écoute en HTTP sur le port 80. Cloudflare termine le HTTPS côté client.

---

## Étape 2 — Installer WordPress sur le VPS

### 2.1 Créer la base MySQL

```sql
CREATE DATABASE esimplu_wp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'esimplu'@'localhost' IDENTIFIED BY '<MOT_DE_PASSE_FORT>';
GRANT ALL PRIVILEGES ON esimplu_wp.* TO 'esimplu'@'localhost';
FLUSH PRIVILEGES;
```

### 2.2 Installer WordPress

- Télécharger WordPress dans `/var/www/esimplu-wp`
- Configurer `wp-config.php` avec les credentials MySQL
- Définir `WP_SITEURL` et `WP_HOME` à `https://esimplu.com/fr`

```php
define('WP_SITEURL', 'https://esimplu.com/fr');
define('WP_HOME', 'https://esimplu.com/fr');
```

### 2.3 Migrer le contenu depuis esimplu.fr

1. Sur `esimplu.fr` : WP Admin → Outils → Exporter → Tout le contenu → télécharger le XML
2. Sur le nouveau WordPress : installer le plugin WordPress Importer
3. Importer le XML en cochant "Download and import file attachments"
4. Search-replace des URLs dans le contenu : `esimplu.fr` → `esimplu.com/fr`

### 2.4 Thème et plugins

- Réinstaller le thème payant (depuis le zip de licence)
- Réinstaller les plugins nécessaires (liste à confirmer par l'utilisateur)

### 2.5 Vérification

- Accéder à `http://<IP_VPS>/fr` — le site WordPress doit s'afficher correctement
- Vérifier les articles, les images, les menus

---

## Étape 3 — Transférer esimplu.com sur Cloudflare

### 3.1 Ajouter le domaine sur Cloudflare

1. Créer un compte Cloudflare (ou utiliser existant)
2. Ajouter le site `esimplu.com` (plan Free)
3. Cloudflare scannera les DNS existants

### 3.2 Configurer les records DNS

| Type | Nom | Valeur | Proxy |
|---|---|---|---|
| A | `esimplu.com` | `<IP_DU_VPS>` | Activé (orange) |
| A | `www` | `<IP_DU_VPS>` | Activé (orange) |

### 3.3 Changer les nameservers

Dans l'espace client OVH → Domaine `esimplu.com` → Serveurs DNS :
- Remplacer les nameservers OVH par ceux fournis par Cloudflare
- Propagation : 1-24h

### 3.4 Configuration SSL

- Cloudflare → SSL/TLS → Mode : **Full**
- Cela signifie : HTTPS entre le visiteur et Cloudflare, HTTP entre Cloudflare et le VPS

---

## Étape 4 — Configurer le routing Cloudflare

### 4.1 Geo-detection (pour plus tard — multi-pays)

Pour l'instant, un seul pays actif (FR). Règle simple :

Redirect Rule :
- Condition : `(http.request.uri.path eq "/")`
- Action : Redirect → `https://esimplu.com/fr` (302)

### 4.2 Geo-detection avancée (Phase 2+)

Quand les autres pays seront activés :

```
(http.request.uri.path eq "/") and (ip.geoip.country in {"FR" "MC"}) → /fr
(http.request.uri.path eq "/") and (ip.geoip.country in {"DE" "AT" "CH"}) → /de
(http.request.uri.path eq "/") and (ip.geoip.country in {"IT"}) → /it
(http.request.uri.path eq "/") and (ip.geoip.country in {"GB"}) → /uk
Fallback → /fr
```

---

## Étape 5 — Déployer Next.js sur le VPS

### 5.1 Cloner le monorepo

```bash
git clone <repo_url> /var/www/esimplu
cd /var/www/esimplu
npm install
```

### 5.2 Configurer l'environnement

Créer `/var/www/esimplu/web/.env.local` :
```env
JWT_SECRET_KEY=<MEME_CLE_QUE_DANS_WP_CONFIG>
NEXT_PUBLIC_WP_API_URL=https://esimplu.com/fr/wp-json
```

### 5.3 Builder et démarrer

```bash
npm run build --workspace=web
pm2 start "npm run start --workspace=web" --name esimplu-web -- -p 3000
pm2 save
pm2 startup
```

### 5.4 Vérification

- `curl http://localhost:3000/marketplace` → page placeholder
- `https://esimplu.com/marketplace` → même page via Cloudflare + Nginx

---

## Étape 6 — Redirections et go live

### 6.1 Go live

Une fois tout vérifié :
- `esimplu.com/fr` → WordPress fonctionne
- `esimplu.com/marketplace` → Next.js fonctionne
- SSL actif via Cloudflare

### 6.2 Redirection esimplu.fr → esimplu.com/fr

Sur l'hébergement mutualisé OVH (`esimplu.fr`), ajouter dans `.htaccess` :

```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^(www\.)?esimplu\.fr$ [NC]
RewriteRule ^(.*)$ https://esimplu.com/fr/$1 [R=301,L]
```

### 6.3 Fin de vie du mutualisé

- Garder le mutualisé OVH 2-3 mois pour que Google indexe les redirections 301
- Ensuite, résilier le mutualisé
- Transférer le domaine `esimplu.fr` sur Cloudflare et configurer une Page Rule de redirection permanente vers `esimplu.com/fr`
- Garder le domaine `esimplu.fr` (renouvellement annuel) pour ne pas perdre le SEO

---

## Ce qui n'est PAS dans cette migration

- **WordPress Multisite** : pas activé maintenant, juste le site FR. Multisite viendra quand on ajoutera DE/IT/UK.
- **PostgreSQL** : installé sur le VPS mais pas de tables créées. Utilisé en Phase 2 (marketplace).
- **JWT Auth plugin** : sera configuré quand on implémentera le login marketplace.
- **Page d'accueil Next.js** : reste le boilerplate, pas de changement.

---

## Checklist de validation

- [ ] VPS accessible en SSH
- [ ] UFW configuré (22, 80, 443)
- [ ] Nginx installé et configuré
- [ ] PHP 8.3 + FPM fonctionnel
- [ ] MySQL 8 installé, base `esimplu_wp` créée
- [ ] WordPress installé sur `/fr`
- [ ] Contenu migré depuis `esimplu.fr`
- [ ] Thème et plugins réinstallés
- [ ] `esimplu.com` ajouté sur Cloudflare
- [ ] Nameservers OVH → Cloudflare
- [ ] Record A → IP du VPS
- [ ] SSL mode Full activé
- [ ] Redirect rule `/` → `/fr` configurée
- [ ] `esimplu.com/fr` accessible et fonctionnel
- [ ] Node.js 20 + PM2 installés
- [ ] Next.js buildé et démarré sur port 3000
- [ ] `esimplu.com/marketplace` accessible
- [ ] PostgreSQL 16 installé
- [ ] Redirection 301 `esimplu.fr` → `esimplu.com/fr` active
- [ ] `npm test --workspace=web` passe
- [ ] `npm run build --workspace=web` compile sans erreur
