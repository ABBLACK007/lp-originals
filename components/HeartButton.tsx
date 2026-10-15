"use client";
import { useState } from "react";
import Icon from "./Icon";
import { useSaved } from "./SavedProvider";

// Save / unsave a style: the mockup's heart in a small white circle. It pops once when saved; unsaving is instant.
export default function HeartButton({ slug, name, className = "", size = "md" }: { slug: string; name: string; className?: string; size?: "sm" | "md" }) {
  const { has, toggle } = useSaved();
  const saved = has(slug);
  const [pop, setPop] = useState(0);
  const sm = size === "sm";
  return (
    <button type="button" aria-pressed={saved} aria-label={saved ? `Remove ${name} from saved` : `Save ${name}`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!saved) setPop((n) => n + 1); toggle(slug); }}
      className={`relative z-10 inline-flex shrink-0 items-center justify-center rounded-full border border-[#D6D6D6] bg-white transition-transform duration-150 ease-out active:scale-[0.88]
        ${sm ? "h-[26px] w-[26px]" : "h-[34px] w-[34px] border-[1.5px] border-ink"} ${className}`}>
      {/* 44px touch target even when the visible circle is smaller */}
      <span aria-hidden="true" className={`absolute ${sm ? "-inset-2.5" : "-inset-1"}`} />
      <span key={pop} className={pop ? "animate-heart" : ""}>
        {/* Cards: red outline, filled red once saved (the mockup's red hearts). Product top bar: ink outline, red when saved. */}
        <Icon name="heart" size={sm ? 15 : 18} strokeWidth={sm ? 2 : 1.8} filled={saved} className={saved || sm ? "text-heart" : "text-ink"} />
      </span>
    </button>
  );
}
