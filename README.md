# eSimplu

Platform for the Romanian/Moldovan diaspora in Europe — articles, service directory, marketplace, and delivery.

## Quick Start

### Prerequisites

- Node.js >= 20
- Docker (for PostgreSQL)

### Setup

```bash
# 1. Clone the repo
git clone git@github.com:ionMoraru/esimplu.git
cd esimplu

# 2. Install dependencies
npm install

# 3. Start PostgreSQL
docker compose up -d

# 4. Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values (see Environment Variables below)

# 5. Run database migrations
npx prisma migrate dev

# 6. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
DATABASE_URL=postgresql://esimplu:esimplu_local@localhost:5432/esimplu

AUTH_SECRET=          # Generate with: npx auth secret
AUTH_GOOGLE_ID=       # Google OAuth client ID
AUTH_GOOGLE_SECRET=   # Google OAuth client secret
AUTH_FACEBOOK_ID=     # Facebook app ID
AUTH_FACEBOOK_SECRET= # Facebook app secret

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Tech Stack

- **Next.js** (App Router) — frontend + API
- **shadcn/ui + Tailwind CSS** — UI components
- **Auth.js** — authentication (Google, Facebook)
- **Prisma** — ORM
- **PostgreSQL** — database

## Architecture

```
Cloudflare (esimplu.com)
└── VPS OVH (Ubuntu 25.04)
    └── Nginx → Next.js → Prisma → PostgreSQL
```

See [CLAUDE.md](./CLAUDE.md) for detailed architecture and design decisions.

## Useful Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `npm run lint` | Run linter |
| `npx prisma studio` | Database GUI |
| `npx prisma migrate dev` | Run migrations |
| `docker compose up -d` | Start PostgreSQL |
| `docker compose down` | Stop PostgreSQL |
| `docker compose down -v` | Stop + delete data |

## Documentation

- **Design spec:** [`docs/superpowers/specs/2026-04-15-restructuration-projet-design.md`](./docs/superpowers/specs/2026-04-15-restructuration-projet-design.md)
- **Archive:** [`docs/archive/`](./docs/archive/) — superseded WordPress-based docs

## Deployment

Push to `main` triggers automatic deployment to VPS via GitHub Actions.

## License

Private repository.
