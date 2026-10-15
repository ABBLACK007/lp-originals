"use client";
import Icon from "./Icon";
import { useQuickAdd } from "./QuickAdd";
import type { Product } from "@/lib/content-types";

// The card's small black cart button: opens the size sheet (components/QuickAdd.tsx).
export default function QuickAddButton({ p }: { p: Product }) {
  const open = useQuickAdd();
  return (
    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); open(p); }} aria-label={`Add ${p.name} to cart`}
      className="relative z-10 inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-ink text-white transition-transform duration-150 ease-out active:scale-[0.88]">
      <span aria-hidden="true" className="absolute -inset-2.5" />
      <Icon name="cartSolid" size={15} />
    </button>
  );
}
