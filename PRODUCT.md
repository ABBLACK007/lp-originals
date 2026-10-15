# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Shoppers in Nigeria** (confirmed 2026-10-15): most find LP Wears on Instagram, browse on their phone, and order through WhatsApp. Phone-first; desktop is secondary.
- **The store owner**: edits products, prices, photos, hero slides, gallery and settings in /admin, usually from a phone.

## Product Purpose
Online storefront for LP Wears' handmade cork-footbed sandals, slides, palms and clogs. Every pair is made to order in EU sizes 36–46 and delivered nationwide. Success is a customer choosing a style and size and sending the order on WhatsApp (with a receipt from the cart when they want one).

## Positioning
Handmade in Nigeria, made to order in the customer's size, by a small workshop that answers on WhatsApp.

## Operating Context
- Every WhatsApp button opens a chat with +234 706 170 2536 with "Hi, I'm from the LP Wears website. I want to get …" typed, plus the product and size when known.
- The cart lives in the browser; /receipt turns it into a numbered order receipt (payment pending) to send on WhatsApp or print.
- Card payment (Paystack) is not connected yet; copy must not promise card checkout.
- Content is edited in /admin and stored in Vercel Blob; hosted on Vercel.

## Capabilities and Constraints
- Next.js 16 App Router, React 19, Tailwind 3, TypeScript; every public page static (ISR). Playwright tests in tests/ must pass before deploys.
- Categories: Cork footbed, Slides & palms, Clogs. Each colour is its own product (same name, different slug).
- No customer accounts, ratings, reviews or stock levels exist.
- Placeholders the owner still has to fill in admin: promo discount and dates, production days, size-guide foot lengths. Prices in the defaults are samples.

## Brand Commitments
- Name: **LP Wears** (formerly LP Originals; the Vercel project, URL and Instagram handle @_lp_originals_ keep the old name). Logo files: public/images/logo-light.png, logo-dark.png.
- Never use "Birkenstock" or any other brand's name, logo or imagery (no REEF, Nike, Adidas, etc.), and no images showing other brands' marks.
- Visual direction pinned by the owner (2026-10-15): a monochrome sneaker-shop app mockup, to be matched exactly. The store is a phone-width app on every device (centred on computers); home is the opening screen plus the store screen only; product shoes are shown as cut-outs. Black, white and greys; LP gold appears only inside the logo; opening photo in black & white; working heart/favourites.

## Evidence on Hand
- Real product photos: assets/photos (client's own, cropped by scripts/prepare-photos.mjs).
- Campaign photos: assets/generated (AI-generated, labelled "Campaign" in the gallery).
- No testimonials, ratings, review counts, sales numbers or press. Never invent them (e.g. no star ratings or "original quality" badges).

## Product Principles
- Ordering on WhatsApp is the main path; every screen keeps it one tap away.
- Show the real pairs: the client's photos lead, not decoration.
- Every visible control works; no decorative buttons.
- Fast on a mid-range phone on mobile data.

## Accessibility & Inclusion
WCAG AA contrast, 44px touch targets, keyboard support, reduced-motion and reduced-transparency respected (existing tests check several of these).
