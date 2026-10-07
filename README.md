# LP Wears website

E-commerce site for LP Wears ([@_lp_originals_](https://www.instagram.com/_lp_originals_/)), a brand of handmade cork-footbed sandals, slides, palms and clogs.

Stack: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 3, sharp, Vercel Blob (store content + uploaded photos), zod.

Live: https://lp-originals.vercel.app (Vercel project `black-88f1/lp-originals`). Redeploy with `vercel deploy --prod` from this folder.

## Run it

```bash
npm install
npm run assets   # downloads the Higgsfield campaign photos into assets/generated (skips files already there)
npm run dev      # http://localhost:3000
```

`npm run photos` re-crops the client's product photos (see below).

## Pages

| Route | What it is |
|---|---|
| `/` | Homepage: hero with product teaser, new-drops carousel, Shop by style flyers, promo, Step Into Comfort, ordering steps, craft details, From the workshop strip, services |
| `/shop` | All styles, filter by category (`/shop?category=cork|slides|clogs`), size guide |
| `/shop/[slug]` | Product page: photo gallery, size picker, add to cart, order on WhatsApp |
| `/gallery` | Masonry gallery with lightbox (keyboard arrows, Esc), Products / Campaign filter |
| `/cart` | Cart (saved in the browser), WhatsApp order message, Paystack button stub |

## Admin dashboard (/admin)

The store owner edits products and prices (add, hide, reorder, photos), hero slides (photos, text, buttons, focus point), the gallery and settings (WhatsApp number and greeting, promo, production time, Instagram) at **/admin**.

- Login: one password, `ADMIN_PASSWORD` (12+ chars), plus `ADMIN_SESSION_SECRET` (32+ chars). Both are Vercel environment variables and live in `.env.local` for local work (git-ignored). Changing the password signs everyone out. Sessions last 12 hours (signed httpOnly cookie, `lib/admin-auth.ts`); `proxy.ts` guards /admin and every server action re-checks (`app/admin/actions.ts`).
- Storage: Vercel Blob store `lp-wears-content` (`BLOB_READ_WRITE_TOKEN`). Each save writes `content/store-<time>.json` (never overwritten: Blob overwrites are eventually consistent); the newest wins, the last 3 are kept. Photos go to `uploads/`, re-encoded by sharp (EXIF/GPS stripped, max 2000px).
- Validation: `lib/content-schema.ts` bounds every field and only allows site paths, #anchors, "whatsapp" or https links, and images from this site or its Blob store.
- Without saved content (or without a Blob token) the site shows `lib/content-defaults.ts`. Prices there are samples.
- Running locally writes to the same Blob store as production: test with care.

## Where things live

- `lib/content-defaults.ts`: built-in catalogue, slides, gallery and settings (what /admin edits)
- `lib/content.ts`, `lib/content-types.ts`, `lib/content-schema.ts`: reading, types and validation of store content
- `lib/site.ts`: WhatsApp link, price formatting, site URL
- `lib/images.ts`: every photo, imported statically so next/image serves resized WebP with blur placeholders
- `assets/photos/originals/`: the client's product photos as received. `scripts/prepare-photos.mjs` crops them into `assets/photos/` (`npm run photos`)
- `assets/generated/`: Higgsfield campaign photos (AI-generated; labelled "Campaign" in the gallery)
- `app/fonts/`: self-hosted Barlow Condensed and Instrument Sans (latin subset, OFL)
- `tailwind.config.ts`: design tokens (colours, fonts, radii, easing). `app/globals.css`: `.btn` button classes
- `design/`: Claude Design canvas source and reference images

## Before launch, fill in

Search the codebase for `[` to find every placeholder:
- `[X]` production days, promo `[XX]%` and `[DATES]` (WhatsApp: +234 706 170 2536 is set in `lib/site.ts`; every button opens a chat with "Hi, I'm from the LP Wears website. I want to get …")
- Prices (`price: null` shows ₦ [PRICE]), clog material and photo
- Size guide foot lengths `[cm]`
- Confirm product names, materials and prices in /admin (names were written from the photos; prices are samples)
- Confirm product claims with the client: cork-latex footbed, metal buckles, anti-slip sole, lightweight, breathable, "handmade in Nigeria", nationwide delivery, size exchange

## Brand note

Don't use the word "Birkenstock" in product names, page titles, SEO or ads. It's a registered trademark. Describe products as cork-footbed sandals. Never publish photos showing another brand's name or logo: `brown black birken.jpeg` and `brown & black birken 2.jpeg` are kept out for this reason (BIRKENSTOCK on the buckles). The `../image_gallery` folder is a mood board of other brands' imagery and must not be used on the site.

## Security

- Keep dependencies patched: `npm audit` should report 0 vulnerabilities. Next.js 14 is end-of-life; stay on a supported major.
- Security headers and the Content-Security-Policy live in `next.config.mjs`. Adding any third-party script (Paystack, Meta pixel, analytics) means adding its domains to the CSP there, or it will be blocked.
- The image optimiser only accepts local images (`remotePatterns: []`, one quality, WebP). Keep it that way unless a remote host is really needed.
- The cart lives in localStorage and is validated on load (`components/CartProvider.tsx`). Prices must never be trusted from the browser: when Paystack is added, recompute totals and verify every payment on a server route.
- No secrets exist in the code. Put future keys in Vercel environment variables; only `NEXT_PUBLIC_*` values may reach the browser.
