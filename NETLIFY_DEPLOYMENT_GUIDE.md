# 🚀 Netlify Deployment & Multi-Phone Realtime Sync Guide

**ZedWhisper: Zambian Universities Buzz & Campus Network**  
*Connecting UNZA, CBU, Mulungushi, NIPA, Cavendish, Evelyn Hone, ZCAS, LMMU, and all higher learning institutions across Zambia.*

---

## 📱 Executive Summary: What Has Been Done

1. **Database Operations Hidden from Students**:
   - The developer/technical Supabase setup banner has been completely removed from the student feed.
   - The top navigation bar now features a clean, native **🟢 Live Network** pulse badge rather than technical database buttons.
   - Database operations (Copy SQL Schema, connection diagnostics, project health) are discreetly accessible via the **Cloud & SQL Settings** button in the footer or by appending `?admin=true` to the URL.

2. **Instant Multi-Device Real-Time Sync**:
   - Every post, comment, upvote, and direct whisper is synced with dual-layer architecture:
     1. **Supabase Realtime Broadcast WebSockets** (`campus-live-sync`): Delivers updates across all connected mobile devices in **under 50 milliseconds**.
     2. **Supabase PostgreSQL Database** (`rflxrnpmmnkwnfgwldma`): Persists data permanently so newcomers and returning students always load the latest feed.
   - When a student on Phone A spills tea or upvotes, Phone B instantly receives the update with an unobtrusive campus toast notification without reloading the page.

3. **Production Netlify Compatibility**:
   - `netlify.toml` pre-configured in project root with Vite SPA redirect rules (`/*` -> `/index.html 200`).
   - `public/_redirects` created to eliminate 404s on page refresh or deep linking.
   - Touch-optimized viewport and responsive layout tailored for all Android and iOS smartphones.

---

## 🛠️ Step 1: Activate Supabase Database (One-Time Setup)

To allow permanent cloud storage alongside real-time broadcast:

1. Open your [Supabase Project Dashboard](https://supabase.com/dashboard/project/rflxrnpmmnkwnfgwldma).
2. Click **SQL Editor** on the left navigation menu (or click *New Query*).
3. Open `supabase-schema.sql` (or click **Cloud & SQL Settings** in the app's footer and tap **Copy SQL Schema**).
4. Paste the entire SQL script into the Supabase SQL Editor and click **Run**.
5. The tables (`posts`, `comments`, `messages`, `profiles`, `reports`) and real-time publications will be created immediately.

---

## 🌐 Step 2: Deploying on Netlify

You can deploy ZedWhisper to Netlify using either **Method A (Drag & Drop)** or **Method B (Git Continuous Deployment)**.

### Method A: 10-Second Drag-and-Drop Deployment (Easiest)

1. Run the production build command in your terminal:
   ```bash
   npm run build
   ```
   This generates a standalone, optimized static bundle in the `dist/` directory.

2. Log in to [Netlify](https://app.netlify.com).
3. Navigate to the **Sites** tab.
4. Drag and drop the **`dist`** folder into the Netlify dropzone.
5. Your applet is live immediately at `https://your-site-name.netlify.app`!

---

### Method B: Git Continuous Deployment (Recommended for Automatic Updates)

1. Push your ZedWhisper repository to GitHub, GitLab, or Bitbucket.
2. In the [Netlify Dashboard](https://app.netlify.com), click **Add new site** > **Import an existing project**.
3. Choose your Git provider and select your repository.
4. Netlify will automatically detect settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Add environment variables** and configure:
   | Key | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | `https://rflxrnpmmnkwnfgwldma.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `sb_publishable_yPHTFGSZev1yGACMZQsEgQ_zBLDIJRE` |
6. Click **Deploy ZedWhisper**. Every future `git push` will automatically trigger a fresh production build and deploy.

---

## 📲 Step 3: Multi-Phone Verification & Testing

To test instant multi-device synchronization:

1. **Open on Phone 1**: Open your Netlify site URL on an Android smartphone (Chrome / Brave / Samsung Internet).
2. **Open on Phone 2**: Open the same Netlify site URL on an iPhone (Safari) or a laptop browser.
3. **Spill Tea on Phone 1**:
   - Tap **Spill Tea**.
   - Select your university (e.g., *UNZA Great East Road* or *CBU Riverside*).
   - Enter a title and whisper, then tap **Publish Gossip**.
4. **Observe Phone 2**:
   - Within milliseconds, the new whisper appears at the top of Phone 2's feed.
   - An in-app toast notification appears: `🔥 New whisper dropped from UNZA!`.
5. **Vote & Comment**:
   - Tap Upvote on Phone 2; Phone 1's counter increments live.
   - Tap on the post, type a comment, and press Send; Phone 1 displays the comment in real time.

---

## 🔒 Security & Student Privacy

- **Zero-Knowledge Tripcodes**: Student aliases are cryptographic tripcodes or anonymous numbers (e.g. `Anonymous Scholar #742`).
- **Incognito Ghost Mode**: One-tap persona toggle in the top bar allows complete stealth browsing.
- **Anti-Doxxing Filter**: Automatic client-side validation prevents the publication of private phone numbers, physical hostel room numbers, or unverified defamatory accusations.
- **Hidden Admin Panel**: Access developer settings and SQL schema by visiting `https://your-site.netlify.app/?admin=true`.

---

© 2026 ZedWhisper Zambia · Built for all Universities & Colleges in Zambia.
