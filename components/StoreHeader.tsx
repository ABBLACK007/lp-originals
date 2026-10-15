"use client";
import Link from "next/link";
import { useRef } from "react";
import Icon from "./Icon";
import { useStore, useWhatsapp } from "./StoreProvider";

// The mockup's store header: store name with a wave, location underneath, and a small round button on the right
// (here it opens the menu: gallery, help, Instagram, order tracking).
export default function StoreHeader() {
  const { site } = useStore();
  const whatsappLink = useWhatsapp();
  const menu = useRef<HTMLDialogElement>(null);
  const links: { href: string; label: string; external?: boolean }[] = [
    { href: "/shop", label: "Shop all styles" },
    { href: "/saved", label: "Saved styles" },
    { href: "/cart", label: "Cart" },
    { href: "/gallery", label: "Gallery" },
    { href: "/help#order", label: "How to order" },
    { href: "/help#sizes", label: "Size guide" },
    { href: whatsappLink("an update on my order. My name is "), label: "Track my order", external: true },
    { href: site.instagram, label: `Instagram ${site.instagramHandle}`, external: true },
  ];
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 flex-col">
        <span className="flex items-center gap-2 text-[15px] font-semibold">{site.name}<span aria-hidden="true" className="text-[15px]">👋</span></span>
        <span className="flex items-center gap-0.5 font-read text-[11px] text-muted"><Icon name="pin" size={12} strokeWidth={2} />Nigeria</span>
      </div>
      <button type="button" onClick={() => menu.current?.showModal()} aria-label="Menu" aria-haspopup="dialog"
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-[0_1px_6px_rgba(17,17,17,0.14)] transition-transform duration-150 ease-out active:scale-[0.92]">
        <span aria-hidden="true" className="absolute -inset-1" />
        <Icon name="more" size={18} />
      </button>
      <dialog ref={menu} aria-label="Menu" onClick={(e) => { if (e.target === menu.current) menu.current?.close(); }}
        className="sheet fixed inset-x-0 bottom-0 top-auto m-0 mx-auto max-h-[85dvh] w-full max-w-app overflow-y-auto rounded-t-[24px] bg-white p-0 text-ink shadow-float open:animate-sheet-up">
        <div className="flex flex-col px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-3">
          <span aria-hidden="true" className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
          <div className="mb-2 flex items-center justify-between">
            <span className="text-base font-semibold">Menu</span>
            <button type="button" onClick={() => menu.current?.close()} aria-label="Close menu" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-tile"><Icon name="close" size={18} /></button>
          </div>
          {links.map((l) => {
            const cls = "flex min-h-[52px] items-center justify-between border-b border-line text-[15px] font-medium text-ink no-underline last:border-0";
            const body = <>{l.label}<Icon name={l.external ? "external" : "chevronRight"} size={18} className="text-muted" /></>;
            return l.external
              ? <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className={cls}>{body}</a>
              : <Link key={l.label} href={l.href} onClick={() => menu.current?.close()} className={cls}>{body}</Link>;
          })}
        </div>
      </dialog>
    </div>
  );
}
