import Link from "next/link";
import Photo from "./Photo";
import SandalArt from "./SandalArt";
import Reveal from "./Reveal";
import { categories, countIn, type Category } from "@/lib/products";
import { photos } from "@/lib/images";
import type { StaticImageData } from "next/image";

// Poster-style category cards ("flyers"): big condensed type over real product photos.
const art: Record<Category, { image?: StaticImageData; alt: string; position?: string }> = {
  cork: { image: photos.buckleGroup, alt: "Two-buckle cork sandals in rust, orange and tan suede", position: "object-[50%_60%]" },
  slides: { image: photos.cutoutRed, alt: "Red croc-embossed cut-out slides in a gift box" },
  clogs: { image: photos.clogMocha, alt: "Mocha suede closed-toe clog with a cork footbed, held in hand", position: "object-[50%_45%]" },
};

export default function StyleFlyers() {
  return (
    <div className="grid gap-3 md:grid-cols-3 md:gap-5">
      {categories.map((c, i) => {
        const a = art[c.id];
        const n = countIn(c.id);
        return (
          <Reveal key={c.id} delay={i * 110}>
          <Link href={`/shop?category=${c.id}`}
            className="group relative flex h-[380px] flex-col justify-between overflow-hidden rounded-hero bg-ink p-6 no-underline ring-1 ring-inset ring-white/10 md:h-[540px] md:p-8">
            {a.image ? (
              <>
                <Photo src={a.image} alt={a.alt} sizes="(min-width: 768px) 33vw, 100vw" className="!absolute inset-0"
                  imgClassName={`transition-transform duration-700 ease-out group-hover:scale-[1.05] ${a.position ?? ""}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/40" aria-hidden="true" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-start justify-center pt-20 md:items-center md:pt-0" aria-hidden="true">
                <SandalArt style="clog" strap="#C9A45C" className="w-[64%] -rotate-12 md:w-[78%] opacity-90 transition-transform duration-700 ease-out group-hover:-rotate-6" />
              </div>
            )}
            <div className="relative flex items-center justify-between text-[11px] tracking-[0.28em] text-gold [&>span]:rounded-full [&>span]:bg-ink/60 [&>span]:px-3 [&>span]:py-1.5 [&>span]:backdrop-blur">
              <span>LP WEARS</span><span>0{i + 1}</span>
            </div>
            <div className="relative flex flex-col gap-3">
              <span className="text-[13px] tracking-[0.2em] text-white/75">{n} {n === 1 ? "STYLE" : "STYLES"}</span>
              <h3 className="font-display text-[56px] font-semibold uppercase leading-[0.88] text-white md:text-[72px]">{c.label}</h3>
              <div className="flex items-end justify-between gap-4">
                <p className="max-w-[240px] text-sm leading-relaxed text-white/80">{c.blurb}</p>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#141210" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
                </span>
              </div>
            </div>
          </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
