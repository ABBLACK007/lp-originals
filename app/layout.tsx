import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import WhatsAppFab from "@/components/WhatsAppFab";
import { siteUrl } from "@/lib/site";

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
  title: { default: "LP Originals | Handmade cork-footbed sandals", template: "%s | LP Originals" },
  description,
  applicationName: "LP Originals",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "LP Originals", locale: "en_NG", title: "LP Originals | Handmade cork-footbed sandals", description, url: "/" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};
export const viewport: Viewport = { themeColor: "#141210", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before first paint, so scroll-reveal can hide content without a flash. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="fixed left-3 top-3 z-50 -translate-y-20 rounded-full bg-gold px-5 py-3 font-medium text-ink no-underline focus:translate-y-0">Skip to content</a>
        <CartProvider>
          {children}
          <WhatsAppFab />
        </CartProvider>
      </body>
    </html>
  );
}
