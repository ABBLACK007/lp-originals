import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import Reveal from "./Reveal";
import RotatingStamp from "./RotatingStamp";
import { photos } from "@/lib/images";
import { sizes } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";

// Four poster-style flyers, each with its own layout, like prints pinned to a board.
// Phones: a swipeable row. Desktop: a 4-up grid with a slight tilt that straightens on hover.
export default function FlyerBoard() {
  const tilt = ["md:-rotate-[1.5deg]", "md:rotate-[1deg]", "md:-rotate-[0.5deg]", "md:rotate-[1.5deg]"];
  const flyers = [<MadeToOrder key="a" />, <GiftAPair key="b" />, <DmToOrder key="c" />, <FindYourFit key="d" />];
  return (
    <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
      {flyers.map((f, i) => (
        <Reveal key={i} delay={i * 90} className="flex w-[80%] shrink-0 snap-center sm:w-[46%] md:w-auto [&>div]:w-full">
          <div className={`h-full transition-transform duration-500 ease-out hover:rotate-0 hover:-translate-y-1.5 ${tilt[i]}`}>{f}</div>
        </Reveal>
      ))}
    </div>
  );
}

// Cards grow to fit their content; the min height keeps a poster shape and equal heights in a row.
const card = "relative flex h-full min-h-[440px] flex-col overflow-hidden rounded-panel p-6 shadow-[0_24px_48px_-24px_rgba(20,18,16,0.45)]";

function Pin({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full bg-gold shadow-[0_2px_4px_rgba(0,0,0,0.35)] ${className}`} />;
}

// A tiny (≈64px) copy of a photo, blurred and scaled up: a warm colour wash that costs a few KB.
function Wash({ src, className = "" }: { src: StaticImageData; className?: string }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <Image src={src} alt="" fill sizes="64px" className={`scale-125 object-cover blur-2xl ${className}`} />
    </div>
  );
}

// White-bordered "print" of a photo, as if pinned to the board.
function Print({ src, className, sizes, caption }: { src: StaticImageData; className: string; sizes: string; caption?: string }) {
  return (
    <div className={`absolute bg-white p-1.5 shadow-xl ${caption ? "pb-6" : ""} ${className}`}>
      <div className="relative h-full w-full overflow-hidden"><Image src={src} alt="" fill sizes={sizes} className="object-cover" /></div>
      {caption && <span className="absolute bottom-1 left-0 right-0 text-center font-display text-[11px] uppercase tracking-[0.2em] text-muted">{caption}</span>}
    </div>
  );
}

function MadeToOrder() {
  return (
    <article className={`${card} justify-between bg-ink text-white`}>
      <Wash src={photos.twoStrapBrown} className="opacity-45" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-ink/30 via-ink/70 to-ink/95" />
      <div aria-hidden="true" className="cork-dots-light absolute inset-0" />
      <Pin />
      <span aria-hidden="true" className="text-outline pointer-events-none absolute -bottom-6 -left-2 font-display text-[150px] font-bold leading-none text-gold/20">01</span>
      {/* Two fanned prints beside the headline */}
      <div className="relative flex flex-col gap-3 pt-3">
        <span className="text-[11px] tracking-[0.28em] text-gold">FLYER · MADE TO ORDER</span>
        <div className="relative min-h-[132px]">
          <h3 className="relative z-10 max-w-[52%] font-display text-[42px] font-semibold uppercase leading-[0.9]">Made<br />for you.</h3>
          <Print src={photos.corkCollection} sizes="110px" className="right-0 top-0 aspect-[4/5] w-[30%] rotate-[9deg]" />
          <Print src={photos.twoStrapBrown} sizes="110px" className="right-[19%] top-5 aspect-[4/5] w-[29%] -rotate-[7deg]" />
        </div>
      </div>
      <ol className="relative my-4 flex flex-col gap-2 rounded-2xl bg-ink/55 p-3 text-[13px] text-white/90 ring-1 ring-inset ring-white/10 backdrop-blur-sm">
        {["Choose a style and EU size", "Pay online or on WhatsApp", "We make it, then deliver"].map((t, n) => (
          <li key={t} className="flex items-center gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold font-display text-sm font-semibold text-ink">{n + 1}</span>{t}</li>
        ))}
      </ol>
      <div className="relative flex items-center justify-between">
        <Link href="/#ordering" className="btn btn-gold btn-sm">How to order</Link>
        <RotatingStamp size={60} filled />
      </div>
    </article>
  );
}

function GiftAPair() {
  return (
    <article className={`${card} cork-dots gap-4 bg-dune`}>
      <Wash src={photos.crossSlideBlack} className="opacity-20 saturate-0" />
      <Pin />
      <div className="relative mx-auto mt-4 h-[52%] w-[80%]">
        <Print src={photos.cutoutRed} sizes="(min-width: 768px) 14vw, 45vw" caption="for someone special" className="right-0 top-2 h-[92%] w-[62%] rotate-[7deg]" />
        <Print src={photos.crossSlideBlack} sizes="(min-width: 768px) 16vw, 50vw" caption="boxed & ready" className="left-0 top-0 h-full w-[70%] -rotate-[4deg]" />
        {/* Gift tag */}
        <svg viewBox="0 0 60 36" className="absolute -bottom-3 right-1 w-16 rotate-[-8deg] drop-shadow" aria-hidden="true">
          <path d="M10 2h48v32H10L1 18z" fill="#C9A45C" /><circle cx="11" cy="18" r="3" fill="#EAE2D7" />
          <text x="35" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="#141210" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}>GIFT</text>
        </svg>
      </div>
      <div className="relative flex flex-col gap-1.5">
        <span className="text-[11px] tracking-[0.28em] text-bronze">FLYER · GIFTING</span>
        <h3 className="font-display text-[40px] font-semibold uppercase leading-[0.9] text-ink">Gift a pair</h3>
        <p className="text-sm text-muted">Gift packaging on request. Tell us the size and we&apos;ll handle the rest.</p>
      </div>
      <a href={whatsappLink("a pair as a gift: ")} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm relative mt-auto self-start">Order a gift</a>
    </article>
  );
}

function DmToOrder() {
  return (
    <article className={`${card} justify-between bg-gold text-ink`}>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.35),transparent_55%)]" />
      <Pin className="bg-ink" />
      <div className="relative flex items-start justify-between gap-3 pt-3">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] tracking-[0.28em] text-ink/70">FLYER · QUICK ORDER</span>
          <h3 className="font-display text-[44px] font-bold uppercase leading-[0.88]">DM to<br />order</h3>
        </div>
        <svg viewBox="0 0 24 24" className="mt-6 h-12 w-12 shrink-0 text-ink/85" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
        </svg>
      </div>
      {/* Illustrative chat: a photo message and a reply */}
      <div className="relative flex flex-col gap-2 text-[13px]" aria-hidden="true">
        <div className="w-[62%] self-end overflow-hidden rounded-2xl rounded-br-sm bg-ink p-1">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl"><Image src={photos.perforatedBrown} alt="" fill sizes="180px" className="object-cover object-[50%_40%]" /></div>
          <span className="block px-2 py-1 text-white">This one in size 42?</span>
        </div>
        <span className="max-w-[78%] rounded-2xl rounded-bl-sm bg-white/85 px-3.5 py-2">Yes! Sending details now ✓✓</span>
      </div>
      <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn btn-ink btn-sm relative self-start">Chat on WhatsApp</a>
    </article>
  );
}

function FindYourFit() {
  return (
    <article className={`${card} cork-dots justify-between bg-cream ring-1 ring-inset ring-line`}>
      <Pin />
      <div className="flex items-start justify-between gap-2 pt-3">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] tracking-[0.28em] text-bronze">FLYER · SIZING</span>
          <h3 className="font-display text-[44px] font-semibold uppercase leading-[0.9] text-ink">Find<br />your fit</h3>
        </div>
        <RotatingStamp size={76} tone="bronze" text={`EU ${sizes[0]}–${sizes[sizes.length - 1]} · ${site.name.toUpperCase()} · `} />
      </div>
      {/* Foot + ruler graphic */}
      <svg viewBox="0 0 200 90" className="w-full text-bronze" aria-hidden="true">
        <path d="M30 46c0-16 14-26 40-26h60c26 0 40 12 40 26s-14 26-40 26H70c-26 0-40-10-40-26z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="30" y1="84" x2="170" y2="84" stroke="currentColor" strokeWidth="1.5" />
        {Array.from({ length: 15 }, (_, n) => <line key={n} x1={30 + n * 10} y1="84" x2={30 + n * 10} y2={n % 5 === 0 ? 74 : 79} stroke="currentColor" strokeWidth="1.2" />)}
        <path d="M30 8v8M170 8v8M30 12h140" stroke="#C9A45C" strokeWidth="1.5" />
      </svg>
      <div className="flex items-end justify-between gap-3">
        <p className="text-sm text-muted">Heel to longest toe, in cm. Between sizes? Size up.</p>
        <Link href="/shop#size-guide" className="btn btn-gold btn-sm shrink-0">Size guide</Link>
      </div>
    </article>
  );
}
