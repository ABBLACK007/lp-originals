"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useWhatsapp } from "./StoreProvider";

// Floating chat button: most customers order on WhatsApp, so it's always one tap away.
// Hidden on product and cart pages, which have their own WhatsApp buttons (and the sticky buy bar),
// and on the home page until the hero (which has its own WhatsApp button and slide controls) is scrolled past.
export default function WhatsAppFab() {
  const path = usePathname();
  const whatsappLink = useWhatsapp();
  const home = path === "/";
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    if (!home) return;
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);
  if (path.startsWith("/shop/") || path === "/cart" || path === "/receipt" || path.startsWith("/admin") || (home && !pastHero)) return null;
  return (
    <a href={whatsappLink()} target="_blank" rel="noreferrer"
      aria-label="Chat with LP Wears on WhatsApp"
      className="fixed bottom-[calc(16px+env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 animate-pop-in items-center justify-center rounded-full bg-gold text-ink shadow-[0_8px_24px_rgba(20,18,16,0.28)] transition-transform duration-150 ease-out hover:bg-goldhover active:scale-[0.94] md:bottom-6 md:right-6">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
        <path d="M9.2 8.4c.2-.4.6-.4.9-.4h.4c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .5-.1.6l-.5.6c.4.9 1.2 1.7 2.1 2.1l.6-.5c.2-.1.4-.2.6-.1l1.5.6c.3.1.4.3.4.5v.4c0 .3 0 .7-.4.9-.6.4-1.5.5-2.3.2a7.4 7.4 0 0 1-4-4c-.3-.8-.2-1.7.2-2.3z" fill="currentColor" stroke="none" />
      </svg>
    </a>
  );
}
