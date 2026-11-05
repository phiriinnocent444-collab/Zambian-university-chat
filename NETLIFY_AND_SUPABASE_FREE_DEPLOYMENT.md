# 🚀 Deploying ZedWhisper for Free on Netlify & Supabase

This guide walks you through deploying **ZedWhisper** with zero cost using Netlify (Free Global CDN + Automated HTTPS) and Supabase (Free Tier PostgreSQL + Realtime + Authentication).

---

## 1. Quick Overview (100% Free Tier)

| Service | Tier | Purpose | Cost |
| :--- | :--- | :--- | :--- |
| **Netlify** | Starter Free | Global CDN Web Hosting, Auto-SSL, Git CI/CD | $0 / forever |
| **Supabase** | Free Tier | Shared PostgreSQL Database, Auth, Realtime Sync | $0 / forever |
| **Google Maps** | Free Demo / $200 Monthly Credit | Campus Interactive Maps | $0 |

---

## 2. Setting Up Supabase Database & Authorization

Your app is pre-configured with:
- **Supabase URL**: `https://rflxrnpmmnkwnfgwldma.supabase.co`
- **Publishable Key**: `sb_publishable_yPHTFGSZev1yGACMZQsEgQ_zBLDIJRE`

### Step A: Initialize the Database Schema
1. Open your Supabase Dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Select project `rflxrnpmmnkwnfgwldma`.
3. In the left sidebar, click **SQL Editor** -> **+ New Query**.
4. Open the `supabase-schema.sql` file from your project root, copy everything, paste it into the SQL Editor, and click **Run**.
5. This creates the tables:
   - `public.posts` (student feed and activity updates)
   - `public.comments` (student comments)
   - `public.messages` (1-on-1 private whisper direct messages)
   - `public.profiles` (student verified aliases and karma)
   - `public.reports` (moderation and safety)

### Step B: Enable Free Supabase Authorization
1. In your Supabase Dashboard, click **Authentication** (padlock icon).
2. Go to **Sign In / Providers**.
3. Under **Email**:
   - Ensure **Email provider** is toggled **ON**.
   - (Recommended for campus apps) Under **Email Confirmations**, toggle **Confirm email** **OFF** if you want students to sign in and whisper immediately without having to check an inbox.
4. Go to **URL Configuration**:
   - Set **Site URL** to your Netlify URL (e.g., `https://zedwhisper.netlify.app`).
   - Add `http://localhost:3000` to **Redirect URLs** for local testing.

---

## 3. Deploying to Netlify (Free)

### Method 1: Git Integration (Recommended — Auto-Updates on Push)
1. Push your repository to **GitHub** or **GitLab**.
2. Log in to [Netlify](https://app.netlify.com/).
3. Click **Add new site** -> **Import an existing project** -> **GitHub**.
4. Choose your `zedwhisper` repository.
5. Netlify will auto-detect settings from your pre-configured `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **Deploy Site**.
7. In ~60 seconds, your site is live with a free `https://your-site-name.netlify.app` URL and free SSL!

### Method 2: 1-Click Netlify Drag-and-Drop (No Git Required)
1. Run `npm run build` locally in your terminal.
2. Open your browser and navigate to: [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag the **`dist`** folder directly into the browser window.
4. Your site deploys instantly!

---

## 4. Environment Variables on Netlify

In Netlify Dashboard -> **Site Configuration** -> **Environment Variables**, ensure the following variables are set (they are also pre-defined in `netlify.toml`):

```env
VITE_SUPABASE_URL=https://rflxrnpmmnkwnfgwldma.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_yPHTFGSZev1yGACMZQsEgQ_zBLDIJRE
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBXZOIL2J_UckXJsUmXxQ0NHxRydEIw2Xs
```

---

## 5. Live Multi-Device Sync Verification

Once deployed:
1. Open your Netlify URL on your laptop and on your phone (or share with a peer at UNZA, CBU, or NIPA).
2. In the app, click **Spill Tea** to post a campus update.
3. The whisper will instantly appear on both devices simultaneously via Supabase Realtime WebSockets without needing a page refresh!
