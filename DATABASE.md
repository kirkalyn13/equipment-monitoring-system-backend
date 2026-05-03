# Render PostgreSQL Setup

## 1. Database Connection

Use the **Internal Database URL** from your Render Postgres dashboard (only works if your server is on Render in the same region).

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

> `rejectUnauthorized: false` is required — Render uses a self-signed certificate.

## 3. Environment Variables

Set these in your Render web service under **Environment**:

| Variable | Value |
|----------|-------|
| `DB_URL` | Internal URL from Render Postgres dashboard e.g. `postgresql://username:xxxyyyyzzzz@dpg-abcd1234efg-a/sampledb_9xxab??sslmode=no-verify` |

> `?sslmode=no-verify` is needed to bypass SSL issues. 

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