import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { SavedProvider } from "@/components/SavedProvider";
import { QuickAddProvider } from "@/components/QuickAdd";
import AppShell from "@/components/AppShell";
import { StoreProvider } from "@/components/StoreProvider";
import { getContent, visibleProducts } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import type { Img, Product } from "@/lib/content-types";

// Poppins, self-hosted (app/fonts, latin subset from Google Fonts, SIL Open Font License): no request to Google at
// build or run time, preloaded, with a size-matched fallback to avoid layout shift.
const sans = localFont({
  src: [
    { path: "./fonts/poppins-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/poppins-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/poppins-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/poppins-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sans", display: "swap", adjustFontFallback: "Arial",
});
// Roboto (variable, latin) for paragraphs, as on the mockup.
const read = localFont({
  src: [{ path: "./fonts/roboto-variable.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-read", display: "swap", adjustFontFallback: "Arial",
});

const description = "Handmade cork-footbed sandals, slides, palms and clogs, made to order and delivered nationwide.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "LP Wears | Handmade cork-footbed sandals", template: "%s | LP Wears" },
  description,
  applicationName: "LP Wears",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "LP Wears", locale: "en_NG", title: "LP Wears | Handmade cork-footbed sandals", description, url: "/" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};
export const viewport: Viewport = { themeColor: "#FFFFFF", width: "device-width", initialScale: 1, viewportFit: "cover" };

// The cart, receipt and saved list only need each product's first photo and cut-out (without blur previews),
// and this list is sent with every page, so it's kept small.
const slim = ({ src, width, height }: Img) => ({ src, width, height });
const cartProduct = (p: Product): Product => ({ ...p, images: p.images.slice(0, 1).map(slim), cutout: p.cutout && slim(p.cutout) });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  return (
    <html lang="en" className={`${sans.variable} ${read.variable}`} suppressHydrationWarning>
      <body>
        <a href="#main" className="fixed left-3 top-3 z-50 -translate-y-20 rounded-btn bg-ink px-5 py-3 font-medium text-white no-underline focus:translate-y-0">Skip to content</a>
        <StoreProvider value={{ site: content.site, products: visibleProducts(content).map(cartProduct) }}>
          <CartProvider>
            <SavedProvider>
              <QuickAddProvider>
                <AppShell>{children}</AppShell>
              </QuickAddProvider>
            </SavedProvider>
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
