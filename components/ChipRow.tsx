"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";

// The mockup's "Categories" row: title with ‹ › on the right, then a sideways-scrolling row of small tiles.
// The arrows scroll the row and fade at either end.
export default function ChipRow({ title, label, children }: { title: string; label: string; children: React.ReactNode }) {
  const row = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const measure = useCallback(() => {
    const el = row.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (row.current) ro.observe(row.current);
    return () => ro.disconnect();
  }, [measure]);
  const go = (d: 1 | -1) => row.current?.scrollBy({ left: d * 220, behavior: "smooth" });
  const arrow = "flex h-9 w-8 items-center justify-center text-ink transition-opacity disabled:opacity-35";
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[17px] font-medium text-[#222]">{title}</h2>
        <div className="-mr-2 flex">
          <button type="button" onClick={() => go(-1)} disabled={edge.start} aria-label={`Scroll ${label} back`} className={arrow}><Icon name="chevronLeft" size={18} strokeWidth={2.2} /></button>
          <button type="button" onClick={() => go(1)} disabled={edge.end} aria-label={`Scroll ${label} forward`} className={arrow}><Icon name="chevronRight" size={18} strokeWidth={2.2} /></button>
        </div>
      </div>
      <div ref={row} onScroll={measure} role="group" aria-label={label}
        className="no-scrollbar -mx-6 flex snap-x gap-2.5 overflow-x-auto scroll-px-6 px-6 pb-2 pt-0.5">
        {children}
      </div>
    </div>
  );
}
