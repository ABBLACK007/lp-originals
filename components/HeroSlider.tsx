"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Header from "./Header";
import Icon from "./Icon";

export type HeroCta = { label: string; href: string; style: "gold" | "outline"; external?: boolean };
// Art-directed photo, pre-computed on the server with getImageProps (landscape for desktop, portrait for phones).
export type HeroArt = { desktop: string; mobile: string; src: string; width: number; height: number; sizes: string };
export type HeroSlide = { id: string; art: HeroArt; focus?: string; title: string; sub: string; ctas: HeroCta[] };

// Full-bleed black & white photo slides (the mockup's opening screen): bold uppercase headline, one white
// button. Slide length is the "animate-progress" duration in tailwind.config.ts; the bar finishing advances.
export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touchX = useRef<number | null>(null);

  // Autoplay never starts for people who ask for reduced motion (they can still use the controls).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(mq.matches);
    set(); mq.addEventListener("change", set);
    const vis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => { mq.removeEventListener("change", set); document.removeEventListener("visibilitychange", vis); };
  }, []);

  const go = useCallback((n: number) => setI((n + slides.length) % slides.length), [slides.length]);
  const autoplay = !reduced && slides.length > 1;
  const running = autoplay && !userPaused && !hovered && !focused && !hidden;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(i + 1);
    if (e.key === "ArrowLeft") go(i - 1);
  };

  return (
    <section className="px-3 pt-3 md:px-6 md:pt-6">
      <div
        aria-roledescription="carousel" aria-label="LP Wears highlights"
        onKeyDown={onKey}
        onMouseEnter={() => { if (window.matchMedia("(hover: hover)").matches) setHovered(true); }}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false); }}
        onPointerDown={(e) => { if (e.pointerType !== "mouse") touchX.current = e.clientX; }}
        onPointerUp={(e) => {
          if (touchX.current === null) return;
          const dx = e.clientX - touchX.current; touchX.current = null;
          if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
        }}
        className="relative h-[calc(100svh-104px)] max-h-[760px] min-h-[540px] touch-pan-y overflow-hidden rounded-hero bg-ink md:h-[760px] md:max-h-none"
      >
        {slides.map((s, n) => (
          <div key={s.id} role="group" aria-roledescription="slide" aria-label={`${n + 1} of ${slides.length}: ${s.title}`}
            aria-hidden={n !== i} inert={n !== i}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${n === i ? "z-10 opacity-100" : "z-0 opacity-0"}`}>
            <Photo s={s} active={n === i} first={n === 0} />
            <SlideText s={s} active={n === i} />
          </div>
        ))}

        <div className="absolute inset-x-0 top-0 z-20 px-4 pt-4 md:px-8 md:pt-6"><Header variant="overlay" /></div>

        {/* Controls: progress dots centred on phones; counter, pause and arrows on wider screens */}
        {slides.length > 1 && (
          <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-4 px-5 pb-5 md:justify-between md:px-10 md:pb-8">
            <div className="flex items-center gap-1.5" role="group" aria-label="Choose slide">
              {slides.map((s, n) => (
                <button key={s.id} type="button" onClick={() => go(n)} aria-label={`Show slide ${n + 1}: ${s.title}`} aria-current={n === i}
                  className="group flex h-8 items-center px-0.5">
                  <span className={`relative block h-1 overflow-hidden rounded-full bg-white/35 transition-[width,background-color] duration-300 ease-out ${n === i ? "w-9" : "w-2 group-hover:bg-white/70"}`}>
                    {n === i && (
                      <span key={i} onAnimationEnd={() => running && go(i + 1)}
                        className={`absolute inset-0 origin-left rounded-full bg-white ${autoplay ? "animate-progress" : ""}`}
                        style={{ animationPlayState: running ? "running" : "paused" }} />
                    )}
                  </span>
                </button>
              ))}
            </div>
            <div className="absolute right-4 flex items-center gap-2 md:static">
              <span className="tabular hidden text-sm text-white/80 md:block" aria-hidden="true">{i + 1} / {slides.length}</span>
              {autoplay && (
                <RoundBtn label={userPaused ? "Play slideshow" : "Pause slideshow"} onClick={() => setUserPaused(!userPaused)}>
                  <Icon name={userPaused ? "play" : "pause"} size={16} filled={userPaused} />
                </RoundBtn>
              )}
              <div className="hidden gap-2 md:flex">
                <RoundBtn label="Previous slide" onClick={() => go(i - 1)}><Icon name="arrowLeft" size={18} /></RoundBtn>
                <RoundBtn label="Next slide" onClick={() => go(i + 1)}><Icon name="arrowRight" size={18} /></RoundBtn>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function RoundBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-[transform,background-color,border-color] duration-150 ease-out hover:border-white hover:bg-white/10 active:scale-[0.94]">
      {children}
    </button>
  );
}

// Full-bleed photo in black & white with a slow push-in while the slide is showing. The first slide's photo is
// preloaded from the page <head> (app/page.tsx).
function Photo({ s, active, first }: { s: HeroSlide; active: boolean; first: boolean }) {
  return (
    <>
      <picture className="absolute inset-0 overflow-hidden">
        <source media="(min-width: 768px)" srcSet={s.art.desktop} sizes={s.art.sizes} />
        <source srcSet={s.art.mobile} sizes={s.art.sizes} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.art.src} width={s.art.width} height={s.art.height} alt="" decoding="async"
          loading={first ? "eager" : "lazy"} fetchPriority={first ? "high" : "low"}
          style={s.focus ? { objectPosition: s.focus } : undefined}
          className={`h-full w-full object-cover contrast-[1.06] grayscale transition-transform duration-[8000ms] ease-out ${active ? "scale-100" : "scale-[1.06]"}`} />
      </picture>
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/55 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-black/90 via-black/45 to-transparent" aria-hidden="true" />
    </>
  );
}

function SlideText({ s, active }: { s: HeroSlide; active: boolean }) {
  const rise = (d: number) => (active ? { className: "animate-rise", style: { animationDelay: `${d}ms` } } : { className: "opacity-0", style: undefined });
  const [main, ...rest] = s.ctas;
  const cta = (c: HeroCta, cls: string, arrow = false) => {
    const body = <>{c.label}{arrow && <Icon name="arrowRight" size={18} />}</>;
    return c.external
      ? <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className={cls}>{body}</a>
      : <Link key={c.label} href={c.href} className={cls}>{body}</Link>;
  };
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-20 text-center text-white md:items-start md:px-12 md:pb-28 md:text-left">
      <div className="flex max-w-[680px] flex-col items-center gap-3.5 md:items-start md:gap-5">
        <h2 {...rise(80)}>
          <span className="block text-balance text-[34px] font-bold uppercase leading-[1.04] tracking-[-0.02em] sm:text-[44px] md:text-[68px]">{s.title}</span>
        </h2>
        {s.sub && <p {...rise(160)}><span className="block max-w-[34ch] text-[14px] leading-relaxed text-white/80 md:max-w-[46ch] md:text-[17px]">{s.sub}</span></p>}
        <div {...rise(240)}>
          <div className="flex flex-col items-center gap-3 pt-2 md:flex-row">
            {main && cta(main, "btn btn-light min-w-[220px] gap-3", true)}
            {rest.map((c) => cta(c, "btn btn-ghost-light max-md:min-h-[44px] max-md:border-0 max-md:underline max-md:underline-offset-4"))}
          </div>
        </div>
      </div>
    </div>
  );
}
