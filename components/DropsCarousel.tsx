"use client";
import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/products";

export default function DropsCarousel({ items }: { items: Product[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = () => {
    const el = track.current; if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const w = card ? card.offsetWidth + 20 : 1;
    const visible = Math.round(el.clientWidth / w);
    setShown(Math.min(items.length, Math.round(el.scrollLeft / w) + visible));
    setAtStart(el.scrollLeft < 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };
  useEffect(() => { update(); window.addEventListener("resize", update); return () => window.removeEventListener("resize", update); });

  const move = (dir: 1 | -1) => {
    const el = track.current; if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 300) + 20), behavior: "smooth" });
  };

  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex flex-col gap-8">
      <div ref={track} onScroll={update} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto">
        {items.map((p) => (
          <div key={p.slug} className="w-[calc(50%-10px)] shrink-0 snap-start md:w-[calc(25%-15px)]">
            <ProductCard p={p} />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-5 md:gap-7">
        <div className="h-[3px] w-28 rounded bg-[#D6CEC2] md:w-[360px]" aria-hidden="true">
          <div className="h-[3px] rounded bg-text transition-[width] duration-300" style={{ width: `${(shown / items.length) * 100}%` }} />
        </div>
        <div className="font-display text-[22px]" aria-live="polite">{pad(shown)}<span className="text-[13px] text-muted">/{pad(items.length)}</span></div>
        <div className="flex-grow" />
        <button type="button" aria-label="Previous products" onClick={() => move(-1)} disabled={atStart}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-[#CFC6B9] bg-[#F6F3EE] disabled:opacity-40">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2A2724" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" aria-label="Next products" onClick={() => move(1)} disabled={atEnd}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-ink disabled:opacity-40">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  );
}
