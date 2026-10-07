"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import CartButton from "./CartButton";
import { useWhatsapp } from "./StoreProvider";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/#new-drops", label: "New Drops" },
  { href: "/gallery", label: "Gallery" },
  { href: "/#details", label: "Our Craft" },
  { href: "/#ordering", label: "How to Order" },
];

// overlay: sits on top of the dark hero photo. solid: sticky dark bar for inner pages.
// float: home page only; a fixed bar that slides down once the hero has scrolled away.
export default function Header({ variant = "solid", onLight = false }: { variant?: "overlay" | "solid" | "float"; onLight?: boolean }) {
  const [open, setOpen] = useState(false);
  const whatsappLink = useWhatsapp();
  const [shown, setShown] = useState(variant !== "float");
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
      className={variant === "overlay" ? "relative z-20"
        : variant === "float" ? `fixed inset-x-0 top-0 z-30 bg-ink/90 px-5 py-3 backdrop-blur-md transition-[transform,box-shadow] duration-300 ease-out md:px-10 ${shown ? "translate-y-0 shadow-[0_8px_30px_rgba(20,18,16,0.25)]" : "-translate-y-full shadow-none"}`
        : "sticky top-0 z-30 bg-ink/95 px-5 py-3 backdrop-blur md:px-10"}>
      <div className="relative">
        <div className="flex items-center justify-between">
          <Logo dark={onLight} />
          <nav aria-label="Main" className={`hidden gap-1 rounded-full p-1.5 backdrop-blur lg:flex ${variant === "overlay" ? "bg-ink/45 ring-1 ring-inset ring-white/15" : "bg-white/15"}`}>
            {nav.map((n) => (
              <Link key={n.href} href={n.href} aria-current={path === n.href ? "page" : undefined}
                className="rounded-full px-4 py-2.5 text-[15px] text-white no-underline transition-colors hover:bg-white/10 aria-[current=page]:bg-white/15">{n.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <CartButton tone={variant === "overlay" ? "glass" : "dark"} />
            <a href={whatsappLink()} target="_blank" rel="noreferrer"
              className="btn btn-gold btn-sm hidden lg:inline-flex">Order on WhatsApp</a>
            <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}
              className={`flex h-11 w-11 items-center justify-center rounded-full backdrop-blur transition-transform duration-150 ease-out active:scale-[0.94] lg:hidden ${variant === "overlay" ? "bg-ink/45 ring-1 ring-inset ring-white/15" : "bg-white/15"}`}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                {open ? (<><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>) : (<><path d="M4 8h16" /><path d="M4 16h16" /></>)}
              </svg>
            </button>
          </div>
        </div>
        {/* Floats over the page instead of pushing it down. */}
        {open && (
          <nav id="mobile-nav" aria-label="Mobile" className="absolute inset-x-0 top-full z-30 mt-3 flex origin-top animate-pop-in flex-col gap-1 rounded-panel bg-char p-3 shadow-2xl lg:hidden">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-white no-underline hover:bg-white/10">{n.label}</Link>
            ))}
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn btn-gold mt-2 py-3">Order on WhatsApp</a>
          </nav>
        )}
      </div>
    </header>
  );
}
