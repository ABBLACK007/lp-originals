import Reveal from "./Reveal";

// Light word(s) + semibold word(s), with a gold stitched rule (the "handmade" motif) and a fade-up reveal.
// `level={1}` when the title is the page's main heading (shop, gallery).
export default function SectionTitle({ light, strong, sub, center = false, level = 2 }: { light: string; strong: string; sub?: string; center?: boolean; level?: 1 | 2 }) {
  const H = level === 1 ? "h1" : "h2";
  return (
    <Reveal className={`flex flex-col gap-3.5 ${center ? "items-center text-center" : ""}`}>
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span className="h-0 w-14 border-t-2 border-dashed border-gold" />
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
      </span>
      <H className="text-balance font-display text-4xl font-light uppercase leading-[1.02] tracking-[-0.01em] text-bronze md:text-[60px]">
        {light} <strong className="font-semibold">{strong}</strong>
      </H>
      {sub && <p className="max-w-lg text-[15px] leading-relaxed text-muted md:text-base">{sub}</p>}
    </Reveal>
  );
}
