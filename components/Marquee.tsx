// Endless ticker band. The list is rendered twice and slid by -50%, so the loop is seamless.
// Pauses on hover; under reduced motion it stays still.
export default function Marquee({ items, variant = "ink", reverse = false }: {
  items: string[]; variant?: "ink" | "outline"; reverse?: boolean;
}) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <li key={i} className="flex items-center">
          <span className={variant === "ink"
            ? "whitespace-nowrap px-6 text-[13px] font-medium uppercase tracking-[0.24em] text-white/85 md:px-8 md:text-sm"
            : "text-outline whitespace-nowrap px-6 font-display text-[64px] font-semibold uppercase leading-none text-bronze/70 md:px-10 md:text-[120px]"}>{t}</span>
          <Star className={variant === "ink" ? "h-3.5 w-3.5 text-gold" : "h-7 w-7 text-gold md:h-12 md:w-12"} />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`pause-on-hover flex overflow-hidden ${variant === "ink" ? "bg-ink py-4" : "py-2"}`}
      role="marquee" aria-label={items.join(", ")}>
      <div className={`flex w-max ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}>
        {row(false)}{row(true)}
      </div>
    </div>
  );
}

function Star({ className }: { className: string }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12C11.4 17.4 6.6 12.6 0 12 6.6 11.4 11.4 6.6 12 0z" />
    </svg>
  );
}
