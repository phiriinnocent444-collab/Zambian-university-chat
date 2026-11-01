# ZedWhisper — Supabase Central Hosting & Multi-Device Sync Guide

This document outlines how ZedWhisper connects to **Supabase** for real-time central database storage across all Zambian universities.

---

## 1. Connected Supabase Project Credentials

Your Supabase project is configured with the following parameters:

- **Project URL:** `https://rflxrnpmmnkwnfgwldma.supabase.co`
- **Project Reference:** `rflxrnpmmnkwnfgwldma`
- **Client Anon / Publishable Key:** `sb_publishable_yPHTFGSZev1yGACMZQsEgQ_zBLDIJRE`
- **Environment variables in `.env.example`:**
  - `VITE_SUPABASE_URL="https://rflxrnpmmnkwnfgwldma.supabase.co"`
  - `VITE_SUPABASE_ANON_KEY="sb_publishable_yPHTFGSZev1yGACMZQsEgQ_zBLDIJRE"`

---

## 2. One-Click Database Schema Setup

To activate live multi-device sharing across phones and student accounts:

1. Open your [Supabase Dashboard](https://supabase.com/dashboard/project/rflxrnpmmnkwnfgwldma/sql/new).
2. Click **SQL Editor** in the left sidebar and click **New Query**.
3. Copy the complete SQL script from `supabase-schema.sql` (or click **Supabase** in the top navigation bar of the app and click **Copy Script**).
4. Paste it into the SQL Editor and click **Run** (or `Ctrl+Enter` / `Cmd+Enter`).

### What the SQL Schema creates:
- `public.posts`: Shared campus activity updates, sports live updates, lost & found, news, and anonymous whispers.
- `public.comments`: Central comments for every post.
- `public.messages`: 1-on-1 direct whisper messages between students across devices.
- `public.profiles`: Student anonymous aliases and karma points.
- `public.reports`: Community moderation reports for cyber safety.
- **Row Level Security (RLS):** Safe permissions configured for client-side queries.
- **Realtime publication:** `alter publication supabase_realtime add table public.posts, public.comments, public.messages;` to push instant updates without page refresh.

---

## 3. Real-Time Multi-Device Interaction

- **Multi-Device Sync:** When a student on Phone A posts an update (e.g. UNZA basketball finals live score or NIPA gala), Supabase Realtime broadcasts the new post directly to Phone B and all other connected browsers within milliseconds.
- **100% Real Student Interactions:** Fake bot auto-replies have been permanently removed. All whispers and campus treats are exchanged between real users.
- **Offline / Initial Fallback:** If the database tables have not yet been initialized in your Supabase SQL editor, the app seamlessly serves verified initial campus updates and local caching so the app remains 100% interactive and never shows blank screens.

---

## 4. Hosting on Supabase / Netlify / Vercel

To deploy to Netlify or Supabase-hosted frontends:

```bash
# 1. Install dependencies
npm install

# 2. Build production assets
npm run build

# 3. Deploy the dist/ folder to Netlify, Vercel, or any static hosting provider.
```

In your hosting provider's Environment Variables settings, configure:
- `VITE_SUPABASE_URL`: `https://rflxrnpmmnkwnfgwldma.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: `sb_publishable_yPHTFGSZev1yGACMZQsEgQ_zBLDIJRE`
