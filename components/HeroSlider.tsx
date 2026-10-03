"use client";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Header from "./Header";
import RotatingStamp from "./RotatingStamp";

export type HeroCta = { label: string; href: string; style: "gold" | "outline"; external?: boolean };
// Art-directed photo, pre-computed on the server with getImageProps (landscape for desktop, portrait for phones).
export type HeroArt = { desktop: string; mobile: string; src: string; width: number; height: number; sizes: string };
type Base = { id: string; eyebrow: string; title: string; sub: string; ctas: HeroCta[] };
export type HeroSlide =
  | (Base & { kind: "photo"; art: HeroArt; position?: string })
  | (Base & { kind: "flyer"; tone: "ink" | "sand" | "cocoa"; photos: StaticImageData[]; word: string });

// Slide length is the "animate-progress" duration in tailwind.config.ts (6.5s); the bar finishing advances the slide.

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
  const autoplay = !reduced;
  const running = autoplay && !userPaused && !hovered && !focused && !hidden;
  const cur = slides[i];
  const onDark = cur.kind === "photo" || cur.tone !== "sand";

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(i + 1);
    if (e.key === "ArrowLeft") go(i - 1);
  };

  return (
    <section className="px-3 pt-3 md:px-6 md:pt-6">
      <div
        aria-roledescription="carousel" aria-label="LP Originals highlights"
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
        className="relative h-[calc(100svh-24px)] max-h-[800px] min-h-[620px] touch-pan-y overflow-hidden rounded-hero bg-ink md:h-[780px]"
      >
        {slides.map((s, n) => (
          <div key={s.id} role="group" aria-roledescription="slide" aria-label={`${n + 1} of ${slides.length}: ${s.title}`}
            aria-hidden={n !== i} inert={n !== i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${n === i ? "z-10 opacity-100" : "z-0 opacity-0"}`}>
            {s.kind === "photo" ? <PhotoBg s={s} active={n === i} priority={n === 0} /> : <FlyerBg s={s} active={n === i} />}
            <SlideText s={s} active={n === i} />
          </div>
        ))}

        <div className="absolute inset-x-0 top-0 z-20 px-5 pt-5 md:px-10 md:pt-7"><Header variant="overlay" /></div>

        {/* Controls */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-4 px-5 pb-6 md:px-10 md:pb-9">
          <div className="flex flex-grow items-center gap-2" role="group" aria-label="Choose slide">
            {slides.map((s, n) => (
              <button key={s.id} type="button" onClick={() => go(n)} aria-label={`Show slide ${n + 1}: ${s.title}`} aria-current={n === i}
                className="group flex h-8 items-center">
                <span className={`relative block h-[3px] overflow-hidden rounded-full transition-[width,background-color] duration-500 ease-out ${onDark ? "bg-white/30" : "bg-ink/20"} ${n === i ? "w-12 md:w-16" : `w-5 ${onDark ? "group-hover:bg-white/60" : "group-hover:bg-ink/40"}`}`}>
                  {n === i && (
                    <span key={i}
                      onAnimationEnd={() => running && go(i + 1)}
                      className={`absolute inset-0 origin-left rounded-full bg-gold ${autoplay ? "animate-progress" : ""}`}
                      style={{ animationPlayState: running ? "running" : "paused" }} />
                  )}
                </span>
              </button>
            ))}
          </div>
          <span className={`hidden font-display text-lg transition-colors md:block ${onDark ? "text-white/80" : "text-ink/70"}`} aria-hidden="true">
            {String(i + 1).padStart(2, "0")}<span className="text-sm opacity-60">/{String(slides.length).padStart(2, "0")}</span>
          </span>
          {autoplay && (
            <CircleBtn label={userPaused ? "Play slideshow" : "Pause slideshow"} onClick={() => setUserPaused(!userPaused)}>
              {userPaused ? <path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" /> : <><path d="M9 6v12" /><path d="M15 6v12" /></>}
            </CircleBtn>
          )}
          <div className="hidden gap-2 md:flex">
            <CircleBtn label="Previous slide" onClick={() => go(i - 1)}><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></CircleBtn>
            <CircleBtn label="Next slide" onClick={() => go(i + 1)}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></CircleBtn>
          </div>
        </div>
      </div>
    </section>
  );
}

function CircleBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink/50 text-white ring-1 ring-inset ring-white/20 backdrop-blur transition-[transform,background-color] duration-150 ease-out hover:bg-ink/70 active:scale-[0.94]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
    </button>
  );
}

// Full-bleed photo with a slow push-in while the slide is showing.
function PhotoBg({ s, active, priority }: { s: Extract<HeroSlide, { kind: "photo" }>; active: boolean; priority: boolean }) {
  return (
    <>
      <picture className="absolute inset-0 overflow-hidden">
        <source media="(min-width: 768px)" srcSet={s.art.desktop} sizes={s.art.sizes} />
        <source srcSet={s.art.mobile} sizes={s.art.sizes} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.art.src} width={s.art.width} height={s.art.height} alt="" decoding="async"
          loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "low"}
          className={`h-full w-full object-cover transition-transform duration-[8000ms] ease-out ${s.position ?? ""} ${active ? "scale-100" : "scale-[1.08]"}`} />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/20 to-ink/80" aria-hidden="true" />
    </>
  );
}

// Poster layout for portrait product photos: a blurred colour wash of the product fills the whole slide,
// with cork grain, a big outlined word, fanned "printed" photos and a turning stamp on top.
// Phones place the photo stack inside the text column (see SlideText) so it always fills the space above the
// headline; tablets/desktop show it on the right.
function FlyerBg({ s, active }: { s: Extract<HeroSlide, { kind: "flyer" }>; active: boolean }) {
  const ink = s.tone !== "sand"; // dark slides (ink, cocoa) share light text and gold accents
  const cocoa = s.tone === "cocoa";
  return (
    <div className={`absolute inset-0 overflow-hidden ${cocoa ? "bg-[#2A1C13]" : ink ? "bg-ink" : "bg-dune"}`}>
      {/* Ambient wash: a tiny (≈64px) version of the photo, blurred and scaled up. Costs a few KB. Cocoa slides use a pure gradient instead. */}
      {!cocoa && (
      <div aria-hidden="true" className={`absolute inset-0 transition-transform duration-[8000ms] ease-out ${active ? "scale-110" : "scale-125"}`}>
        <Image src={s.photos[0]} alt="" fill sizes="64px" quality={75} className={`object-cover blur-2xl ${cocoa ? "opacity-25 saturate-150" : ink ? "opacity-35" : "opacity-40 saturate-50"}`} />
      </div>
      )}
      <div aria-hidden="true" className={`absolute inset-0 ${cocoa ? "bg-[radial-gradient(85%_55%_at_85%_8%,rgba(201,164,92,0.42),transparent_60%),radial-gradient(70%_45%_at_0%_95%,rgba(140,107,42,0.32),transparent_70%),linear-gradient(to_bottom,#3A2618,#26180F_55%,#140E0A)]" : ink ? "bg-[radial-gradient(90%_60%_at_70%_25%,rgba(201,164,92,0.14),transparent_65%),linear-gradient(to_bottom,rgba(20,18,16,0.7),rgba(20,18,16,0.45)_40%,rgba(20,18,16,0.96))]" : "bg-gradient-to-b from-dune/70 via-dune/40 to-dune/95"}`} />
      {cocoa && (
        // Gold "sun" arcs behind the photos
        <div aria-hidden="true" className="absolute left-1/2 top-[33%] h-[min(130vw,700px)] w-[min(130vw,700px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/40 md:left-[72%] md:top-1/2">
          <div className="absolute inset-[10%] rounded-full border border-dashed border-gold/25" />
          <div className="absolute inset-[22%] rounded-full bg-gold/10" />
        </div>
      )}
      <div aria-hidden="true" className={`absolute inset-0 ${ink ? "cork-dots-light" : "cork-dots"}`} />
      {/* Soft spotlight behind the photos */}
      <div aria-hidden="true" className={`absolute left-1/2 top-[30%] h-[60%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl md:left-[72%] md:top-1/2 md:w-[50%] ${ink ? "bg-gold/15" : "bg-white/50"}`} />
      <span aria-hidden="true"
        className={`text-outline pointer-events-none absolute right-3 top-[72px] select-none font-display text-[120px] font-bold uppercase leading-none md:bottom-[-3.5rem] md:left-[28%] md:right-auto md:top-auto md:text-[260px] ${ink ? "text-gold/35" : "text-bronze/35"} transition-transform duration-[8000ms] ease-out ${active ? "translate-x-0" : "translate-x-10"}`}>
        {s.word}
      </span>
      <div className="absolute inset-y-0 right-[6%] hidden w-[46%] items-center justify-center md:flex">
        <PhotoStack photos={s.photos} active={active} size="desktop" />
        <RotatingStamp size={112} tone={ink ? "gold" : "bronze"} filled className="absolute right-[-2%] top-[17%]" />
      </div>
    </div>
  );
}

// Two fanned prints (front + back). Heights are relative to the box it sits in.
function PhotoStack({ photos, active, size }: { photos: StaticImageData[]; active: boolean; size: "phone" | "desktop" }) {
  const [a, b] = photos;
  const desk = size === "desktop";
  return (
    <>
      {b && (
        <div className={`absolute aspect-[4/5] w-auto overflow-hidden rounded-xl bg-white shadow-2xl transition-transform duration-1000 ease-out ${desk ? "h-[58%] p-2" : "h-[82%] p-1.5"} ${active ? "-translate-x-[38%] -rotate-[9deg]" : "-translate-x-[20%] -rotate-3"}`}>
          <div className="relative h-full w-full overflow-hidden rounded-lg"><Image src={b} alt="" fill sizes={desk ? "30vw" : "45vw"} className="object-cover" /></div>
        </div>
      )}
      <div className={`relative aspect-[4/5] w-auto overflow-hidden rounded-xl bg-white shadow-2xl transition-transform duration-1000 ease-out ${desk ? "h-[66%] p-2" : "h-[94%] p-1.5"} ${b ? (active ? "translate-x-[22%] rotate-[5deg]" : "translate-x-[8%] rotate-1") : active ? "rotate-[3deg]" : "rotate-0"}`}>
        <div className="relative h-full w-full overflow-hidden rounded-lg"><Image src={a} alt="" fill sizes={desk ? "34vw" : "55vw"} className="object-cover" /></div>
      </div>
    </>
  );
}

function SlideText({ s, active }: { s: HeroSlide; active: boolean }) {
  const light = s.kind === "photo" || s.tone !== "sand";
  const rise = (d: number) => (active ? { className: "animate-rise", style: { animationDelay: `${d}ms` } } : { className: "opacity-0", style: undefined });
  return (
    <div className="absolute inset-0 flex flex-col justify-end px-5 pb-24 pt-[84px] md:w-[58%] md:px-10 md:pb-28 md:pt-0">
      {/* Phones: the flyer's photos take whatever height is left above the text, so there is no empty band. */}
      {s.kind === "flyer" && (
        <div className="relative mb-5 flex min-h-0 flex-1 items-center justify-center md:hidden">
          <PhotoStack photos={s.photos} active={active} size="phone" />
          <RotatingStamp size={64} tone={s.tone !== "sand" ? "gold" : "bronze"} filled className="absolute bottom-0 right-0" />
        </div>
      )}
      <div className="flex max-w-[640px] flex-col gap-3 md:gap-5">
        <span {...rise(100)}><span className={`inline-block rounded-full px-3.5 py-1.5 text-[11px] tracking-[0.3em] md:text-[12px] ${light ? "bg-ink/50 text-gold backdrop-blur" : "bg-ink text-gold"}`}>{s.eyebrow}</span></span>
        <h2 {...rise(180)}>
          <span className={`block text-balance font-display text-[44px] font-medium uppercase leading-[0.95] sm:text-[52px] md:text-[92px] ${light ? "text-white" : "text-ink"}`}>{s.title}</span>
        </h2>
        <p {...rise(260)}><span className={`block max-w-[520px] text-[15px] leading-relaxed md:text-lg ${light ? "text-white/85" : "text-text/80"}`}>{s.sub}</span></p>
        <div {...rise(340)}>
          <div className="flex flex-wrap gap-2.5 pt-1 md:gap-3">
            {s.ctas.map((c) => {
              const cls = `btn max-md:px-5 max-md:py-3 max-md:text-[15px] ${c.style === "gold" ? "btn-gold" : light ? "btn-outline-light" : "btn-outline"}`;
              return c.external
                ? <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className={cls}>{c.label}</a>
                : <Link key={c.label} href={c.href} className={cls}>{c.label}</Link>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
