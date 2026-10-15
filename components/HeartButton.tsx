"use client";
import { useState } from "react";
import Icon from "./Icon";
import { useSaved } from "./SavedProvider";

// Save / unsave a style. The heart pops once when it's saved (a rare, meaningful action); unsaving is instant.
export default function HeartButton({ slug, name, className = "", size = "md" }: { slug: string; name: string; className?: string; size?: "sm" | "md" }) {
  const { has, toggle } = useSaved();
  const saved = has(slug);
  const [pop, setPop] = useState(0);
  return (
    <button type="button" aria-pressed={saved} aria-label={saved ? `Remove ${name} from saved` : `Save ${name}`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!saved) setPop((n) => n + 1); toggle(slug); }}
      className={`relative z-10 inline-flex shrink-0 items-center justify-center rounded-full border border-line bg-white transition-[transform,border-color] duration-150 ease-out hover:border-ink active:scale-[0.92]
        ${size === "sm" ? "h-9 w-9" : "h-11 w-11"} ${className}`}>
      {/* 44px touch target even when the visible circle is smaller */}
      <span aria-hidden="true" className="absolute -inset-1" />
      <span key={pop} className={pop ? "animate-heart" : ""}>
        <Icon name="heart" size={size === "sm" ? 17 : 20} filled={saved} className={saved ? "text-heart" : "text-ink"} />
      </span>
    </button>
  );
}
