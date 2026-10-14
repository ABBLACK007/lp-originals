import type { Metadata } from "next";
import ShopView from "./ShopView";

export const metadata: Metadata = { title: "Shop all styles", description: "Cork-footbed sandals, slides, palms and clogs, handmade to order in EU sizes 36 to 46.", alternates: { canonical: "/shop" } };

// Static: /shop?category=<id> is rewritten to the pre-built category pages (next.config.mjs).
export default function Shop() {
  return <ShopView initial="all" />;
}
