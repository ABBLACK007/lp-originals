import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import WhatsAppFab from "@/components/WhatsAppFab";
import { StoreProvider } from "@/components/StoreProvider";
import { getContent, visibleProducts } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import type { Product } from "@/lib/content-types";

// Fonts are self-hosted (app/fonts, latin subset from Google Fonts, SIL Open Font License):
// no request to Google at build or run time, preloaded, with size-matched fallbacks to avoid layout shift.
const display = localFont({
  src: [
    { path: "./fonts/barlowcondensed-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/barlowcondensed-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/barlowcondensed-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/barlowcondensed-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/barlowcondensed-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display", display: "swap", adjustFontFallback: "Arial",
});
const sans = localFont({
  src: [{ path: "./fonts/instrumentsans-400-700.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-sans", display: "swap",
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
export const viewport: Viewport = { themeColor: "#141210", width: "device-width", initialScale: 1, viewportFit: "cover" };

// The cart, receipt and WhatsApp messages only need each product's first photo (without its blur preview),
// and this list is sent with every page, so it's kept small.
const cartProduct = (p: Product): Product => ({ ...p, images: p.images.slice(0, 1).map(({ src, width, height }) => ({ src, width, height })) });

// Scroll reveal for [data-reveal] (components/Reveal.tsx). Plain JS, inlined so it runs while the page is still
// loading: one IntersectionObserver for the elements in the HTML, plus a MutationObserver for elements React adds
// later (page changes, shop filters). Old browsers without IntersectionObserver just show everything.
// Whatever is already on screen when the page opens is shown before the first paint (no fade), so the main
// content appears as soon as it has loaded; the fade-up is for content scrolled into view.
const revealScript = `(function(){var d=document,s="[data-reveal]:not([data-in])";
function show(e){e.setAttribute("data-in","")}
if(!("IntersectionObserver" in window)){d.documentElement.classList.remove("js");return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){show(e.target);io.unobserve(e.target)}})},{rootMargin:"0px 0px -10% 0px"});
function scan(n){if(n.nodeType!==1)return;if(n.matches(s))io.observe(n);n.querySelectorAll(s).forEach(function(e){io.observe(e)})}
var h=innerHeight;
d.body.querySelectorAll(s).forEach(function(e){if(e.getBoundingClientRect().top<h)show(e);else io.observe(e)});
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(scan)})}).observe(d.body,{childList:true,subtree:true})})()`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before first paint, so scroll-reveal can hide content without a flash. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="fixed left-3 top-3 z-50 -translate-y-20 rounded-full bg-gold px-5 py-3 font-medium text-ink no-underline focus:translate-y-0">Skip to content</a>
        <StoreProvider value={{ site: content.site, products: visibleProducts(content).map(cartProduct) }}>
          <CartProvider>
            {children}
            <WhatsAppFab />
          </CartProvider>
        </StoreProvider>
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
      </body>
    </html>
  );
}
