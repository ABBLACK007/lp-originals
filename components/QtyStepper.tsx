"use client";
import Icon from "./Icon";

// Pill quantity control: − n + (the mockup's stepper). 44px targets; the count is announced when it changes.
export default function QtyStepper({ value, onChange, min = 1, max = 20, label = "Quantity" }: {
  value: number; onChange: (n: number) => void; min?: number; max?: number; label?: string;
}) {
  const btn = "flex h-11 w-11 items-center justify-center rounded-full transition-[transform,background-color] duration-150 ease-out hover:bg-tile active:scale-[0.9] disabled:pointer-events-none disabled:opacity-30";
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-full border border-edge bg-white">
      <button type="button" aria-label="Decrease quantity" onClick={() => onChange(value - 1)} disabled={value <= min} className={btn}><Icon name="minus" size={16} /></button>
      <span aria-live="polite" className="tabular w-7 text-center text-[15px] font-semibold">{value}</span>
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(value + 1)} disabled={value >= max} className={btn}><Icon name="plus" size={16} /></button>
    </div>
  );
}
