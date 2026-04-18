# FlowState Experiences — Setup Guide

## Stack
- Next.js 15 (App Router) + TypeScript
- Supabase (Postgres database)
- Vercel (deployment)
- Fonts: Bebas Neue + DM Sans

---

## 5-Minute Setup

### Step 1 — Supabase
1. Go to supabase.com → New project
2. Open SQL Editor → paste contents of `supabase/schema.sql` → Run
3. Go to Settings → API → copy your URL and keys

### Step 2 — Environment variables
Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 3 — Run locally
```bash
npm install
npm run dev
```
- Public site: http://localhost:3000
- Admin portal: http://localhost:3000/admin

### Step 4 — Deploy to Vercel
```bash
npx vercel
```
Add the 3 env vars in Vercel → Settings → Environment Variables

---

## Site Map
| URL | Purpose |
|-----|---------|
| `/` | Public homepage |
| `/experiences/[slug]` | Individual activation pages |
| `/admin` | Dashboard |
| `/admin/inquiries` | CRM — all leads |
| `/admin/experiences` | Add/edit activations |
| `/admin/cities` | City portfolio |
| `/admin/testimonials` | Social proof |
| `/admin/settings` | Hero copy + stats |

---

## Admin Features
- **Inquiries CRM**: See every lead, update status (new/contacted/proposal sent/won/lost), add internal notes, reply via email
- **Experiences**: Add/edit/publish all 12+ activation types
- **Cities**: Track events + participant counts per city
- **Testimonials**: Add quotes, control which are featured
- **Settings**: Edit hero copy, homepage stats (65+, 330K+, etc.), company info

## Phase 2 Recommendations
- Supabase Auth for admin password protection
- Supabase Storage for image uploads in admin
- Email notifications on new inquiry (Resend — free 3K/month)
- PDF proposal generator
