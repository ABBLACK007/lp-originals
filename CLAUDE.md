# CLAUDE.md: LP Originals

Read README.md first. This file tells you how to keep working on the project.

## Design rules (match the Claude Design canvas in design/)
- Palette comes from the logo: black `ink #141210` and gold `gold #C9A45C` on a cream ground `cream #F2EDE6`. Use `bronze #8C6B2A` for gold-coloured text on cream (gold itself fails contrast on cream).
- Type: Barlow Condensed (display, uppercase headings), Instrument Sans (body).
- Section headings: light word(s) + semibold word(s), via `components/SectionTitle.tsx`.
- Primary buttons: gold pill with ink text. Secondary: ink outline. Every primary action has a WhatsApp alternative, since most customers order there.
- Mobile first: most traffic will come from Instagram on phones. Keep pages light for mobile data: every image goes through next/image (`components/Photo.tsx`), imported from `lib/images.ts`.
- Buttons: use the `.btn` classes in `app/globals.css` (press feedback, hover only on hover-capable devices).
- Never use images from `../image_gallery` or any photo showing another brand’s name or logo.
- Placeholders stay visible as `[LIKE THIS]`. Never invent prices, reviews, ratings or stats.

## Next tasks, in order
1. Done: site runs, real product photos are in, gallery page added.
2. Replace placeholders in `lib/site.ts` and `lib/products.ts` with the client's real details.
3. Paystack checkout: replace the disabled button in `components/CartView.tsx` with Paystack Inline (public key in `NEXT_PUBLIC_PAYSTACK_KEY`). Verify payments on a server route before confirming orders. Add the Paystack domains to the CSP in next.config.mjs.
4. Move the catalogue to a CMS (Sanity suggested) so the client can edit products.
5. Add an Our Craft / About page (the Gallery page exists).
6. SEO basics done (metadata, OG image, sitemap, robots, JSON-LD). Meta pixel if the client runs Instagram ads (add its domains to the CSP).
7. Performance: images already go through next/image and fonts are self-hosted; aim for a Lighthouse mobile score of 90+.
8. Done: deployed to https://lp-originals.vercel.app. Next: connect a custom domain and set NEXT_PUBLIC_SITE_URL.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
