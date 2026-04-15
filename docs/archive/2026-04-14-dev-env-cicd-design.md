# Dev Environment & CI/CD — Design Spec

**Date :** 2026-04-14
**Statut :** Approuvé

---

## Contexte

Le projet eSimplu est un monorepo avec une app Next.js (`web/`) et un WordPress qui sera déployé sur un VPS OVH. En attendant le VPS, on met en place :
1. Un environnement de développement local (WordPress en Docker, Next.js en natif)
2. Un repo GitHub privé
3. Un pipeline CI/CD via GitHub Actions pour déployer automatiquement sur le VPS

---

## Architecture dev local

```
Machine locale (macOS)
│
├── Docker Compose
│   ├── wordpress    → http://localhost:8080/fr   (WordPress + PHP)
│   ├── mysql        → port 3306                  (MySQL 8, volume persisté)
│   └── phpmyadmin   → http://localhost:8081      (admin BDD)
│
└── Natif
    └── Next.js dev  → http://localhost:3000      (npm run dev)
```

**Pourquoi Next.js en natif et pas dans Docker :** le hot reload est nettement plus rapide sans la couche de volumes montés Docker. Node.js est déjà installé localement.

---

## Docker Compose

### Services

**wordpress :**
- Image : `wordpress:6-php8.3-apache`
- Port : `8080:80`
- Variables d'environnement : credentials MySQL, `WP_SITEURL`, `WP_HOME`
- Volume : `./wordpress/` monté dans `/var/www/html/wp-content/themes/` et `/var/www/html/wp-content/plugins/` pour développer le thème/plugins en live

**mysql :**
- Image : `mysql:8`
- Port : `3306:3306` (accès local optionnel)
- Volume nommé `esimplu_db_data` pour persister les données entre les redémarrages
- Base : `esimplu_wp`, user : `esimplu`

**phpmyadmin :**
- Image : `phpmyadmin:latest`
- Port : `8081:80`
- Lié au service `mysql`

### WordPress sur /fr

WordPress dans Docker tourne à la racine du container (`/`). Pour simuler le chemin `/fr` en local, on configure :

```php
define('WP_SITEURL', 'http://localhost:8080');
define('WP_HOME', 'http://localhost:8080');
```

> **Note :** en local, WordPress est accessible directement sur `http://localhost:8080` (pas sur `/fr`). Le path `/fr` est géré par Nginx en production via Cloudflare. En dev, on simplifie — l'important est que le contenu et l'API REST fonctionnent.

### Migration du contenu en local

1. Exporter le contenu de `esimplu.fr` (XML via WP Admin → Outils → Exporter)
2. Lancer `docker-compose up`
3. Accéder à `http://localhost:8080/wp-admin`
4. Installer le plugin WordPress Importer
5. Importer le XML avec les attachments

---

## GitHub

### Repo

- Nom : `esimplu`
- Visibilité : privé
- Remote : `origin` → `git@github.com:<username>/esimplu.git`

### .gitignore

Ajouter au `.gitignore` existant :

```gitignore
# Archive legacy — ne pas versionner
esimplu_global/

# Docker volumes
mysql_data/
```

### Branches

- `main` — branche de production. Push sur `main` = déploiement automatique.
- Feature branches pour le développement courant.

---

## CI/CD — GitHub Actions

### Workflow : Deploy on push to main

**Déclencheur :** push sur la branche `main`

**Étapes :**
1. Se connecter au VPS via SSH
2. `cd /var/www/esimplu`
3. `git pull origin main`
4. `npm install`
5. `npm run build --workspace=web`
6. `pm2 restart esimplu-web`

### Secrets GitHub

| Secret | Valeur |
|---|---|
| `VPS_HOST` | IP du VPS OVH |
| `VPS_USER` | `esimplu` |
| `VPS_SSH_KEY` | Clé privée SSH (celle qui a accès au VPS) |

### Fichier workflow

`.github/workflows/deploy.yml` — un seul job `deploy` qui utilise `appleboy/ssh-action` pour exécuter les commandes sur le VPS.

### Sécurité

- La clé SSH est stockée uniquement dans les GitHub Secrets (jamais commitée)
- Le workflow ne tourne que sur `main` (pas sur les feature branches)
- Le VPS n'accepte que les connexions SSH par clé (mot de passe désactivé)

---

## Ce qui n'est PAS dans ce spec

- **Tests en CI :** pas de `npm test` dans le workflow pour l'instant. On le rajoutera quand il y aura plus de tests.
- **Build Docker en CI :** pas de registry Docker. Le VPS a Node.js installé nativement.
- **Preview deployments :** pas de déploiement par feature branch. Un seul environnement (prod).
- **WordPress en CI :** le déploiement WordPress se fait manuellement sur le VPS. Seul Next.js est déployé automatiquement.

---

## Commandes de développement

```bash
# Lancer WordPress + MySQL + phpMyAdmin en local
docker-compose up -d

# Lancer Next.js en dev
npm run dev

# Arrêter WordPress
docker-compose down

# Arrêter WordPress ET supprimer les données MySQL
docker-compose down -v
```
