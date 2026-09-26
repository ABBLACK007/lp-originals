"use client";
import Link from "next/link";
import { useState } from "react";
import Photo from "./Photo";
import { images } from "@/lib/images";
import { site } from "@/lib/site";

const steps = [
  { label: "Choose", title: "Choose your pair", body: "Pick a style, colour and your EU size. Not sure of your size? Check the size guide or send us your foot length on WhatsApp.", cta: "Shop now", href: "/shop" },
  { label: "Pay", title: "Pay your way", body: "Pay by card or bank transfer at checkout, or place your order directly with us on WhatsApp.", cta: "Go to cart", href: "/cart" },
  { label: "Delivery", title: "Handmade and delivered", body: `Every pair is made to order, then delivered to your door. Production takes ${site.productionDays} working days.`, cta: "See sizes", href: "/shop#size-guide" },
];

export default function OrderingSteps() {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col gap-3 md:h-[520px] md:flex-row">
      <Photo src={images.ordering} alt="Feet in LP sandals in four colours" sizes="560px"
        className="hidden h-full w-[560px] shrink-0 rounded-panel md:block" />
      {steps.map((s, i) =>
        i === active ? (
          <div key={s.label} className="flex min-h-[300px] flex-grow flex-col justify-between rounded-panel bg-char p-6 text-white md:p-8">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-[28px] font-medium uppercase leading-tight md:text-[34px]">{s.title}</h3>
              <span className="font-display text-[30px]">{i + 1}</span>
            </div>
            <div className="flex flex-col items-start gap-5">
              <p className="max-w-sm text-[15px] leading-relaxed text-white/85">{s.body}</p>
              <Link href={s.href} className="btn btn-gold btn-sm">{s.cta}</Link>
            </div>
          </div>
        ) : (
          <button key={s.label} type="button" onClick={() => setActive(i)} aria-label={`Show step ${i + 1}: ${s.title}`}
            className="flex items-center justify-between rounded-panel bg-smoke px-6 py-5 text-white md:w-[76px] md:shrink-0 md:flex-col md:px-0 md:py-6">
            <span className="font-display text-[26px] md:order-first md:text-[30px]">{i + 1}</span>
            <span className="text-[15px] md:rotate-180 md:[writing-mode:vertical-rl]">{s.label}</span>
          </button>
        )
      )}
    </div>
  );
}
