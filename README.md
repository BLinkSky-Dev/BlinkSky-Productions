# BlinkSky Productions — Studio Portfolio

A cinematic, dark-mode portfolio site for a photography & videography studio.
Built with **Vite + React**, **Tailwind CSS**, and **Framer Motion**.

Sections: Hero → Services → Portfolio (filterable + lightbox) → Instagram feed
→ About → Contact → Footer.

---

## Quick start

```bash
cd BlinkSky-Productions
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).
Build for production with `npm run build`; preview it with `npm run preview`.

The site works offline with **saved studio shots** in `public/gallery/`.
Connect Instagram (below) for a live feed; otherwise those local folders are used.

---

## 1. Your logo

The header/footer currently use a text wordmark (`src/components/Logo.jsx`).
To use the real logo:

1. Drop the file in `public/` (e.g. `public/logo.svg` or `logo.png`).
2. In `src/components/Logo.jsx`, replace the `<span>`/`<svg>` block with:
   ```jsx
   <img src="/logo.svg" alt="BlinkSky Productions" className="h-9" />
   ```

> Note: the logo image originally attached came through blank, so this wordmark
> is a stand-in until the real file is added.

## 2. Your photos

When the Instagram API is unavailable, the site loads local folders:

| Section | Folder |
|--------|--------|
| **Selected Work** | `public/gallery/selected-work/` |
| **Latest on Instagram** | `public/gallery/instagram/` |
| **Services (What We Shoot)** | `public/gallery/services/<category>/` — one folder per shoot type (`wedding`, `bridal`, `model`, `birthday`, `commercial`, `graduation`). `01.jpg` is the accordion thumb. |

Drop JPGs/PNGs/WebPs into those folders (prefer `01.jpg`, `02.jpg`, …), then run:

```bash
npm run gallery:refresh
```

That rebuilds each folder’s `meta.json` so the site picks up new files.

To refresh from live Instagram (needs `.env` credentials):

```bash
npm run gallery:download
```

Service names and blurbs live in `src/data/services.js`.
Contact details and all social links (email, phone, Instagram, Facebook,
TikTok) live in **one file** — `src/data/socials.js`. Edit there and the nav,
Instagram section, contact list and footer all update.

### Brand / "trusted by" logos (auto-updating)

The **Brands We've Worked With** wall reads every image in
`src/assets/brands/`. **To add a new client logo, just drop the file in that
folder** — it appears automatically, no code changes. The brand name is taken
from the filename (`DERMA DREAM.png` → "Derma Dream"). Each tile detects whether
its logo is light or dark and picks a dark or light background so white logos
never disappear. Transparent PNGs look best.

---

## 3. Instagram Graph API (live feed)

The Instagram / Selected Work sections use saved local gallery images until you connect the API. Two ways:

### Option A — direct (quickest, token ships to browser)

1. **Convert the account** to a *Business* or *Creator* account and link it to a
   Facebook Page (Instagram app → Settings → Account type).
2. Go to [developers.facebook.com](https://developers.facebook.com/) → **My Apps**
   → **Create App** → type *Business*.
3. Add the **Instagram Graph API** product.
4. Use the **Graph API Explorer** (or the Instagram Basic Display / Graph flow)
   to generate a **long-lived access token** and find your **Instagram user id**.
   - Long-lived tokens last ~60 days and can be refreshed.
5. Create a `.env` file in the project root (copy `.env.example`):
   ```
   VITE_IG_ACCESS_TOKEN=your_long_lived_token
   VITE_IG_USER_ID=1784xxxxxxxxxxxxx
   ```
6. Restart `npm run dev`. Your latest posts now render live.

> A `VITE_` token is visible in the browser bundle. That's acceptable for a
> read-only display token, but Option B is safer for production.

### How Instagram posts get sorted into categories

**The Instagram API returns no category.** A post comes back with only an id,
caption, media type, media/thumbnail URL, permalink and timestamp — there is no
"this is a wedding" field, and Instagram exposes no albums or collections
through the API.

So the site reads **your caption**. Rules live in
`src/data/instagramCategories.js` and match hashtags *or* plain words
(case-insensitive — `#wedding` and `wedding` both count):

| Category | Matches captions containing |
|---|---|
| Bridal | bridal, bride, gettingready, bridalportrait |
| Wedding | wedding, nikah, homecoming, engagement, vows |
| Model | model, portfolio, editorial, fashion, portrait |
| Commercial | commercial, brand, product, campaign, corporate |
| Birthday | birthday, bday, cakesmash, party |
| Coming of Age | puberty, comingofage, samayasadangu, ceremony |
| Film | reel, film, cinematic, video, teaser, highlight |

Order matters — first match wins, and **bridal is checked before wedding** so
bridal posts aren't swallowed by the word "wedding".

**In practice:** categorisation is only as good as your captions. Post a bridal
shoot with `#bridal` and it files itself. Anything matching nothing falls back
to **"More Work"** (an uncaptioned video falls back to **Film**). Add or edit
keywords in that file at any time — no other code changes needed.

> Not retroactive: older posts with unhelpful captions will sit in "More Work"
> until those captions are edited on Instagram.

### Option B — serverless proxy (recommended for production)

Keeps the token server-side. A ready-made handler is included at
`api/instagram.js` (works on Vercel / Netlify Functions).

1. Deploy the project to Vercel (or Netlify).
2. In the host dashboard, set **server** env vars (no `VITE_` prefix):
   ```
   IG_ACCESS_TOKEN=your_long_lived_token
   IG_USER_ID=1784xxxxxxxxxxxxx
   ```
3. In `.env`, set only:
   ```
   VITE_IG_PROXY_URL=/api/instagram
   ```
4. The frontend now calls your proxy; the token never reaches the browser, and
   responses are edge-cached for 10 minutes.

**Token refresh:** long-lived tokens expire (~60 days). For a set-and-forget
setup, add a scheduled job that calls the Graph API refresh endpoint, or use a
managed embed service (Behold.so, EmbedSocial) if you'd rather not maintain it.

---

## Deploying to Vercel (live, secure Instagram feed)

1. Push the repo to GitHub (already done).
2. At [vercel.com](https://vercel.com), **Sign up → Continue with GitHub** (free).
3. **Add New → Project → Import** `BlinkSky-Productions`. Vercel auto-detects
   Vite — don't change the build settings.
4. Before deploying, open **Environment Variables** and add these three:

   | Name | Value | Notes |
   |------|-------|-------|
   | `IG_ACCESS_TOKEN` | your long-lived token | server-only — stays private |
   | `IG_USER_ID` | `me` | server-only |
   | `VITE_IG_PROXY_URL` | `/api/instagram` | tells the site to use the proxy |

   **Do NOT add `VITE_IG_ACCESS_TOKEN`** — a `VITE_` variable is baked into the
   public site. The un-prefixed `IG_ACCESS_TOKEN` lives only on the server.
5. Click **Deploy**. The `api/instagram.js` function serves the feed server-side,
   so the token is never exposed to visitors. New posts appear within ~1 minute.

**Token renewal (~every 50–60 days):** generate/refresh a token and update
`IG_ACCESS_TOKEN` in Vercel's settings — no code change, no redeploy of code.
The refresh needs only the current token (no App Secret). This can be automated
with a scheduled function later.

## 4. Make the contact form send for real (optional)

The form currently opens the visitor's email app pre-filled (no backend needed).
To capture submissions instead, point it at a service like
[Formspree](https://formspree.io/) or a serverless function — replace the
`mailto:` logic in `handleSubmit` inside `src/components/Contact.jsx`.

---

## Tech notes

- **Accessibility:** semantic landmarks, keyboard-navigable lightbox (Esc / ← →),
  visible focus rings, alt text, and `prefers-reduced-motion` handling.
- **Performance:** images lazy-load with a shimmer skeleton; the hero image is
  prioritized. Swap in WebP/AVIF versions of your photos for best results.
- **Responsive:** tested layouts at 375 / 768 / 1024 / 1440 px.

## Project structure

```
public/gallery/
  selected-work/   Saved Selected Work (API fallback)
  instagram/       Saved Latest Instagram (API fallback)
  services/        Service card images
scripts/           gallery:download / gallery:refresh
src/
  components/      UI sections (Hero, Services, Portfolio, InstagramFeed, …)
  data/            services.js, socials.js, localGalleries.js, …
  hooks/           useInstagramFeed.js, useReveal.js
api/               instagram.js  ← optional serverless proxy
```
