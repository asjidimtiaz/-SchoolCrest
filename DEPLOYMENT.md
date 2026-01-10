# Deployment Guide - SchoolCrest Interactive

## Prerequisites

- Vercel account
- Custom domain: `schoolcrestinteractive.com`
- Supabase project (production instance)

---

## Step 1: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo at [vercel.com](https://vercel.com).

---

## Step 2: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

| Variable                        | Value                              |
| ------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key                      |
| `SUPABASE_SERVICE_ROLE_KEY`     | Your service role key              |

---

## Step 3: Configure Domain

1. Go to Vercel → Settings → Domains
2. Add your root domain: `schoolcrestinteractive.com`
3. Add wildcard subdomain: `*.schoolcrestinteractive.com`

### DNS Settings (at your registrar)

| Type  | Name | Value                  |
| ----- | ---- | ---------------------- |
| A     | @    | `76.76.19.61`          |
| CNAME | \*   | `cname.vercel-dns.com` |

---

## Step 4: Subdomain Routing

Your middleware already handles subdomain routing:

- `knights.schoolcrestinteractive.com` → School "knights"
- `dhthunder.schoolcrestinteractive.com` → School "dhthunder"
- `schoolcrestinteractive.com` → Demo school

Each subdomain automatically resolves to the correct tenant.

---

## Step 5: Supabase Production Setup

1. Create a new Supabase project for production
2. Run all migration SQL files:
   - `master_schema.sql`
   - `super_admin_schema.sql`
   - `fix_schools_rls.sql`
3. Update Vercel environment variables with production keys

---

## Adding New Schools

1. Super Admin → Dashboard → Create New School
2. Enter name and slug (e.g., `oakridge`)
3. School is instantly live at `oakridge.schoolcrestinteractive.com`

**No code changes. No redeploys. Just database.**

---

## Architecture Summary

```
                   *.schoolcrestinteractive.com
                              ↓
                         Vercel Edge
                              ↓
                      Next.js Middleware
                      (resolve subdomain)
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
               Public Kiosk        Admin Panel
               (read-only)         (CRUD)
                    ↓                   ↓
                    └─────────┬─────────┘
                              ↓
                         Supabase
                    (RLS per school_id)
```

One app. One database. Thousands of schools. Fully isolated.
