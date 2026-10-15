"use client";
import Icon from "./Icon";
import { useQuickAdd } from "./QuickAdd";
import type { Product } from "@/lib/content-types";

// Black round cart button on a product tile: opens the size sheet (components/QuickAdd.tsx).
export default function QuickAddButton({ p }: { p: Product }) {
  const open = useQuickAdd();
  return (
    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); open(p); }} aria-label={`Add ${p.name} to cart`}
      className="relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-[transform,background-color] duration-150 ease-out hover:bg-char active:scale-[0.92]">
      <span aria-hidden="true" className="absolute -inset-1" />
      <Icon name="cartPlus" size={17} />
    </button>
  );
}
