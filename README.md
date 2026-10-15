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

`npm run photos` re-crops the client's product photos (see below). Product cut-outs (`assets/cutouts`, shoe on a transparent background) are made from those photos with `scripts/make-cutouts.py` (rembg, run locally; instructions in the file). New products can get a cut-out in admin (Products › Cut-out photo, a transparent PNG).

## Tests

```bash
npm run build && npm test                              # unit tests + every page on desktop and phone (Playwright)
BASE_URL=https://lp-originals.vercel.app npm test      # the same checks against the live site
```

Tests live in `tests/` and use the Chrome installed on the machine (no browser download). They cover the pages and navigation, shop filters, sizes, cart, receipts, WhatsApp messages, the hero slider, gallery viewer, scroll reveals, security headers, the image optimizer allowlist, admin sign-in protection and the content validation rules. Any console error fails a test. The admin editor test only runs when `ADMIN_PASSWORD` is set and never saves (local runs share the production Blob store).

## Pages

| Route | What it is |
|---|---|
| `/` | The owner's app mockup: opening screen (first visible hero slide, black & white, "Next"), then the store screen: name, search, Categories chips, product cards. Every store page is a 430px phone-width app, centred on computers, with a tab bar (Shop, Cart, Home, WhatsApp, Saved) |
| `/shop`, `/shop/category/[category]` | All styles with live search (`?q=`), sort by price, men/women filter, category chips, size guide. Category pages are pre-built; old `/shop?category=…` links are rewritten to them (`next.config.mjs`) and also honoured in the browser |
| `/shop/[slug]` | Product screen: cut-out shoe on its stand (the disc turns through the photos), colour swatches (products with the same name), quantity, sizes, Description and Delivery fold-outs (WhatsApp order inside), Buy now / Add to cart above the tab bar |
| `/gallery` | Masonry gallery with lightbox (keyboard arrows, Esc), Products / Campaign filter |
| `/cart` | Cart (saved in the browser), WhatsApp order message, receipt link (card payment not connected yet) |
| `/saved` | Saved styles (heart buttons), kept in the browser |
| `/help` | How to order, size guide (foot lengths from admin), delivery and exchanges, contact links |
| `/receipt` | Order receipt generated from the cart (number, date, customer details), send on WhatsApp or print/PDF |

## Admin dashboard (/admin)

The store owner edits products and prices (add, hide, reorder, photos), hero slides (photos, text, buttons, focus point), the gallery and settings (WhatsApp number and greeting, promo, production time, size guide foot lengths, Instagram) at **/admin**.

- Login: one password, `ADMIN_PASSWORD` (12+ chars), plus `ADMIN_SESSION_SECRET` (32+ chars). Both are Vercel environment variables and live in `.env.local` for local work (git-ignored). Changing the password signs everyone out. Sessions last 12 hours (signed httpOnly cookie, `lib/admin-auth.ts`); `proxy.ts` guards /admin and every server action re-checks (`app/admin/actions.ts`).
- Storage: Vercel Blob store `lp-wears-content` (`BLOB_READ_WRITE_TOKEN`). Each save writes `content/store-<time>.json` (never overwritten: Blob overwrites are eventually consistent); the newest wins, the last 3 are kept. Photos go to `uploads/`, re-encoded by sharp (EXIF/GPS stripped, max 2000px).
- Validation: `lib/content-schema.ts` bounds every field and only allows site paths, #anchors, "whatsapp" or https links, and images from this site or its Blob store.
- Without saved content (or without a Blob token) the site shows `lib/content-defaults.ts`. Prices there are samples.
- Running locally writes to the same Blob store as production: test with care.

## Where things live

- `PRODUCT.md` (who it's for, product truth) and `DESIGN.md` (visual system, tokens, rules); `tailwind.config.ts` holds the tokens

- `lib/content-defaults.ts`: built-in catalogue, slides, gallery and settings (what /admin edits)
- `lib/content.ts`, `lib/content-types.ts`, `lib/content-schema.ts`: reading, types and validation of store content
- `lib/site.ts`: WhatsApp link, price formatting, site URL
- `lib/images.ts`: every photo, imported statically so next/image serves resized WebP with blur placeholders
- `assets/photos/originals/`: the client's product photos as received. `scripts/prepare-photos.mjs` crops them into `assets/photos/` (`npm run photos`)
- `assets/generated/`: Higgsfield campaign photos (AI-generated; labelled "Campaign" in the gallery)
- `app/fonts/`: self-hosted Poppins 400–700 (latin subset, OFL)
- `app/globals.css`: `.btn`, `.chip`, `.icon-btn`, `.field` classes, scroll reveal and fold-out styles; `components/Icon.tsx`: the icon set
- `design/`: the original Claude Design canvas (previous look, kept for reference)

## Before launch, fill in

Search the codebase for `[` to find every placeholder:
- `[X]` production days, promo `[XX]%` and `[DATES]` are set in admin › Settings (WhatsApp +234 706 170 2536 is set there too; every button opens a chat with "Hi, I'm from the LP Wears website. I want to get …")
- Prices (`price: null` shows ₦ [PRICE]), clog material and photo
- Size guide foot lengths (admin › Settings › Size guide; the table on /shop stays hidden until filled in)
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
