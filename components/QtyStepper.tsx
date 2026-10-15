"use client";

// The mockup's quantity pill: an outlined capsule with − n +. Each button has a 44px touch area; the count is
// announced when it changes.
export default function QtyStepper({ value, onChange, min = 1, max = 20, label = "Quantity" }: {
  value: number; onChange: (n: number) => void; min?: number; max?: number; label?: string;
}) {
  const btn = "relative flex h-full w-9 items-center justify-center text-[18px] font-medium leading-none transition-transform duration-150 ease-out active:scale-[0.85] disabled:pointer-events-none disabled:opacity-30";
  return (
    <div role="group" aria-label={label} className="inline-flex h-[38px] shrink-0 items-center rounded-full border-[1.5px] border-ink bg-white px-1.5">
      <button type="button" aria-label="Decrease quantity" onClick={() => onChange(value - 1)} disabled={value <= min} className={btn}><span aria-hidden="true" className="absolute -inset-y-1.5 inset-x-0" />−</button>
      <span aria-live="polite" className="tabular w-7 text-center text-[15px] font-medium">{value}</span>
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(value + 1)} disabled={value >= max} className={btn}><span aria-hidden="true" className="absolute -inset-y-1.5 inset-x-0" />+</button>
    </div>
  );
}
