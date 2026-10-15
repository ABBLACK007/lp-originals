---
name: LP Wears
description: The store as the owner's monochrome shoe-shop app mockup, on every screen.
colors:
  canvas: "#ECECEC"
  paper: "#FFFFFF"
  mist: "#F6F6F6"
  tile: "#F1F1F1"
  line: "#E4E4E4"
  edge: "#D2D2D2"
  ink: "#111111"
  char: "#2B2B2B"
  muted: "#666666"
  heart: "#EF4627"
  ok: "#1F7A45"
  bad: "#B42318"
typography:
  display:
    fontFamily: "Poppins, Arial, system-ui, sans-serif"
    fontSize: "clamp(34px, 6vw, 68px)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Poppins, Arial, system-ui, sans-serif"
    fontSize: "clamp(22px, 3vw, 30px)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Poppins, Arial, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Poppins, Arial, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Poppins, Arial, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
  read:
    fontFamily: "Roboto, Arial, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  btn: "8px"
  chip: "10px"
  card: "16px"
  panel: "16px"
  hero: "24px"
  pill: "9999px"
spacing:
  gutter-phone: "20px"
  gutter-desktop: "32px"
  grid-gap-phone: "12px"
  grid-gap-desktop: "20px"
  section-phone: "64px"
  section-desktop: "96px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.btn}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.char}"
  button-secondary:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
    rounded: "{rounded.btn}"
    padding: "0 24px"
    height: "48px"
  button-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.btn}"
    padding: "0 24px"
    height: "48px"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.chip}"
    padding: "0 14px"
    height: "44px"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  product-tile:
    backgroundColor: "{colors.tile}"
    rounded: "{rounded.card}"
    padding: "8px"
  search-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "56px"
---

# Design System: LP Wears

## Overview

**Creative North Star: "The Shop in Your Hand"**

The storefront is the owner's shoe-shop app mockup, built exactly (owner's decision, 2026-10-15): one 430px phone-width column on every screen, centred on a grey canvas on computers. Home is the mockup's two screens in a row: a black & white opening screen with a white "Next" button, then the store screen (store name with a wave, location, search pill, Categories row, product cards). The product screen, cart, saved, gallery and help screens follow the same app grammar with a round back button. The catalogue is the interface. Grey product tiles carry two round controls (add to cart, save), a pill search sits above a row of category chips, and a tab bar with a raised black Home disc anchors every page on phones. Nothing is decorative for its own sake; every visible control works.

The world is monochrome on purpose. White pages, light-grey tiles and ink-black controls stay quiet so the client's photographs of real leather, suede and cork supply all the colour. The only other hue is the red of a saved heart. Hero photography is shown in black and white; product photography never is.

Density is the mockup's: two product cards per row everywhere, 44px touch areas around small round controls. Motion is small and physical: presses shrink to 97%, a saved heart pops once, and the product stand turns to its next photo.

**Key Characteristics:**
- Monochrome chrome, full-colour product photos, black and white hero photos.
- Poppins throughout; bold uppercase only for the hero and display moments.
- Small-radius slab buttons, pill search and stepper, round icon buttons.
- Product tiles with a cart button top left and a heart top right.
- A ring "stand" under the product photo on product pages.

## Colors

A strictly neutral palette with one emotional accent (the saved heart); the photographs are the colour.

### Primary
- **Workshop Ink** (#111111): every primary action (Buy now, Order on WhatsApp, Add to cart in sheets), selected chips and sizes, the tab bar's Home disc. Also body text.

### Neutral
- **Canvas** (#ECECEC): the background around the app column on computers.
- **Paper White** (#FFFFFF): the app column, chips, the menu and size sheets.
- **Mist** (#F6F6F6): inputs and quiet bands.
- **Tile Grey** (#F1F1F1): product tiles, secondary buttons, icon circles.
- **Hairline** (#E4E4E4): dividers, fold-out rows, round icon-button rings.
- **Edge Grey** (#D2D2D2): borders of unselected chips, inputs and secondary buttons.
- **Graphite** (#2B2B2B): hover and pressed state of Workshop Ink.
- **Quiet Text** (#666666): secondary text; passes 4.5:1 on white and on Tile Grey.

### Tertiary
- **Saved Red** (#EF4627): the hearts on product cards (outline; filled once saved). Nothing else.
- **Confirm Green** (#1F7A45) / **Error Red** (#B42318): status text only.

### Named Rules
**The Photos Carry Colour Rule.** Interface colour is ink, white and grey. Colour on a screen comes from product photography or the saved heart, never from fills, gradients or accents.

**The Gold Stays In The Logo Rule.** LP gold appears only inside the logo artwork (owner's decision, 2026-10-15).

## Typography

**Display Font:** Poppins (with Arial, system-ui), self-hosted, weights 400–700
**Body Font:** Poppins for interface text; Roboto (variable, self-hosted) for paragraphs and small grey labels, as on the mockup

**Character:** One geometric sans in four weights, as on the mockup. Hierarchy comes from weight and size, never from a second family.

### Hierarchy
- **Display** (600, 38px, 1.22, uppercase): the opening screen's headline only.
- **Headline** (500–600, 16–19px): Categories, product name and price, fold-out titles, screen titles in the top bar.
- **Title** (500, 14–15px): product names on tiles and in the cart.
- **Body** (400, 15px, 1.625): paragraphs; keep to about 65ch.
- **Label** (500, 13px): chip counts, meta lines, prices use tabular figures.

### Named Rules
**The No Kicker Rule.** No small label or eyebrow above a heading, with one owner-pinned exception copied from the mockup: the product screen's grey "Handmade quality" / category line above the product name.

## Layout

**The App Column Rule.** Every store page lives in one column of at most 430px (`max-w-app`), centred on the Canvas grey on wider screens, with the tab bar fixed to its bottom. The admin is the only full-width surface. Inside the column there are no viewport breakpoints (sm:/md:/lg:), because they would fire on a computer and break the phone layout.


Phone-first single column inside a 20px gutter; 32px gutter from 768px; content capped at 1280px. Product grids run 2 columns on phones, 3 from 640px, 4 from 1024px, with 12px gaps (20px on desktop). Sections are separated by 64px on phones and 96px on desktop; headings sit closer to their content than to the section above. On phones the page keeps 76px of bottom padding (plus the safe area) so the fixed tab bar never covers content; product pages add a compact buy bar above the tab bar once the buy buttons scroll away. Single-column grids use minmax(0, 1fr) columns so one-line text can never widen the page (checked at 320px by the test suite).

## Elevation & Depth

Mostly flat, with soft ambient shadows to lift interactive surfaces off the grey. One elevation per surface: a border or a shadow, never both.

### Shadow Vocabulary
- **Tile** (`0 1px 2px rgba(17,17,17,0.04), 0 10px 24px -14px rgba(17,17,17,0.18)`): product tiles, the cart summary, the stand's photo frame.
- **Float** (`0 12px 32px -12px rgba(17,17,17,0.28)`): sheets, menus, raised controls (Home disc, turn disc), tile hover.
- **Bar** (`0 -10px 30px -18px rgba(17,17,17,0.35)`): the phone tab bar.

### Named Rules
**The One Elevation Rule.** A surface declares depth once: hairline border (filters panel, receipt) or shadow (tiles, cart summary), never a border under a soft shadow.

## Shapes

Slab buttons with gently softened corners (8px), chips at 10px, cards and panels at 16px. Only the hero frame and the footer slab use 24px, echoing the mockup's phone screens. Pills (full radius) are reserved for small controls: the search field, the quantity stepper, badges. Round controls are true circles: icon buttons (44px), tile buttons (36px with a 44px touch area), the turn disc and the Home disc. The product stand is an ellipse ring drawn in two halves so the photo sits inside it.

## Components

### Buttons
- **Shape:** softened slab (8px), 48px tall (44px small).
- **Primary:** Workshop Ink with white text; hover Graphite; press shrinks to 97% in 150ms.
- **Secondary:** Tile Grey with an Edge Grey border and ink text; hover border turns ink.
- **Light:** white with ink text, for use on photos and ink panels; its ghost partner is a white outline.

### Chips
- **Style:** white with an Edge Grey border, 44px tall, 10px radius; category chips carry a 32px photo thumbnail and a count.
- **State:** selected chips (aria-pressed) fill with Workshop Ink and white text. Size chips use the same component.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** Tile Grey for product tiles, Mist for quiet bands, Workshop Ink for dark info panels.
- **Shadow Strategy:** Tile shadow on interactive cards only (see Elevation).
- **Internal Padding:** 8px for product tiles, 20–48px for panels.

### Inputs / Fields
- **Style:** white, Edge Grey border, 10px radius; the search field is a 56px pill with a search icon, a clear button and a filter button behind a hairline divider.
- **Focus:** border turns ink; focus-visible rings are 2px ink with 3px offset everywhere.

### Navigation
- **Phones:** fixed white tab bar with rounded top corners: Shop, Saved, a raised black Home disc, Cart (with count) and WhatsApp chat. The active item is ink with a 4px dot; others are Quiet Text. The header holds the logo and a menu for secondary links.
- **Desktop:** white sticky header with the dark logo, pill navigation (active item filled ink), Saved and Cart icon buttons and a primary "Order on WhatsApp" button. Over the hero the header turns light: white logo, translucent dark pill.

### Product Card (signature)
The mockup's card: Tile Grey with a soft shadow and 10px corners, two thin grey arcs (top-left and bottom-right corners), a 26px black cart button top left (opens the size sheet), a 26px white heart button top right, the product's cut-out photo floating in the middle (scripts/make-cutouts.py; a framed photo when there is no cut-out), then name and price centred. The whole card opens the product.

### Product Stand (signature)
The cut-out shoe floats over a thin oval ring with a soft contact shadow; a small black disc on the front of the ring turns to the product's other photos (shown framed on the same ring), crossfading with a slight blur.

### Opening Screen
Full-height black & white photo in a 24px-rounded frame, gradient to black at the bottom, centred bold uppercase headline, one line of Roboto text, and a white 5px-radius "Next" button with a long arrow that scrolls to the store.

### Tab Bar
White bar with a round bump in the middle holding the 58px black Home disc; outline icons (Shop, Cart, WhatsApp chat, Saved) at 1.5 stroke; the active item gets a 4px dot; badges for cart count and saved count.

### Size Sheet
Bottom sheet on phones (rounded top, drag handle), centred card on desktop: product thumbnail, size grid, Add to cart, then an "Added" state with Keep shopping / View cart.

## Do's and Don'ts

### Do:
- **Do** use Workshop Ink (#111111) for every primary action and selected state.
- **Do** show hero photography in black and white and product photography in full colour.
- **Do** give every control a 44px touch target and a working action; hide what would do nothing.
- **Do** put supporting facts under headings, and use tabular figures for prices and counts.
- **Do** keep bottom space for the phone tab bar on every page.

### Don't:
- **Don't** add colour fills, gradients or accent hues to the interface; the photos carry the colour.
- **Don't** use LP gold outside the logo.
- **Don't** put a kicker or eyebrow label above a heading.
- **Don't** stack a border under a soft shadow, or round cards beyond 16px.
- **Don't** use emoji or text glyphs as icons; use the shared 24px, 1.8-stroke icon set (components/Icon.tsx).
- **Don't** show ratings, review counts or badges the shop doesn't have.
