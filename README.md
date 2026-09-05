# Magic Auto

Showroom automobile, lavage, entretien et esthétique — site vitrine + espace
d'administration.

The project is a monorepo with two independent apps:

- **`frontend/`** — React 19 + Vite + Tailwind (public site + admin dashboard)
- **`backend/`** — Express + Prisma (PostgreSQL) REST API, organized MVC-style

```text
magic-auto/
  frontend/   # React app (Vite dev server, port 5173)
  backend/    # Express API (port 4000)
```

## Prerequisites

- Node.js 18+
- A PostgreSQL database — the easiest path is the included
  `docker-compose.yml` (requires Docker Desktop running), but a local
  install or a hosted instance (Neon/Supabase/Railway) works too.

## 0. Start Postgres (Docker)

From the repo root:

```bash
docker compose up -d
```

This starts a `postgres:16` container on `localhost:5433` with a database
named `magic_auto` (user/password: `magic_auto`/`magic_auto`), matching the
default `DATABASE_URL` in `backend/.env.example`. Data persists in a Docker
volume across restarts. If you already have Postgres running elsewhere,
skip this and point `DATABASE_URL` (step 2) at your own instance instead.

## 1. Install dependencies

From the repo root (this installs both `frontend/` and `backend/` via npm
workspaces):

```bash
npm install
```

## 2. Configure environment variables

Copy the example env files and fill in your own values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

`backend/.env`:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgresql://magic_auto:magic_auto@localhost:5433/magic_auto` (matches `docker compose up -d`) |
| `JWT_SECRET` | Secret used to sign admin session tokens |
| `PORT` | Port the API listens on (default `4000`) |
| `CORS_ORIGIN` | URL allowed to call the API (the frontend's URL) |

`frontend/.env`:

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Base URL of the backend API (default `http://localhost:4000`) |

## 3. Set up the database

The Prisma schema and an initial migration are already included
(`backend/prisma/schema.prisma`, `backend/prisma/migrations/`). Once
`DATABASE_URL` points at a real, empty Postgres database, run:

```bash
npm run prisma:migrate
```

This applies the migration and creates the `users`, `vehicles`, `services`,
`appointments`, `messages`, `reviews`, and `settings` tables.

Then seed some initial data (a super-admin account, sample vehicles and
services):

```bash
npm run seed
```

This creates a super-admin user:

- **username:** `AdminMagic`
- **password:** `AdminMagic`

Change this password after your first login.

## 4. Run the app

From the repo root, run both the frontend and backend together:

```bash
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:4000](http://localhost:4000)
- Admin dashboard: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

Or run them independently:

```bash
npm run dev:frontend   # just the React app
npm run dev:backend    # just the Express API
```

## Other useful commands

| Command | Description |
| --- | --- |
| `npm run build` | Build both apps for production |
| `npm run lint` | Type-check both apps (`tsc --noEmit`) |
| `npm run prisma:generate` | Regenerate the Prisma client after schema changes |
| `cd backend && npx prisma studio` | Open Prisma Studio to browse the database |

## Project structure

### `backend/` (MVC)

```text
backend/
  prisma/
    schema.prisma       # data model
    migrations/          # SQL migrations
    seed.ts               # seed script
  src/
    server.ts             # entrypoint, starts the HTTP server
    app.ts                  # Express app wiring (middleware, routes)
    config/                 # env loading, Prisma client singleton
    middleware/             # auth (JWT), upload (multer)
    controllers/             # one file per resource (vehicles, services, ...)
    routes/                   # public.routes.ts, admin.routes.ts
    utils/                     # JWT helpers
```

### `frontend/`

```text
frontend/
  src/
    main.tsx, App.tsx, index.css
    components/          # layout (Navbar, Footer, AdminLayout) + ui
    pages/                 # public pages
    pages/admin/            # admin dashboard pages
    lib/api.ts               # API_BASE_URL, apiUrl(), adminFetch()
```

## Deploying

Build both apps (`npm run build`), then run the backend with
`node backend/dist/server.js` (after `npm run prisma:deploy` to apply
migrations on the production database) and serve `frontend/dist` as a static
site. Since the two are separate origins, remember to set `CORS_ORIGIN` on
the backend to the frontend's production URL, and `VITE_API_URL` on the
frontend to the backend's production URL at build time.
