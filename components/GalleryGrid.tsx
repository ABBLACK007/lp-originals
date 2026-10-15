"use client";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type { GalleryItem } from "@/lib/content-types";
import type { GalleryItem } from "@/lib/content-types";

const tabs = [
  { id: "all", label: "All" },
  { id: "product", label: "Products" },
  { id: "campaign", label: "Campaign" },
] as const;

// Masonry grid + lightbox. The lightbox is a native <dialog>: focus trap, Esc to close and
// background inertness come for free. Arrow keys and the side buttons move between photos.
export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("all");
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const list = tab === "all" ? items : items.filter((x) => x.kind === tab);

  const show = (i: number) => { setOpen(i); dialog.current?.showModal(); };
  const close = () => dialog.current?.close();
  const step = useCallback((d: 1 | -1) => setOpen((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open === null) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const cur = open === null ? null : list[open];

  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label="Filter photos" className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} aria-pressed={tab === t.id}
            className="chip px-5">{t.label}</button>
        ))}
      </div>

      <ul className="columns-2 gap-3">
        {list.map((x, i) => (
          <li key={x.src.src} className="mb-3 break-inside-avoid">
            <button type="button" onClick={() => show(i)} aria-label={`Open photo: ${x.alt}`}
              className="group relative block w-full overflow-hidden rounded-card bg-tile">
              <Image src={x.src} alt={x.alt} placeholder="blur" sizes="(min-width: 768px) 33vw, 50vw"
                className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
              {x.kind === "campaign" && <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium">Campaign</span>}
            </button>
          </li>
        ))}
      </ul>

      <dialog ref={dialog} onClose={() => setOpen(null)} onClick={(e) => e.target === dialog.current && close()}
        aria-label="Photo viewer"
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/90 open:animate-fade-in">
        {cur && (
          <div className="flex h-full flex-col" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="flex items-center justify-between p-4 text-white">
              <span className="text-sm text-white/70" aria-live="polite">{open! + 1} / {list.length}</span>
              <button type="button" onClick={close} aria-label="Close" autoFocus className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 active:scale-[0.94]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12" /><path d="M18 6L6 18" /></svg>
              </button>
            </div>
            <div className="relative min-h-0 flex-grow" onClick={(e) => e.target === e.currentTarget && close()}>
              <Image key={cur.src.src} src={cur.src} alt={cur.alt} fill sizes="100vw" className="animate-pop-in object-contain" />
            </div>
            <div className="flex items-center justify-between gap-4 p-4">
              <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 active:scale-[0.94]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></svg>
              </button>
              <div className="flex min-w-0 flex-col items-center gap-2 text-center">
                <p className="text-sm text-white/85">{cur.alt}</p>
                {cur.product && <Link href={`/shop/${cur.product}`} className="btn btn-light btn-sm">Shop this style</Link>}
              </div>
              <button type="button" onClick={() => step(1)} aria-label="Next photo" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 active:scale-[0.94]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
