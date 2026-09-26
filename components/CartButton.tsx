"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartButton({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { count } = useCart();
  const stroke = tone === "dark" ? "#FFFFFF" : "#2A2724";
  return (
    <Link href="/cart" aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
      className={`relative flex h-11 w-11 items-center justify-center rounded-full backdrop-blur transition-transform duration-150 ease-out active:scale-[0.94] ${tone === "dark" ? "bg-white/15" : "bg-sand"}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 7h12l-1 13H7L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
      {/* key={count}: the badge re-mounts and pops each time an item is added. */}
      {count > 0 && <span key={count} className="absolute -right-1 -top-1 flex h-5 min-w-5 animate-pop-in items-center justify-center rounded-full bg-gold px-1 text-[11px] font-semibold text-ink">{count}</span>}
    </Link>
  );
}
