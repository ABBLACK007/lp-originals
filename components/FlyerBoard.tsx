import Link from "next/link";
import Image from "next/image";
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
        <Reveal key={i} delay={i * 90} className="w-[78%] shrink-0 snap-center sm:w-[46%] md:w-auto">
          <div className={`h-full transition-transform duration-500 ease-out hover:rotate-0 hover:-translate-y-1.5 ${tilt[i]}`}>{f}</div>
        </Reveal>
      ))}
    </div>
  );
}

const card = "relative flex aspect-[4/5] flex-col overflow-hidden rounded-panel p-6 shadow-[0_24px_48px_-24px_rgba(20,18,16,0.45)]";

function Pin({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full bg-gold shadow-[0_2px_4px_rgba(0,0,0,0.35)] ${className}`} />;
}

function MadeToOrder() {
  return (
    <article className={`${card} cork-dots-light justify-between bg-ink text-white`}>
      <Pin />
      <span aria-hidden="true" className="text-outline pointer-events-none absolute -right-3 bottom-16 font-display text-[120px] font-bold leading-none text-gold/25">01</span>
      <div className="relative flex flex-col gap-3 pt-3">
        <span className="text-[11px] tracking-[0.28em] text-gold">FLYER · MADE TO ORDER</span>
        <h3 className="font-display text-[44px] font-semibold uppercase leading-[0.9]">Made<br />for you.</h3>
      </div>
      <ol className="relative flex flex-col gap-2 text-sm text-white/85">
        {["Choose a style and EU size", "Pay online or on WhatsApp", "We make it, then deliver"].map((t, n) => (
          <li key={t} className="flex items-center gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/60 font-display text-sm text-gold">{n + 1}</span>{t}</li>
        ))}
      </ol>
      <div className="relative flex items-end justify-between">
        <Link href="/#ordering" className="btn btn-gold btn-sm">How to order</Link>
        <div className="relative h-20 w-16 rotate-6 overflow-hidden rounded-lg bg-white p-1 shadow-xl">
          <div className="relative h-full w-full overflow-hidden rounded"><Image src={photos.twoStrapBrown} alt="" fill sizes="64px" className="object-cover" /></div>
        </div>
      </div>
    </article>
  );
}

function GiftAPair() {
  return (
    <article className={`${card} cork-dots gap-4 bg-dune`}>
      <Pin />
      <div className="relative mx-auto mt-4 h-[52%] w-[74%] -rotate-3 bg-white p-2 pb-7 shadow-xl">
        <div className="relative h-full w-full overflow-hidden"><Image src={photos.crossSlideBlack} alt="Black cross-over slides in their gift boxes" fill sizes="(min-width: 768px) 18vw, 60vw" className="object-cover" /></div>
        <span className="absolute bottom-1.5 left-0 right-0 text-center font-display text-sm uppercase tracking-[0.2em] text-muted">boxed &amp; ready</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] tracking-[0.28em] text-bronze">FLYER · GIFTING</span>
        <h3 className="font-display text-[40px] font-semibold uppercase leading-[0.9] text-ink">Gift a pair</h3>
        <p className="text-sm text-muted">Gift packaging on request. Tell us the size and we&apos;ll handle the rest.</p>
      </div>
      <a href={whatsappLink("Hi LP Originals, I'd like to order a pair as a gift.")} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm mt-auto self-start">Order a gift</a>
    </article>
  );
}

function DmToOrder() {
  return (
    <article className={`${card} justify-between bg-gold text-ink`}>
      <Pin className="bg-ink" />
      <div className="flex flex-col gap-3 pt-3">
        <span className="text-[11px] tracking-[0.28em] text-ink/70">FLYER · QUICK ORDER</span>
        <h3 className="font-display text-[44px] font-bold uppercase leading-[0.88]">DM to<br />order</h3>
      </div>
      {/* Chat bubbles graphic */}
      <div className="flex flex-col gap-2 text-[13px]" aria-hidden="true">
        <span className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-ink px-3.5 py-2 text-white">Hi LP! Two-Buckle Sandal, size 42 please</span>
        <span className="max-w-[80%] rounded-2xl rounded-bl-sm bg-white/80 px-3.5 py-2">Lovely choice. Sending details now ✓✓</span>
      </div>
      <a href={whatsappLink("Hi LP Originals, I'd like to place an order.")} target="_blank" rel="noreferrer" className="btn btn-ink btn-sm self-start">Chat on WhatsApp</a>
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
