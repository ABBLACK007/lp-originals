# CLAUDE.md: LP Wears

Read README.md first. This file tells you how to keep working on the project.

## Design rules (the visual system is in DESIGN.md; product facts in PRODUCT.md)
- Redesigned 2026-10-15 to the owner's monochrome shoe-shop app mockup: white ground, grey tiles (`tile`), ink (`ink #111111`) for every primary control, colour only from product photos and the saved heart. LP gold appears only inside the logo. Hero photos render in black and white. Tokens: `tailwind.config.ts`; full rules and named do's/don'ts: `DESIGN.md` (+ `.impeccable/design.json`).
- Type: Poppins only (self-hosted, `app/fonts`). Sentence-case headings via `components/SectionTitle.tsx`; bold uppercase only for the hero and display moments. No kicker/eyebrow labels above headings.
- Buttons: `.btn` + `.btn-primary` (ink), `.btn-secondary` (grey), `.btn-light` / `.btn-ghost-light` (on photos and ink panels); chips: `.chip` (selected via aria-pressed); round icon buttons: `.icon-btn`. Icons only from `components/Icon.tsx` (no emoji or text glyphs).
- Every primary action has a WhatsApp alternative, since most customers order there. Every visible control must work.
- Mobile first: most traffic will come from Instagram on phones. Keep pages light for mobile data: every image goes through next/image (`components/Photo.tsx`), imported from `lib/images.ts`.
- Buttons: use the `.btn` classes in `app/globals.css` (press feedback, hover only on hover-capable devices).
- Never use images from `../image_gallery` or any photo showing another brand’s name or logo.
- Placeholders stay visible as `[LIKE THIS]`. Never invent prices, reviews, ratings or stats.

## Next tasks, in order
1. Done: site runs, real product photos are in, gallery page added.
2. The client edits products, prices, slides, gallery and settings in /admin (see README). Sample prices are in `lib/content-defaults.ts`; promo and production time are still placeholders.
3. Paystack checkout: add Paystack Inline to the cart summary in `components/CartView.tsx` (and update the "card payment coming soon" copy there and in `components/OrderingSteps.tsx`) (public key in `NEXT_PUBLIC_PAYSTACK_KEY`). Verify payments on a server route before confirming orders. Add the Paystack domains to the CSP in next.config.mjs.
4. Done: /admin dashboard (Vercel Blob storage). Next: editable homepage section texts, order history.
5. Add an Our Craft / About page (the Gallery page exists).
6. SEO basics done (metadata, OG image, sitemap, robots, JSON-LD). Meta pixel if the client runs Instagram ads (add its domains to the CSP).
7. Performance: images go through next/image, fonts are self-hosted, every public page is static (ISR), scroll reveals run from an inline script before hydration. Keep it that way: don't read searchParams/cookies in public pages.
9. Tests: `npm run build && npm test` (Playwright, tests/). Run them before every deploy and add tests with new features.
8. Done: deployed to https://lp-originals.vercel.app. Next: connect a custom domain and set NEXT_PUBLIC_SITE_URL.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
