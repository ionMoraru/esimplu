# Migration esimplu.fr → esimplu.com — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrer le site WordPress de `esimplu.fr` (mutualisé OVH) vers `esimplu.com/fr` sur un VPS-1 OVH (Ubuntu 25.04), avec Cloudflare en façade, et déployer Next.js pour `/marketplace` et `/delivery`.

**Architecture:** Nginx sur le VPS sert de reverse proxy — il dispatche `/fr/*` vers WordPress (PHP-FPM) et `/marketplace/*`, `/delivery/*` vers Next.js (port 3000 via PM2). Cloudflare gère le DNS, CDN, SSL et la geo-detection. `esimplu.fr` redirige en 301 vers `esimplu.com/fr`.

**Tech Stack:** Ubuntu 25.04, Nginx, PHP 8.3-FPM, MySQL 8, WordPress 6.x, Node.js 20, PM2, PostgreSQL 16, Cloudflare (plan Free).

**Note :** Ce plan est principalement infrastructurel — les étapes sont des commandes serveur et configurations manuelles, pas du code applicatif.

---

## Structure des fichiers sur le VPS

```
/var/www/
├── esimplu-wp/              ← installation WordPress
│   ├── wp-config.php
│   ├── wp-content/
│   │   ├── themes/esimplu/  ← thème payant
│   │   └── plugins/
│   └── ...
├── esimplu/                 ← monorepo cloné depuis git
│   ├── web/                 ← Next.js (build + PM2)
│   ├── packages/types/
│   └── ...
/etc/nginx/
└── sites-available/
    └── esimplu.com          ← config Nginx
```

---

## Task 1: Sécuriser le VPS

**Prérequis :** avoir reçu l'email OVH avec l'IP du VPS et le mot de passe root.

- [ ] **Step 1: Se connecter en SSH au VPS**

```bash
ssh root@<IP_DU_VPS>
```

Utiliser le mot de passe root fourni par OVH.

- [ ] **Step 2: Mettre à jour le système**

```bash
apt update && apt upgrade -y
```

- [ ] **Step 3: Créer un utilisateur non-root**

```bash
adduser esimplu
usermod -aG sudo esimplu
```

Choisir un mot de passe fort. Répondre aux questions (Enter pour tout valider).

- [ ] **Step 4: Configurer l'accès SSH par clé**

Depuis la **machine locale** (pas le VPS) :

```bash
ssh-copy-id esimplu@<IP_DU_VPS>
```

Vérifier que la connexion fonctionne sans mot de passe :

```bash
ssh esimplu@<IP_DU_VPS>
```

- [ ] **Step 5: Désactiver l'authentification par mot de passe SSH**

Sur le VPS :

```bash
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh
```

- [ ] **Step 6: Configurer le firewall UFW**

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

Répondre `y` à la confirmation.

Vérifier :

```bash
sudo ufw status
```

Résultat attendu :
```
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

- [ ] **Step 7: Activer les mises à jour automatiques de sécurité**

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

Choisir `Yes`.

---

## Task 2: Installer les services (Nginx, PHP, MySQL)

- [ ] **Step 1: Installer Nginx**

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

Vérifier : `curl http://localhost` doit afficher la page par défaut Nginx.

- [ ] **Step 2: Installer PHP 8.3 + extensions WordPress**

```bash
sudo apt install -y php8.3-fpm php8.3-mysql php8.3-xml php8.3-mbstring php8.3-curl php8.3-zip php8.3-gd php8.3-intl php8.3-imagick
```

Vérifier :

```bash
php -v
```

Résultat attendu : `PHP 8.3.x`

```bash
sudo systemctl status php8.3-fpm
```

Résultat attendu : `active (running)`

- [ ] **Step 3: Installer MySQL 8**

```bash
sudo apt install -y mysql-server
sudo systemctl enable mysql
sudo systemctl start mysql
```

- [ ] **Step 4: Sécuriser MySQL**

```bash
sudo mysql_secure_installation
```

Répondre :
- VALIDATE PASSWORD component : `n` (pas nécessaire pour usage local)
- New password pour root : choisir un mot de passe fort
- Remove anonymous users : `y`
- Disallow root login remotely : `y`
- Remove test database : `y`
- Reload privilege tables : `y`

- [ ] **Step 5: Créer la base de données WordPress**

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE esimplu_wp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'esimplu'@'localhost' IDENTIFIED BY '<MOT_DE_PASSE_FORT>';
GRANT ALL PRIVILEGES ON esimplu_wp.* TO 'esimplu'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

> **Important :** noter le mot de passe choisi — il sera utilisé dans `wp-config.php`.

---

## Task 3: Installer WordPress sur /fr

- [ ] **Step 1: Télécharger WordPress**

```bash
cd /var/www
sudo wget https://wordpress.org/latest.tar.gz
sudo tar xzf latest.tar.gz
sudo mv wordpress esimplu-wp
sudo rm latest.tar.gz
sudo chown -R www-data:www-data esimplu-wp
```

- [ ] **Step 2: Configurer wp-config.php**

```bash
cd /var/www/esimplu-wp
sudo cp wp-config-sample.php wp-config.php
sudo nano wp-config.php
```

Modifier les lignes suivantes :

```php
define( 'DB_NAME', 'esimplu_wp' );
define( 'DB_USER', 'esimplu' );
define( 'DB_PASSWORD', '<MOT_DE_PASSE_FORT>' );
define( 'DB_HOST', 'localhost' );
define( 'DB_CHARSET', 'utf8mb4' );
```

Ajouter avant `/* That's all, stop editing! */` :

```php
/* URLs du site sur /fr */
define( 'WP_SITEURL', 'https://esimplu.com/fr' );
define( 'WP_HOME', 'https://esimplu.com/fr' );

/* Reverse proxy Cloudflare — forcer HTTPS */
if ( isset( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https' ) {
    $_SERVER['HTTPS'] = 'on';
}
```

Remplacer les clés de sécurité par des valeurs uniques depuis https://api.wordpress.org/secret-key/1.1/salt/

- [ ] **Step 3: Configurer Nginx pour WordPress sur /fr**

```bash
sudo nano /etc/nginx/sites-available/esimplu.com
```

Coller le contenu suivant :

```nginx
server {
    listen 80;
    server_name esimplu.com www.esimplu.com;

    root /var/www;

    # WordPress sur /fr
    # WordPress est installé dans /var/www/esimplu-wp
    # On crée un symlink : /var/www/fr -> /var/www/esimplu-wp
    location /fr {
        index index.php;
        try_files $uri $uri/ /fr/index.php?$args;
    }

    # PHP — traite les fichiers .php sous /fr
    location ~ ^/fr/.+\.php$ {
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
    }

    # Racine — redirection vers /fr
    location = / {
        return 302 /fr;
    }

    # Bloc pour Next.js — sera activé dans Task 7
    # location /marketplace { ... }
    # location /delivery { ... }
}
```

Puis créer le symlink :

```bash
sudo ln -s /var/www/esimplu-wp /var/www/fr
```

> **Pourquoi un symlink ?** Nginx avec `root /var/www` cherche les fichiers dans `/var/www/fr/`. Le symlink `/var/www/fr → /var/www/esimplu-wp` rend ça transparent sans les complications de la directive `alias`.

- [ ] **Step 4: Activer le site et tester Nginx**

```bash
sudo ln -s /etc/nginx/sites-available/esimplu.com /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
```

Résultat attendu : `syntax is ok` et `test is successful`

```bash
sudo systemctl reload nginx
```

- [ ] **Step 5: Finaliser l'installation WordPress via le navigateur**

Accéder à `http://<IP_DU_VPS>/fr` dans un navigateur.

> **Note :** pour que ça fonctionne avec l'IP avant d'avoir le domaine, modifier temporairement `/etc/hosts` sur la machine locale :
>
> ```
> <IP_DU_VPS>  esimplu.com
> ```
>
> Ou bien, configurer temporairement `WP_SITEURL` et `WP_HOME` avec l'IP du VPS au lieu du domaine. Les remettre à `esimplu.com/fr` une fois Cloudflare configuré.

Suivre l'assistant WordPress :
- Titre du site : `eSimplu`
- Nom d'utilisateur admin : choisir
- Mot de passe admin : choisir (noter)
- Email : admin@esimplu.com
- Cliquer "Installer WordPress"

- [ ] **Step 6: Vérifier que WordPress fonctionne**

```bash
curl -I http://localhost/fr/
```

Résultat attendu : `HTTP/1.1 200 OK` ou `HTTP/1.1 302 Found` (redirection vers la page de login si première visite).

---

## Task 4: Migrer le contenu depuis esimplu.fr

**Prérequis :** accès admin à `esimplu.fr` (WP Admin de l'ancien site).

- [ ] **Step 1: Exporter le contenu de esimplu.fr**

Sur `esimplu.fr` → WP Admin → Outils → Exporter :
- Sélectionner "Tout le contenu"
- Cliquer "Télécharger le fichier d'exportation"
- Sauvegarder le fichier XML sur la machine locale

- [ ] **Step 2: Installer le plugin WordPress Importer sur le nouveau site**

Sur `esimplu.com/fr` → WP Admin → Outils → Importer :
- À côté de "WordPress", cliquer "Installer maintenant"
- Puis "Lancer l'importation"

- [ ] **Step 3: Importer le contenu**

- Choisir le fichier XML exporté
- Cocher "Download and import file attachments"
- Assigner les auteurs (ou créer des nouveaux)
- Cliquer "Submit"

- [ ] **Step 4: Réinstaller le thème**

- Uploader le zip du thème payant via WP Admin → Apparence → Thèmes → Ajouter → Téléverser un thème
- Activer le thème

- [ ] **Step 5: Réinstaller les plugins**

Installer les plugins nécessaires via WP Admin → Extensions → Ajouter.

> **Note :** la liste des plugins sera confirmée par l'utilisateur après vérification de `esimplu.fr`.

- [ ] **Step 6: Search-replace des URLs**

Installer le plugin "Better Search Replace" sur le nouveau WordPress :

- WP Admin → Extensions → Ajouter → Rechercher "Better Search Replace"
- Installer et activer

Lancer le remplacement :
- Rechercher : `esimplu.fr`
- Remplacer par : `esimplu.com/fr`
- Sélectionner **toutes les tables**
- Décocher "Dry run" (lancer pour de vrai)
- Cliquer "Lancer la recherche/remplacement"

- [ ] **Step 7: Vérifier le contenu migré**

- Vérifier les articles : les titres, le contenu, les images s'affichent
- Vérifier les menus : WP Admin → Apparence → Menus
- Vérifier les réglages : WP Admin → Réglages → Général — confirmer que l'URL est `https://esimplu.com/fr`

---

## Task 5: Configurer Cloudflare

**Prérequis :** avoir un compte Cloudflare (créer sur https://dash.cloudflare.com si besoin).

- [ ] **Step 1: Ajouter le domaine esimplu.com sur Cloudflare**

1. Sur https://dash.cloudflare.com → "Add a site"
2. Entrer `esimplu.com`
3. Choisir le plan **Free**
4. Cloudflare scanne les DNS existants

- [ ] **Step 2: Configurer les records DNS**

Supprimer les records existants (s'il y en a), puis ajouter :

| Type | Nom | Contenu | Proxy |
|---|---|---|---|
| A | `esimplu.com` | `<IP_DU_VPS>` | Activé (orange) |
| A | `www` | `<IP_DU_VPS>` | Activé (orange) |

- [ ] **Step 3: Changer les nameservers chez OVH**

Cloudflare affiche 2 nameservers (ex: `aria.ns.cloudflare.com`, `bob.ns.cloudflare.com`).

Aller sur https://www.ovh.com/manager → Domaines → `esimplu.com` → Serveurs DNS → Modifier :
- Remplacer les nameservers OVH par les 2 fournis par Cloudflare
- Sauvegarder

Retourner sur Cloudflare → cliquer "Check nameservers" ou attendre (propagation 1-24h).

- [ ] **Step 4: Configurer le SSL**

Sur Cloudflare → SSL/TLS :
- Mode : **Full**
- Edge Certificates → Always Use HTTPS : **On**
- Automatic HTTPS Rewrites : **On**

- [ ] **Step 5: Créer la règle de redirection racine → /fr**

Sur Cloudflare → Rules → Redirect Rules → Create Rule :

- Nom : `Root to /fr`
- Condition : `URI Path equals /`
- Action : Dynamic redirect
  - Expression : `concat("https://", http.host, "/fr")`
  - Status code : `302`

- [ ] **Step 6: Vérifier que le domaine fonctionne**

Attendre la propagation DNS (vérifier avec `dig esimplu.com` — doit retourner l'IP du VPS).

> **Important :** une fois les nameservers propagés, retirer la ligne `esimplu.com` du fichier `/etc/hosts` local (ajoutée en Task 3 Step 5).

```bash
curl -I https://esimplu.com/fr/
```

Résultat attendu : `HTTP/2 200` — le site WordPress s'affiche.

```bash
curl -I https://esimplu.com/
```

Résultat attendu : `HTTP/2 302` avec `Location: https://esimplu.com/fr`

---

## Task 6: Installer Node.js, PM2 et PostgreSQL

- [ ] **Step 1: Installer Node.js 20 LTS**

Sur le VPS :

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Vérifier :

```bash
node --version
```

Résultat attendu : `v20.x.x`

```bash
npm --version
```

Résultat attendu : `10.x.x`

- [ ] **Step 2: Installer PM2**

```bash
sudo npm install -g pm2
```

Vérifier :

```bash
pm2 --version
```

- [ ] **Step 3: Installer PostgreSQL 16**

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

Vérifier :

```bash
sudo -u postgres psql -c "SELECT version();"
```

Résultat attendu : `PostgreSQL 16.x` (ou la version disponible sur Ubuntu 25.04).

- [ ] **Step 4: Créer la base de données PostgreSQL (pour usage futur)**

```bash
sudo -u postgres psql
```

```sql
CREATE USER esimplu WITH PASSWORD '<MOT_DE_PASSE_PG>';
CREATE DATABASE esimplu_app OWNER esimplu;
\q
```

> Cette base sera utilisée en Phase 2 (marketplace/delivery). Pas de tables pour l'instant.

---

## Task 7: Déployer Next.js sur le VPS

**Prérequis :** le monorepo `esimplu` doit être pushé sur un remote git (GitHub, GitLab, ou autre).

- [ ] **Step 1: Cloner le monorepo sur le VPS**

Sur le VPS :

```bash
cd /var/www
sudo git clone <REPO_URL> esimplu
sudo chown -R esimplu:esimplu esimplu
cd esimplu
npm install
```

- [ ] **Step 2: Créer le fichier .env.local**

```bash
nano /var/www/esimplu/web/.env.local
```

```env
JWT_SECRET_KEY=<MEME_CLE_QUE_DANS_WP_CONFIG>
NEXT_PUBLIC_WP_API_URL=https://esimplu.com/fr/wp-json
```

- [ ] **Step 3: Builder Next.js**

```bash
cd /var/www/esimplu
npm run build --workspace=web
```

Résultat attendu : `✓ Compiled successfully`

- [ ] **Step 4: Démarrer Next.js avec PM2**

```bash
cd /var/www/esimplu
pm2 start "npm run start --workspace=web -- -p 3000" --name esimplu-web
pm2 save
pm2 startup
```

Copier-coller la commande affichée par `pm2 startup` (elle configure le démarrage automatique au boot).

Vérifier :

```bash
curl -I http://localhost:3000
```

Résultat attendu : `HTTP/1.1 200 OK`

- [ ] **Step 5: Ajouter les blocs Next.js dans Nginx**

```bash
sudo nano /etc/nginx/sites-available/esimplu.com
```

Ajouter avant le bloc `location = /` (avant la fermeture du `server {}`) :

```nginx
    # Next.js — marketplace
    location /marketplace {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Next.js — delivery
    location /delivery {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Next.js — static assets (_next)
    location /_next {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
```

- [ ] **Step 6: Recharger Nginx et tester**

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Vérifier :

```bash
curl -I https://esimplu.com/marketplace
```

Résultat attendu : `HTTP/2 302` (redirection vers `/login` car le middleware JWT protège la route) ou `HTTP/2 200` si on accède via le navigateur et qu'on suit la redirection.

---

## Task 8: Rediriger esimplu.fr → esimplu.com/fr

- [ ] **Step 1: Se connecter au mutualisé OVH (esimplu.fr)**

Via FTP ou le gestionnaire de fichiers de l'espace client OVH.

- [ ] **Step 2: Modifier le .htaccess à la racine de esimplu.fr**

Remplacer le contenu du `.htaccess` par :

```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^(www\.)?esimplu\.fr$ [NC]
RewriteRule ^(.*)$ https://esimplu.com/fr/$1 [R=301,L]
```

- [ ] **Step 3: Tester la redirection**

```bash
curl -I https://esimplu.fr/
```

Résultat attendu : `HTTP/1.1 301 Moved Permanently` avec `Location: https://esimplu.com/fr/`

```bash
curl -I https://esimplu.fr/mon-article
```

Résultat attendu : `HTTP/1.1 301 Moved Permanently` avec `Location: https://esimplu.com/fr/mon-article`

---

## Task 9: Vérification finale

- [ ] **Step 1: Vérifier WordPress**

```bash
curl -I https://esimplu.com/fr/
```

Résultat attendu : `HTTP/2 200`

Ouvrir `https://esimplu.com/fr` dans un navigateur — le site doit s'afficher avec le bon thème et le contenu migré.

- [ ] **Step 2: Vérifier Next.js**

```bash
curl -I https://esimplu.com/marketplace
```

Résultat attendu : `HTTP/2 302` (redirection vers login — comportement normal, la route est protégée par le JWT middleware).

- [ ] **Step 3: Vérifier la redirection esimplu.fr**

```bash
curl -I http://esimplu.fr/
```

Résultat attendu : `301` vers `https://esimplu.com/fr/`

- [ ] **Step 4: Vérifier le SSL**

Ouvrir `https://esimplu.com/fr` dans un navigateur — le cadenas doit être affiché (certificat Cloudflare).

- [ ] **Step 5: Vérifier PM2 au reboot**

Sur le VPS :

```bash
sudo reboot
```

Attendre 1-2 minutes puis :

```bash
ssh esimplu@<IP_DU_VPS>
pm2 list
```

Résultat attendu : `esimplu-web` avec statut `online`.

```bash
curl -I http://localhost:3000
```

Résultat attendu : `HTTP/1.1 200 OK`

- [ ] **Step 6: Vérifier les tests locaux**

Sur la **machine locale** :

```bash
cd /Users/ionmoraru/Documents/CLAUDE/Projects/esimplu
npm test --workspace=web
```

Résultat attendu : 5 tests pass.

```bash
npm run build --workspace=web
```

Résultat attendu : `✓ Compiled successfully`

---

## Récapitulatif des credentials à noter

| Service | Identifiant | Où |
|---|---|---|
| VPS SSH | `esimplu@<IP_VPS>` | Clé SSH locale |
| MySQL root | `root` / `<mdp>` | VPS |
| MySQL WordPress | `esimplu` / `<mdp>` | `wp-config.php` |
| WordPress admin | `<user>` / `<mdp>` | `esimplu.com/fr/wp-admin` |
| PostgreSQL | `esimplu` / `<mdp>` | VPS (usage futur) |
| Cloudflare | `<email>` / `<mdp>` | dash.cloudflare.com |

> **Important :** stocker ces credentials dans un gestionnaire de mots de passe, pas en clair.

---

## Prochaine étape

Une fois la migration validée → Phase 2 : Marketplace. Créer `docs/superpowers/specs/2026-XX-XX-phase2-marketplace.md`.
