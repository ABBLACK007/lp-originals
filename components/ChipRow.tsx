"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";

// A titled, horizontally scrolling row of chips with ‹ › buttons (the mockup's "Categories" row).
// The arrows only show when the row overflows, and disable at either end.
export default function ChipRow({ title, label, children }: { title: string; label: string; children: React.ReactNode }) {
  const row = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: true });
  const measure = useCallback(() => {
    const el = row.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    measure();
    const el = row.current;
    const ro = new ResizeObserver(measure);
    if (el) ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);
  const go = (d: 1 | -1) => row.current?.scrollBy({ left: d * Math.max(200, (row.current?.clientWidth ?? 300) * 0.7), behavior: "smooth" });
  const overflow = !(edge.start && edge.end);
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold md:text-xl">{title}</h2>
        {overflow && (
          <div className="flex gap-1">
            <button type="button" onClick={() => go(-1)} disabled={edge.start} aria-label={`Scroll ${label} back`}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity hover:bg-tile disabled:opacity-30"><Icon name="chevronLeft" size={20} /></button>
            <button type="button" onClick={() => go(1)} disabled={edge.end} aria-label={`Scroll ${label} forward`}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity hover:bg-tile disabled:opacity-30"><Icon name="chevronRight" size={20} /></button>
          </div>
        )}
      </div>
      <div ref={row} onScroll={measure} role="group" aria-label={label}
        className="no-scrollbar -mx-5 flex snap-x gap-2.5 overflow-x-auto scroll-px-5 px-5 pb-1 md:mx-0 md:scroll-px-0 md:px-0">
        {children}
      </div>
    </div>
  );
}
