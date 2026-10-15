import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import Reveal from "./Reveal";
import Icon from "./Icon";
import { photos } from "@/lib/images";
import { sizes } from "@/lib/content-types";
import { getContent } from "@/lib/content";
import { whatsappHref } from "@/lib/site";

type Wa = (want?: string) => string;

// Four info cards (the flyers): made to order, gifting, DM to order, sizing.
// Phones: a swipeable row. Desktop: a 4-up grid.
export default async function FlyerBoard() {
  const { site } = await getContent();
  const wa: Wa = (want = "") => whatsappHref(site, want);
  const cards = [<MadeToOrder key="a" />, <GiftAPair key="b" wa={wa} />, <DmToOrder key="c" wa={wa} />, <FindYourFit key="d" />];
  return (
    <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-4">
      {cards.map((c, i) => (
        <Reveal key={i} delay={i * 80} className="flex w-[82%] shrink-0 snap-center sm:w-[46%] md:w-auto [&>article]:w-full">{c}</Reveal>
      ))}
    </div>
  );
}

const card = "relative flex min-h-[440px] flex-col gap-5 overflow-hidden rounded-panel p-6";

// White-bordered print of a photo.
function Print({ src, className, sizes, caption }: { src: StaticImageData; className: string; sizes: string; caption?: string }) {
  return (
    <div className={`absolute bg-white p-1.5 shadow-float ${caption ? "pb-6" : ""} ${className}`}>
      <div className="relative h-full w-full overflow-hidden"><Image src={src} alt="" fill sizes={sizes} className="object-cover" /></div>
      {caption && <span className="absolute bottom-1 left-0 right-0 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-muted">{caption}</span>}
    </div>
  );
}

function MadeToOrder() {
  return (
    <article className={`${card} justify-between bg-ink text-white`}>
      <div className="relative min-h-[150px]">
        <h3 className="relative z-10 max-w-[55%] text-[30px] font-bold uppercase leading-[1.02]">Made for you.</h3>
        <Print src={photos.corkCollection} sizes="110px" className="right-0 top-0 aspect-[4/5] w-[32%] rotate-[8deg]" />
        <Print src={photos.twoStrapBrown} sizes="110px" className="right-[20%] top-6 aspect-[4/5] w-[30%] -rotate-[6deg]" />
      </div>
      <ol className="flex flex-col gap-2.5 text-sm text-white/90">
        {["Choose a style and EU size", "Confirm and pay on WhatsApp", "We make it, then deliver"].map((t, n) => (
          <li key={t} className="flex items-center gap-3"><span className="tabular flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[13px] font-semibold text-ink">{n + 1}</span>{t}</li>
        ))}
      </ol>
      <Link href="/#ordering" className="btn btn-light btn-sm self-start">How to order</Link>
    </article>
  );
}

function GiftAPair({ wa }: { wa: Wa }) {
  return (
    <article className={`${card} bg-tile`}>
      <div className="relative mx-auto mt-2 h-[200px] w-[86%]">
        <Print src={photos.cutoutRed} sizes="(min-width: 768px) 14vw, 45vw" caption="for someone special" className="right-0 top-2 h-[92%] w-[60%] rotate-[6deg]" />
        <Print src={photos.crossSlideBlack} sizes="(min-width: 768px) 16vw, 50vw" caption="boxed & ready" className="left-0 top-0 h-full w-[68%] -rotate-[4deg]" />
        <span className="absolute -bottom-3 right-2 flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-float"><Icon name="gift" size={14} />Gift</span>
      </div>
      <div className="mt-auto flex flex-col gap-1.5">
        <h3 className="text-[26px] font-bold uppercase leading-tight">Gift a pair</h3>
        <p className="text-sm text-muted">Gift packaging on request. Tell us the size and we&apos;ll handle the rest.</p>
      </div>
      <a href={wa("a pair as a gift: ")} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm self-start">Order a gift</a>
    </article>
  );
}

function DmToOrder({ wa }: { wa: Wa }) {
  return (
    <article className={`${card} justify-between border border-line bg-white`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[30px] font-bold uppercase leading-[1.02]">DM to order</h3>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tile"><Icon name="chat" size={24} /></span>
      </div>
      {/* Illustrative chat: a photo message and a reply */}
      <div className="flex flex-col gap-2 text-[13px]" aria-hidden="true">
        <div className="w-[64%] self-end overflow-hidden rounded-2xl rounded-br-sm bg-ink p-1">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl"><Image src={photos.perforatedBrown} alt="" fill sizes="180px" className="object-cover object-[50%_40%]" /></div>
          <span className="block px-2 py-1 text-white">This one in size 42?</span>
        </div>
        <span className="flex max-w-[78%] items-center gap-1.5 rounded-2xl rounded-bl-sm bg-tile px-3.5 py-2">Yes! Sending details now <Icon name="check" size={14} /></span>
      </div>
      <a href={wa()} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm self-start">Chat on WhatsApp</a>
    </article>
  );
}

function FindYourFit() {
  return (
    <article className={`${card} justify-between bg-mist`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[30px] font-bold uppercase leading-[1.02]">Find your fit</h3>
        <span className="tabular rounded-full border border-ink px-3 py-1.5 text-xs font-medium">EU {sizes[0]}–{sizes[sizes.length - 1]}</span>
      </div>
      {/* Footprint and ruler: heel to longest toe */}
      <svg viewBox="0 0 200 90" className="w-full text-ink" aria-hidden="true">
        <path d="M30 46c0-16 14-26 40-26h60c26 0 40 12 40 26s-14 26-40 26H70c-26 0-40-10-40-26z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="30" y1="84" x2="170" y2="84" stroke="currentColor" strokeWidth="1.5" />
        {Array.from({ length: 15 }, (_, n) => <line key={n} x1={30 + n * 10} y1="84" x2={30 + n * 10} y2={n % 5 === 0 ? 74 : 79} stroke="currentColor" strokeWidth="1.2" />)}
        <path d="M30 8v8M170 8v8M30 12h140" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">Measure heel to longest toe in centimetres. Between sizes? Size up.</p>
        <Link href="/shop#size-guide" className="btn btn-primary btn-sm self-start">Size guide</Link>
      </div>
    </article>
  );
}
