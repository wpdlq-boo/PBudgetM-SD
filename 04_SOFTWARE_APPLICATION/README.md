# WAIS — Personal Budget Manager

A Wise Assistant for Insightful Spending. CPE 304/304L Software Design, Group 3A · G7.

WAIS requires a category for every expense, rewards daily logging with a streak, and shows where money goes through a budget guard, category limits, a donut summary and a daily spending heatmap.

## Tech stack

| Part | Technology |
| --- | --- |
| Front end | Vanilla JavaScript + Vite 6 (single-page app, `src/main.js`) |
| Styles | Plain CSS (`src/styles.css`), phone layout < 768 px, sidebar layout ≥ 768 px |
| Accounts & cloud data | Supabase (Google OAuth, Postgres with row-level security) |
| Guest mode | Browser `localStorage` only — nothing is uploaded |
| Hosting | Vercel (static build + `api/keepalive.js` serverless function) |

## Run locally

```bash
npm install
cp .env.example .env      # fill in your Supabase URL and anon key (optional)
npm run dev               # http://localhost:5173
```

Without Supabase keys the app still works in "Use Without An Account" mode.

## Set up Supabase

1. Create a project at supabase.com.
2. SQL Editor → paste `supabase/schema.sql` → Run.
3. Authentication → Providers → Google → enable (needs a Google Cloud OAuth client).
4. Authentication → URL Configuration → Site URL = your Vercel URL; add it and `http://localhost:5173` to Redirect URLs.

## Deploy to Vercel

1. Import this GitHub repository in Vercel (framework: Vite).
2. Settings → Environment Variables: `VITE_SUPABASE_URL` (e.g. `https://abcd.supabase.co`) and `VITE_SUPABASE_ANON_KEY`.
3. Redeploy after changing variables — Vite bakes them in at build time.

Optional: add the same two values as GitHub Actions secrets so `.github/workflows/keepalive.yml` pings Supabase every 6 hours.

## Project files

```
index.html               App shell
src/main.js              Screens, state, PIN, sync logic
src/styles.css           Design tokens and responsive layout
src/supabaseClient.js    Supabase client with env-value clean-up
supabase/schema.sql      Tables, row-level security, new-user starter data
api/keepalive.js         Daily Vercel cron that keeps Supabase awake
vercel.json              Build, SPA rewrite and cron settings
```
