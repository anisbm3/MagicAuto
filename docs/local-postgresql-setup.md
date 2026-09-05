# Using a Locally Installed PostgreSQL (No Docker)

Use this instead of `docker compose up -d` if you already have PostgreSQL
installed on your machine (or want to install it directly, without Docker).

## 1. Install PostgreSQL (skip if already installed)

**Windows:**

1. Download the installer from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/).
2. Run it. When prompted:
   - Set a password for the `postgres` superuser — remember it.
   - Keep the default port `5432`.
   - You can uncheck Stack Builder at the end.
3. The installer starts the Postgres service automatically (Windows Service
   named `postgresql-x64-<version>`).

**macOS (Homebrew):**

```bash
brew install postgresql@16
brew services start postgresql@16
```

**Linux (Debian/Ubuntu):**

```bash
sudo apt-get install postgresql
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 2. Confirm the server is running

```bash
pg_isready
```

Should print something ending in `accepting connections`.

## 3. Point the backend at it

Copy the example env file if you haven't already:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and set `DATABASE_URL` to your local instance, using the
default port `5432` (not `5433`, which is only used by the Docker Compose
setup), the `postgres` superuser, and the password you set during install:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/magic_auto"
```

`magic_auto` is just the database name — it doesn't need to exist yet.
Prisma creates it automatically in the next step.

## 4. Run the migration and seed

From the repo root:

```bash
npm install
npm run prisma:migrate
npm run seed
```

`prisma:migrate` creates the database (if needed) and the tables (`users`,
`vehicles`, `services`, `appointments`, `messages`, `reviews`, `settings`).
`seed` inserts a super-admin account (`AdminMagic` / `AdminMagic`) plus
sample vehicles and services.

## 5. Run the app

```bash
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:4000](http://localhost:4000)
- Admin login: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `P1001: Can't reach database server at localhost:5432` | Postgres isn't running — start the service (Windows: Services app → `postgresql-x64-<version>` → Start; macOS: `brew services start postgresql@16`; Linux: `sudo systemctl start postgresql`). |
| `password authentication failed` | The username/password in `DATABASE_URL` don't match the `postgres` role's actual password. |
| Port `5432` already in use by another Postgres/Docker container | Either stop the other instance, or run this Postgres on a different port and update `DATABASE_URL` accordingly. |
