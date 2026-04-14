# Dev Environment & CI/CD — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mettre en place un environnement de développement local (WordPress Docker + Next.js natif), un repo GitHub privé, et un déploiement automatique via GitHub Actions.

**Architecture:** Docker Compose lance WordPress + MySQL + phpMyAdmin pour le dev local. Next.js tourne en natif via `npm run dev`. GitHub Actions déploie sur le VPS OVH via SSH à chaque push sur `main`.

**Tech Stack:** Docker Compose, WordPress 6 (PHP 8.3), MySQL 8, phpMyAdmin, GitHub Actions, `appleboy/ssh-action`.

---

## Structure des fichiers créés

```
esimplu/
├── docker-compose.yml              ← WordPress + MySQL + phpMyAdmin
├── .gitignore                      ← modifié (ajouter esimplu_global/, mysql_data/)
├── .env.example                    ← modifié (ajouter variables Docker)
├── .github/
│   └── workflows/
│       └── deploy.yml              ← GitHub Actions deploy workflow
└── web/
    └── .env.local                  ← modifié (pointer vers WordPress Docker)
```

---

## Task 1: Docker Compose — WordPress + MySQL + phpMyAdmin

**Files:**
- Create: `docker-compose.yml`

- [ ] **Step 1: Créer `docker-compose.yml`**

Créer le fichier `docker-compose.yml` à la racine du projet :

```yaml
services:
  mysql:
    image: mysql:8
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: esimplu_wp
      MYSQL_USER: esimplu
      MYSQL_PASSWORD: esimplu_local
    volumes:
      - esimplu_db_data:/var/lib/mysql
    ports:
      - "3306:3306"

  wordpress:
    image: wordpress:6-php8.3-apache
    restart: unless-stopped
    depends_on:
      - mysql
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: mysql
      WORDPRESS_DB_NAME: esimplu_wp
      WORDPRESS_DB_USER: esimplu
      WORDPRESS_DB_PASSWORD: esimplu_local
      WORDPRESS_TABLE_PREFIX: wp_
    volumes:
      - esimplu_wp_data:/var/www/html

  phpmyadmin:
    image: phpmyadmin:latest
    restart: unless-stopped
    depends_on:
      - mysql
    ports:
      - "8081:80"
    environment:
      PMA_HOST: mysql
      PMA_USER: esimplu
      PMA_PASSWORD: esimplu_local

volumes:
  esimplu_db_data:
  esimplu_wp_data:
```

- [ ] **Step 2: Lancer Docker Compose**

```bash
docker-compose up -d
```

Résultat attendu : les 3 containers démarrent sans erreur.

```bash
docker-compose ps
```

Résultat attendu : 3 services `running` (mysql, wordpress, phpmyadmin).

- [ ] **Step 3: Vérifier que WordPress répond**

Ouvrir `http://localhost:8080` dans un navigateur.

Résultat attendu : l'assistant d'installation WordPress s'affiche (choix de la langue).

- [ ] **Step 4: Finaliser l'installation WordPress**

Sur `http://localhost:8080` :
- Langue : Français
- Titre du site : `eSimplu`
- Identifiant : `admin`
- Mot de passe : `admin` (c'est du local)
- Email : `admin@esimplu.com`
- Cliquer "Installer WordPress"

- [ ] **Step 5: Vérifier phpMyAdmin**

Ouvrir `http://localhost:8081` dans un navigateur.

Résultat attendu : l'interface phpMyAdmin s'affiche avec la base `esimplu_wp` visible à gauche.

- [ ] **Step 6: Commit**

```bash
git add docker-compose.yml
git commit -m "feat: add Docker Compose for local WordPress dev"
```

---

## Task 2: Importer le contenu de esimplu.fr

**Prérequis :** accès admin à `esimplu.fr` et WordPress local démarré (Task 1).

- [ ] **Step 1: Exporter le contenu de esimplu.fr**

Sur `https://esimplu.fr/wp-admin` → Outils → Exporter :
- Sélectionner "Tout le contenu"
- Cliquer "Télécharger le fichier d'exportation"
- Sauvegarder le fichier XML (ex: `esimplu.WordPress.2026-04-14.xml`)

- [ ] **Step 2: Installer le plugin WordPress Importer en local**

Sur `http://localhost:8080/wp-admin` → Outils → Importer :
- À côté de "WordPress", cliquer "Installer maintenant"
- Puis "Lancer l'importation"

- [ ] **Step 3: Importer le contenu**

- Choisir le fichier XML téléchargé
- Cocher "Download and import file attachments"
- Assigner les auteurs (utiliser l'admin local ou créer les mêmes)
- Cliquer "Submit"

- [ ] **Step 4: Vérifier le contenu importé**

Sur `http://localhost:8080` :
- Les articles doivent apparaître
- Les images doivent s'afficher (téléchargées depuis `esimplu.fr`)
- Naviguer dans les pages et menus pour vérifier

> **Note :** le thème payant ne sera pas importé automatiquement. Pour l'instant le thème par défaut (Twenty Twenty-Five) s'affiche. Le thème payant sera réinstallé quand tu auras le zip de licence.

---

## Task 3: Mettre à jour .gitignore et .env.example

**Files:**
- Modify: `.gitignore`
- Modify: `.env.example`

- [ ] **Step 1: Ajouter les exclusions Docker et legacy au `.gitignore`**

Ajouter à la fin de `.gitignore` :

```gitignore
# Legacy archive
esimplu_global/

# Docker
mysql_data/
```

- [ ] **Step 2: Mettre à jour `.env.example` avec les variables Docker**

Remplacer le contenu de `.env.example` par :

```env
# Clé secrète JWT — doit correspondre exactement à JWT_AUTH_SECRET_KEY dans wp-config.php
JWT_SECRET_KEY=change_me_to_a_random_64char_string

# URL de l'API WordPress
# Local (Docker) :
NEXT_PUBLIC_WP_API_URL=http://localhost:8080/wp-json
# Production :
# NEXT_PUBLIC_WP_API_URL=https://esimplu.com/fr/wp-json
```

- [ ] **Step 3: Créer le `.env.local` pour Next.js**

Créer `web/.env.local` :

```env
JWT_SECRET_KEY=dev_secret_key_minimum_32_characters_long_ok
NEXT_PUBLIC_WP_API_URL=http://localhost:8080/wp-json
```

> Ce fichier est déjà dans `.gitignore` (pattern `.env.local`).

- [ ] **Step 4: Vérifier que Next.js démarre avec la config locale**

```bash
npm run dev
```

Ouvrir `http://localhost:3000` — la page Next.js doit s'afficher.

- [ ] **Step 5: Commit**

```bash
git add .gitignore .env.example
git commit -m "chore: update gitignore and env for Docker dev setup"
```

---

## Task 4: Créer le repo GitHub et pusher le code

**Prérequis :** le repo `esimplu` a été créé en privé sur github.com par l'utilisateur.

- [ ] **Step 1: Ajouter le remote GitHub**

```bash
git remote add origin git@github.com:<USERNAME>/esimplu.git
```

Remplacer `<USERNAME>` par ton nom d'utilisateur GitHub.

- [ ] **Step 2: Renommer la branche en main**

```bash
git branch -M main
```

- [ ] **Step 3: Pusher le code**

```bash
git push -u origin main
```

Résultat attendu : le push s'effectue sans erreur. Vérifier sur `https://github.com/<USERNAME>/esimplu` que le code apparaît.

- [ ] **Step 4: Vérifier que `esimplu_global/` n'a PAS été pushé**

Sur GitHub, vérifier que le dossier `esimplu_global/` n'apparaît pas dans la liste des fichiers.

> Si `esimplu_global/` a été committé précédemment, il faudra le retirer :
> ```bash
> git rm -r --cached esimplu_global/
> git commit -m "chore: remove esimplu_global from tracking"
> git push
> ```

---

## Task 5: GitHub Actions — workflow de déploiement

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Créer le dossier `.github/workflows/`**

```bash
mkdir -p .github/workflows
```

- [ ] **Step 2: Créer `.github/workflows/deploy.yml`**

```yaml
name: Deploy to VPS

on:
  push:
    branches:
      - main
    paths-ignore:
      - 'docs/**'
      - '*.md'
      - 'docker-compose.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/esimplu
            git pull origin main
            npm install --omit=dev
            npm run build --workspace=web
            pm2 restart esimplu-web
```

- [ ] **Step 3: Commit et pusher**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions deploy workflow"
git push
```

- [ ] **Step 4: Vérifier que le workflow apparaît sur GitHub**

Aller sur `https://github.com/<USERNAME>/esimplu/actions`

Résultat attendu : le workflow "Deploy to VPS" apparaît. Il va échouer (pas de secrets configurés) — c'est normal.

- [ ] **Step 5: Configurer les secrets GitHub (quand le VPS sera prêt)**

Sur GitHub → Settings → Secrets and variables → Actions → New repository secret :

- `VPS_HOST` : `<IP_DU_VPS>`
- `VPS_USER` : `esimplu`
- `VPS_SSH_KEY` : coller le contenu de la clé privée SSH

> **Pour générer une clé SSH dédiée au déploiement :**
> ```bash
> ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/esimplu_deploy
> ```
> - Copier la clé publique (`~/.ssh/esimplu_deploy.pub`) dans `~/.ssh/authorized_keys` sur le VPS
> - Copier la clé privée (`~/.ssh/esimplu_deploy`) dans le secret GitHub `VPS_SSH_KEY`

- [ ] **Step 6: Tester le déploiement (quand le VPS sera prêt)**

Faire un changement mineur, pusher sur `main`, et vérifier :

1. Le workflow s'exécute sur GitHub Actions (onglet Actions)
2. Le VPS a bien pullé et rebuild Next.js
3. Le site est accessible sur `https://esimplu.com/marketplace`

---

## Commandes de référence

```bash
# === Dev local ===
docker-compose up -d           # Lancer WordPress + MySQL + phpMyAdmin
docker-compose down            # Arrêter les containers
docker-compose down -v         # Arrêter ET supprimer les données MySQL
npm run dev                    # Lancer Next.js en dev (http://localhost:3000)

# === URLs locales ===
# WordPress :    http://localhost:8080
# WP Admin :     http://localhost:8080/wp-admin
# WP REST API :  http://localhost:8080/wp-json/wp/v2/posts
# phpMyAdmin :   http://localhost:8081
# Next.js :      http://localhost:3000

# === Git ===
git push origin main           # Push + déploiement automatique
```
