"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import CartButton from "./CartButton";
import Icon from "./Icon";
import { useSaved } from "./SavedProvider";
import { useWhatsapp } from "./StoreProvider";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/#new-drops", label: "New Drops" },
  { href: "/gallery", label: "Gallery" },
  { href: "/#details", label: "Our Craft" },
  { href: "/#ordering", label: "How to Order" },
];

// overlay: on top of the home hero photo (light logo, white controls).
// solid: sticky white bar on inner pages. float: home only, a white bar that slides down once the hero is gone.
// Phones navigate with the tab bar (components/TabBar.tsx); the menu holds the secondary links.
export default function Header({ variant = "solid", className = "" }: { variant?: "overlay" | "solid" | "float"; className?: string }) {
  const [open, setOpen] = useState(false);
  const whatsappLink = useWhatsapp();
  const { slugs } = useSaved();
  const [shown, setShown] = useState(variant !== "float");
  const overlay = variant === "overlay";
  useEffect(() => {
    if (variant !== "float") return;
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setShown(window.scrollY > window.innerHeight * 0.8)); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [variant]);
  useEffect(() => { if (!shown) setOpen(false); }, [shown]);
  const path = usePathname();
  // Section-based, so /shop, the category pages, rewritten /shop?category=… links and product pages all mark "Shop"
  // and the server-rendered HTML matches the browser.
  const current = (href: string) => (href === "/shop" ? path.startsWith("/shop") : path === href);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      inert={!shown} aria-hidden={!shown || undefined}
      className={overlay ? "relative z-20"
        : variant === "float" ? `fixed inset-x-0 top-0 z-30 border-b border-line bg-white px-5 py-2.5 transition-transform duration-300 ease-out md:px-8 ${shown ? "translate-y-0" : "-translate-y-full"}`
        : `sticky top-0 z-30 border-b border-line bg-white px-5 py-2.5 md:px-8 ${className}`}>
      <div className={`relative ${overlay ? "" : "mx-auto max-w-page"}`}>
        <div className="flex items-center justify-between gap-4">
          <Logo dark={!overlay} />
          <nav aria-label="Main" className={`hidden items-center gap-1 rounded-full p-1 lg:flex ${overlay ? "bg-black/35 backdrop-blur-md" : ""}`}>
            {nav.map((n) => (
              <Link key={n.href} href={n.href} aria-current={current(n.href) ? "page" : undefined}
                className={`rounded-full px-4 py-2.5 text-[14px] font-medium no-underline transition-colors ${overlay
                  ? "text-white hover:bg-white/15 aria-[current=page]:bg-white aria-[current=page]:text-ink"
                  : "text-ink hover:bg-tile aria-[current=page]:bg-ink aria-[current=page]:text-white"}`}>{n.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/saved" aria-label={`Saved styles, ${slugs.length}`} className="icon-btn relative hidden md:inline-flex">
              <Icon name="heart" size={20} />
              {slugs.length > 0 && <span key={slugs.length} className="tabular absolute -right-1 -top-1 flex h-5 min-w-5 animate-pop-in items-center justify-center rounded-full bg-ink px-1 text-[11px] font-semibold text-white">{slugs.length}</span>}
            </Link>
            <CartButton className="hidden md:inline-flex" />
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className={`btn btn-sm hidden lg:inline-flex ${overlay ? "btn-light" : "btn-primary"}`}>Order on WhatsApp</a>
            <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}
              className="icon-btn lg:hidden">
              <Icon name={open ? "close" : "menu"} size={20} />
            </button>
          </div>
        </div>
        {/* Floats over the page instead of pushing it down. */}
        {open && (
          <nav id="mobile-nav" aria-label="Mobile" className="absolute inset-x-0 top-full z-30 mt-3 flex origin-top animate-pop-in flex-col gap-0.5 rounded-panel bg-white p-2 shadow-float lg:hidden">
            {[...nav, { href: "/saved", label: "Saved" }, { href: "/shop#size-guide", label: "Size guide" }].map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="flex min-h-[48px] items-center justify-between rounded-chip px-4 text-[15px] font-medium text-ink no-underline hover:bg-tile">
                {n.label}<Icon name="chevronRight" size={18} className="text-muted" />
              </Link>
            ))}
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn btn-primary mt-2">Order on WhatsApp</a>
          </nav>
        )}
      </div>
    </header>
  );
}
