# 🌐 How to Deploy ZedWhisper on InfinityFree (100% Free Hosting)

InfinityFree provides free web hosting with PHP, MySQL, unlimited bandwidth, and cPanel (VistaPanel). Here is the complete step-by-step guide to deploy **ZedWhisper** on InfinityFree with database storage and user authorization.

---

## 1. Prerequisites (Free Accounts)

1. **InfinityFree Account**: Sign up free at [infinityfree.com](https://www.infinityfree.com/).
2. **Supabase Account (Database & Auth)**: Your project is already registered at `https://rflxrnpmmnkwnfgwldma.supabase.co`.
3. **Node.js**: Installed locally to run `npm run build`.

---

## 2. Build the Production Files

Inside your project folder, compile the production assets:

```bash
npm run build
```

This generates a optimized, lightweight static bundle inside the **`dist/`** directory. It already includes:
- `index.html`
- `assets/` (bundled JS and CSS)
- `.htaccess` (pre-configured for Apache client-side routing and HTTPS on InfinityFree)

---

## 3. Create an InfinityFree Hosting Account

1. Log in to [InfinityFree Client Area](https://dash.infinityfree.com/).
2. Click **Create Account**.
3. Choose a free domain name (e.g., `zedwhisper.great-site.net` or `zedwhisper.epizy.com`) or connect your custom `.zm` or `.com` domain.
4. Complete the account setup and wait ~1 minute for status to turn **Active**.

---

## 4. Upload Files to InfinityFree `htdocs/`

There are two easy methods to upload:

### Method A: Web File Manager (Monsta FTP) — Fastest
1. In your InfinityFree Dashboard, click **File Manager** (or go to [filemanager.ai](https://filemanager.ai/)).
2. Open the **`htdocs/`** directory.
3. Delete the default placeholder files (`DO NOT UPLOAD FILES HERE` or `index2.html`).
4. Upload all files and folders from inside your local **`dist/`** directory directly into `htdocs/`:
   - `index.html`
   - `assets/` (folder with JS and CSS)
   - `.htaccess` (makes all routes and refreshes work smoothly without 404s)

### Method B: FileZilla (FTP)
- Host: `ftpupload.net`
- Username: Your InfinityFree vPanel username (e.g. `epiz_34567890`)
- Password: Your InfinityFree vPanel password
- Port: `21`
- Remote Directory: `/htdocs/`

---

## 5. Connecting Database & Authorization

You have two powerful options:

### Option A: Use Supabase (Recommended — Real-Time WebSocket Multi-Phone Sync)
Because ZedWhisper uses client-side Supabase SDK (`@supabase/supabase-js`), your InfinityFree static site connects directly to Supabase via HTTPS REST and WebSockets:
1. Open your Supabase Dashboard at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** -> **New Query**.
3. Paste the contents of `supabase-schema.sql` (found in your project root) and click **Run**.
4. To enable **Supabase Authentication**:
   - Go to **Authentication** -> **Providers** -> **Email**.
   - Make sure **Enable Email provider** is toggled ON.
   - (Optional) Toggle **Confirm email** OFF if you want students to sign up and whisper immediately without waiting for confirmation emails.
5. All students opening your InfinityFree URL will instantly read, post, and sync whispers across Airtel, MTN, and Zamtel networks!

### Option B: Use InfinityFree's Built-in Free MySQL Database
If you also want local MySQL database storage on InfinityFree:
1. In InfinityFree Control Panel (VistaPanel), click **MySQL Databases**.
2. Create a database named `epiz_xxxx_zedwhisper`.
3. Note your MySQL Details:
   - MySQL Host: e.g. `sqlxxx.epizy.com`
   - MySQL User: `epiz_xxxx`
   - MySQL Password: Your vPanel password
   - MySQL Database: `epiz_xxxx_zedwhisper`
4. Click **phpMyAdmin** to inspect or import tables.

---

## 6. Enable Free SSL (HTTPS)

1. In your InfinityFree dashboard, click **Free SSL Certificates**.
2. Click **New SSL Certificate**.
3. Enter your domain name and select **Let's Encrypt** or **ZeroSSL**.
4. Follow the 1-click DNS CNAME verification.
5. Once issued, click **Install SSL Certificate Automatically**.
6. The included `.htaccess` file will automatically enforce HTTPS for all visiting students!

---

## 7. Verification Checklist

- [x] Visiting your InfinityFree URL loads the ZedWhisper campus wordmark and header.
- [x] Clicking **Campus Buzz**, **Saved Whispers**, **Map**, or **Events** loads each view without 404 errors.
- [x] In-person WhatsApp connect button (`wa.me`) launches chat without exposing phone numbers.
