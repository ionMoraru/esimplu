# Guide d'onboarding — eSimplu

Bienvenue sur le projet eSimplu ! Ce guide t'explique tout ce que tu as besoin de savoir pour commencer.

## C'est quoi eSimplu ?

eSimplu est une plateforme pour la **diaspora roumaine et moldave en Europe**. Elle aide les gens qui vivent en France, Allemagne, Italie et au Royaume-Uni à trouver :

- **Des articles utiles** — comment faire une mutuelle, le livret solidaire, etc.
- **Un répertoire de services** — comptable, avocat, magasin roumain, livreur... (comme les Pages Jaunes)
- **Un marketplace** — des producteurs moldaves/roumains qui vendent directement à la diaspora (comme Crowdfarming)
- **Une plateforme de livraison** — des chauffeurs qui font des trajets entre la Moldavie/Roumanie et l'Europe, et proposent des places pour transporter des colis

## Technologies utilisées

Ne t'inquiète pas si tu ne connais pas tout — Claude va t'expliquer chaque concept au fur et à mesure.

| Technologie | C'est quoi | À quoi ça sert ici |
|---|---|---|
| **React** | Librairie JavaScript pour construire des interfaces | On construit toutes les pages avec |
| **Next.js** | Framework basé sur React | Gère le routing (chaque dossier = une page), le rendu serveur, etc. |
| **TypeScript** | JavaScript avec des types | Aide à éviter les bugs en vérifiant les types de données |
| **Tailwind CSS** | CSS utilitaire | On stylise les composants avec des classes (`text-lg`, `bg-blue-500`, etc.) |
| **shadcn/ui** | Librairie de composants UI | Boutons, modales, menus déroulants prêts à l'emploi |
| **Prisma** | ORM (accès à la base de données) | Communique avec PostgreSQL |
| **Auth.js** | Authentification | Connexion via Google/Facebook |
| **PostgreSQL** | Base de données | Stocke les articles, services, utilisateurs |

## Installer le projet

### Prérequis

- **Node.js** version 20 ou plus — [télécharger ici](https://nodejs.org/)
- **Docker Desktop** — [télécharger ici](https://www.docker.com/products/docker-desktop/)
- **Git** — normalement déjà installé
- **WebStorm** (ou VS Code) avec le plugin Claude

### Étapes

```bash
# 1. Cloner le projet
git clone git@github.com:ionMoraru/esimplu.git
cd esimplu

# 2. Installer les dépendances
npm install

# 3. Lancer la base de données (PostgreSQL dans Docker)
docker compose up -d

# 4. Copier le fichier d'environnement
cp .env.example .env.local

# 5. Lancer les migrations de la base de données
npx prisma migrate dev

# 6. Lancer le serveur de développement
npm run dev
```

Ouvre http://localhost:3000 — tu devrais voir la page d'accueil eSimplu.

### Commandes utiles

| Commande | Quand l'utiliser |
|---|---|
| `npm run dev` | Lancer le serveur de dev (recharge auto quand tu modifies un fichier) |
| `npm run build` | Vérifier que tout compile avant de committer |
| `npx prisma studio` | Ouvrir une interface web pour voir les données dans la base |
| `docker compose up -d` | Démarrer PostgreSQL |
| `docker compose down` | Arrêter PostgreSQL |

## Structure du projet

```
esimplu/
├── app/                    ← Les pages du site (chaque dossier = une URL)
│   ├── layout.tsx          ← Le "squelette" commun à toutes les pages (header, footer)
│   ├── page.tsx            ← La page d'accueil (URL: /)
│   ├── articles/
│   │   └── page.tsx        ← La liste des articles (URL: /articles)
│   ├── services/
│   │   └── page.tsx        ← Le répertoire des services (URL: /services)
│   ├── marketplace/
│   │   └── page.tsx        ← Le marketplace (URL: /marketplace)
│   ├── delivery/
│   │   └── page.tsx        ← La plateforme de livraison (URL: /delivery)
│   └── login/
│       └── page.tsx        ← La page de connexion (URL: /login)
├── components/             ← Les composants réutilisables (boutons, modales, etc.)
│   ├── ui/                 ← Composants shadcn/ui (ne pas modifier directement)
│   ├── country-modal.tsx   ← La modale de choix de pays
│   └── country-selector.tsx ← Le sélecteur de pays dans le header
├── lib/                    ← Code utilitaire (base de données, auth, helpers)
├── types/                  ← Les types TypeScript partagés
└── public/                 ← Fichiers statiques (images, favicon)
```

**Règle simple :** un dossier dans `app/` = une page du site. Le fichier `page.tsx` dans ce dossier = le contenu de la page.

## Tâches disponibles

Choisis celle qui t'intéresse — pas besoin de suivre l'ordre. Demande à Claude "je veux faire la tâche X" et il te guidera pas à pas.

### Niveau Facile

| # | Tâche | Description | Ce que tu vas apprendre |
|---|---|---|---|
| 1 | **Landing page** | Créer la page d'accueil avec présentation d'eSimplu et liens vers les sections | Composants React, JSX, Tailwind CSS |
| 2 | **Header / Navigation** | Menu responsive avec logo, liens vers les pages, sélecteur de pays | Composants, props, responsive design |
| 3 | **Footer** | Pied de page avec liens utiles, copyright, réseaux sociaux | Composants réutilisables |
| 8 | **Page login (design)** | Améliorer le design de la page de connexion (boutons Google/Facebook) | Formulaires, styling |

### Niveau Moyen

| # | Tâche | Description | Ce que tu vas apprendre |
|---|---|---|---|
| 4 | **Page articles** | Liste d'articles avec des cards (image, titre, extrait). Données mock. | State, map(), composants cards |
| 5 | **Page article détail** | Affichage d'un article complet quand on clique dessus | Routing dynamique (`[slug]`), paramètres d'URL |
| 6 | **Page services** | Répertoire de services avec filtres par catégorie | State, filtrage, événements |
| 9 | **Page marketplace** | Grille de produits avec images et prix. Données mock. | Grilles CSS, composants cards |
| 10 | **Page delivery** | Liste de trajets avec filtres départ/arrivée. Données mock. | Filtres multiples, state complexe |

### Niveau Moyen+

| # | Tâche | Description | Ce que tu vas apprendre |
|---|---|---|---|
| 7 | **Formulaire proposer un service** | Formulaire avec validation (nom, catégorie, ville, téléphone...) | Formulaires, validation, state |

## Données mock

En attendant que le backend soit prêt, on utilise des **données fictives** (mock data). C'est un fichier `lib/mock-data.ts` avec des tableaux d'objets.

Exemple :
```typescript
// lib/mock-data.ts

export const mockArticles = [
  {
    id: "1",
    title: "Cum să faci o mutuelle în Franța",
    slug: "cum-sa-faci-mutuelle-franta",
    excerpt: "Ghid complet pentru alegerea unei mutuelle...",
    coverImage: "/placeholder.jpg",
    countries: ["fr"],
    published: true,
    createdAt: new Date("2026-01-15"),
  },
  // ... plus d'articles
]
```

Quand tu crées une page, tu importes les données mock :
```typescript
import { mockArticles } from "@/lib/mock-data"
```

Plus tard, on remplacera ces imports par des appels à la base de données.

## Comment travailler avec Claude

1. Dis à Claude quelle tâche tu veux faire : "Je veux faire la tâche 4 — page articles"
2. Claude t'explique le contexte et les concepts nécessaires
3. Claude te pose des questions pour vérifier que tu as compris
4. Vous codez ensemble, étape par étape
5. Claude t'explique chaque bloc de code
6. Tu testes dans le navigateur (http://localhost:3000)
7. Quand c'est bon, tu commit :
   ```bash
   git add -A
   git commit -m "feat: add articles page"
   git push
   ```

**N'hésite pas à demander :**
- "C'est quoi un composant ?"
- "Pourquoi on fait ça ?"
- "Je comprends pas cette ligne"
- "Montre-moi un exemple plus simple"

Claude est là pour t'expliquer, pas juste pour coder à ta place.
