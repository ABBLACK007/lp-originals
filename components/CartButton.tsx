"use client";
import Link from "next/link";
import Icon from "./Icon";
import { useCart } from "./CartProvider";

// Round cart button with the item count (header, product page top bar).
export default function CartButton({ className = "" }: { className?: string }) {
  const { count } = useCart();
  return (
    <Link href="/cart" aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`} className={`icon-btn relative ${className}`}>
      <Icon name="bag" size={20} />
      {/* key={count}: the badge re-mounts and pops each time an item is added. */}
      {count > 0 && <span key={count} className="tabular absolute -right-1 -top-1 flex h-5 min-w-5 animate-pop-in items-center justify-center rounded-full bg-ink px-1 text-[11px] font-semibold text-white">{count}</span>}
    </Link>
  );
}
