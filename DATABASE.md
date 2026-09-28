# PostgreSQL Setup (Neon or Render)

The database can be hosted on either **Neon** or **Render Postgres**. The steps below note where the two differ.

## Prerequisites

A PostgreSQL instance must be running on Neon or Render. Once set up:

1. Extract `Database Files` and move `equipmentdb_postgres.sql` to `/migration`
2. Run `python migration.py` — you may need to install missing libraries, if any.

Seed data should now be present on the remote database.

> **Note (Render):** Free tier instances suspend after 1 month of inactivity

> **Note (Neon):** Free tier compute auto-suspends when idle and wakes on the next connection, so expect a brief cold start

## 1. Database Connection

| Provider | Connection string |
|----------|-------------------|
| Render | **Internal Database URL** from the Render Postgres dashboard (only works if your server is on Render in the same region) |
| Neon | Connection string from the Neon dashboard (**Connect** button), ending in `?sslmode=require` |

## 2. Pool Configuration

```typescript
const db = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    connectionString: process.env.DB_URL,
    ssl: { rejectUnauthorized: false }
})
```

> **Render:** `rejectUnauthorized: false` is required — Render uses a self-signed certificate.
> **Neon:** Uses a valid certificate, so `ssl: true` also works.

## 3. Environment Variables

Set these in your Render web service under **Environment**:

| Variable | Value |
|----------|-------|
| `DB_URL` | Render: `postgresql://username:xxxyyyyzzzz@dpg-abcd1234efg-a/sampledb_9xxab?sslmode=no-verify` |
| `DB_URL` | Neon: `postgresql://username:xxxyyyyzzzz@ep-example-123456.region.aws.neon.tech/sampledb?sslmode=require` |

> Render: `?sslmode=no-verify` is needed to bypass SSL issues.
> Neon: `?sslmode=require` is needed.

Any other secrets (e.g. Firebase, JWT) must also be added here — they are **not** read from `.env` files in production.

## 4. Build & Start Commands

In your Render web service settings:

| Setting | Value |
|---------|-------|
| Build Command | `npm install && npm run build` |
| Start Command | `node dist/server.js` |

Ensure your `package.json` has:

```json
"scripts": {
  "build": "tsc -p ."
}
```

## 5. Deploying Changes

Render runs from the compiled `dist/` folder. After any code changes:

- Push to your connected Git branch (if auto-deploy is on), or
- Manually trigger via **Dashboard → Manual Deploy → Deploy latest commit**