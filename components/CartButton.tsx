"use client";
import Link from "next/link";
import Icon from "./Icon";
import { useCart } from "./CartProvider";

// The mockup's round cart button (outlined circle with a cart), with the item count.
export default function CartButton({ className = "" }: { className?: string }) {
  const { count } = useCart();
  return (
    <Link href="/cart" aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
      className={`relative flex h-[34px] w-[34px] items-center justify-center rounded-full border-[1.5px] border-ink text-ink no-underline transition-transform duration-150 ease-out active:scale-[0.92] ${className}`}>
      <span aria-hidden="true" className="absolute -inset-1.5" />
      <Icon name="cartSolid" size={16} />
      {/* key={count}: the badge re-mounts and pops each time an item is added. */}
      {count > 0 && <span key={count} className="tabular absolute -right-2 -top-2 flex h-[18px] min-w-[18px] animate-pop-in items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold text-white ring-2 ring-white">{count}</span>}
    </Link>
  );
}
