"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Photo from "./Photo";
import { images, photos } from "@/lib/images";
import { site } from "@/lib/site";

const steps = [
  { label: "Choose", title: "Choose your pair", body: "Pick a style, colour and your EU size. Not sure of your size? Check the size guide or send us your foot length on WhatsApp.", cta: "Shop now", href: "/shop", photo: photos.corkCollection, position: "object-[50%_40%]" },
  { label: "Pay", title: "Pay your way", body: "Pay by card or bank transfer at checkout, or place your order directly with us on WhatsApp.", cta: "Go to cart", href: "/cart", photo: photos.crossSlideBlack, position: "object-center" },
  { label: "Delivery", title: "Handmade and delivered", body: `Every pair is made to order, then delivered to your door. Production takes ${site.productionDays} working days.`, cta: "See sizes", href: "/shop#size-guide", photo: photos.buckleWorn, position: "object-[50%_70%]" },
];

const icons = [
  <><path d="M6 7h12l-1 13H7L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" /></>,
  <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /><path d="M7 15h3" /></>,
  <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></>,
];

export default function OrderingSteps() {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col gap-3 md:h-[520px] md:flex-row">
      <Photo src={images.ordering} alt="Feet in LP sandals in four colours" sizes="560px"
        className="hidden h-full w-[560px] shrink-0 rounded-panel md:block" />
      {steps.map((s, i) =>
        i === active ? (
          // Open step: its own product photo behind a dark gradient, so the text stays readable.
          <div key={s.label} className="relative flex min-h-[360px] flex-grow animate-fade-in flex-col justify-between overflow-hidden rounded-panel bg-char p-6 text-white md:p-8">
            <Image src={s.photo} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" placeholder="blur" className={`object-cover ${s.position}`} />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,18,16,0.82),rgba(20,18,16,0.35)_38%,rgba(20,18,16,0.55)_60%,rgba(20,18,16,0.96))]" />
            <div aria-hidden="true" className="cork-dots-light absolute inset-0" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] tracking-[0.28em] text-gold">STEP {i + 1} OF 3</span>
                <h3 className="font-display text-[30px] font-medium uppercase leading-tight md:text-[34px]">{s.title}</h3>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold font-display text-[24px] font-semibold text-ink">{i + 1}</span>
            </div>
            <div className="relative flex flex-col items-start gap-5">
              <p className="max-w-sm text-[15px] leading-relaxed text-white/90">{s.body}</p>
              <Link href={s.href} className="btn btn-gold btn-sm">{s.cta}</Link>
            </div>
          </div>
        ) : (
          // Closed step: light cork-coloured tab.
          <button key={s.label} type="button" onClick={() => setActive(i)} aria-label={`Show step ${i + 1}: ${s.title}`}
            className="cork-dots group flex items-center gap-4 rounded-panel bg-dune px-5 py-4 text-ink ring-1 ring-inset ring-line transition-[transform,background-color] duration-150 ease-out hover:bg-sand active:scale-[0.98] md:w-[84px] md:shrink-0 md:flex-col md:justify-between md:px-0 md:py-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-bronze/50 font-display text-[22px] text-bronze">{i + 1}</span>
            <span className="flex flex-col items-start text-left md:rotate-180 md:[writing-mode:vertical-rl]">
              <span className="text-[11px] tracking-[0.24em] text-bronze md:hidden">STEP {i + 1}</span>
              <span className="text-[15px] font-medium">{s.title}</span>
            </span>
            <svg className="ml-auto shrink-0 text-bronze md:ml-0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[i]}</svg>
          </button>
        )
      )}
    </div>
  );
}
