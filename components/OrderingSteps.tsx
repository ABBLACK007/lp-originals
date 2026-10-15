"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Photo from "./Photo";
import Icon, { type IconName } from "./Icon";
import { images, photos } from "@/lib/images";
import { useStore } from "./StoreProvider";

const makeSteps = (productionDays: string) => [
  { title: "Choose your pair", body: "Pick a style, colour and your EU size. Not sure of your size? Check the size guide or send us your foot length on WhatsApp.", cta: "Shop now", href: "/shop", photo: photos.corkCollection, position: "object-[50%_40%]", icon: "bag" as IconName },
  { title: "Confirm on WhatsApp", body: "Send your cart or receipt on WhatsApp and we'll confirm payment and delivery with you. Card payment at checkout is coming soon.", cta: "Go to cart", href: "/cart", photo: photos.crossSlideBlack, position: "object-center", icon: "chat" as IconName },
  { title: "Handmade and delivered", body: `Every pair is made to order, then delivered to your door. Production takes ${productionDays} working days.`, cta: "See sizes", href: "/shop#size-guide", photo: photos.buckleWorn, position: "object-[50%_70%]", icon: "truck" as IconName },
];

// Three steps; one is open at a time (an accordion that runs sideways on wide screens).
export default function OrderingSteps() {
  const [active, setActive] = useState(0);
  const steps = makeSteps(useStore().site.productionDays);
  return (
    <div className="flex flex-col gap-3 md:h-[500px] md:flex-row">
      <Photo src={images.ordering} alt="Feet in LP sandals in four colours" sizes="520px"
        className="hidden h-full w-[min(520px,38%)] shrink-0 rounded-panel bg-tile lg:block" />
      {steps.map((s, i) =>
        i === active ? (
          <div key={s.title} className="relative flex min-h-[380px] flex-grow animate-fade-in flex-col justify-between overflow-hidden rounded-panel bg-ink p-6 text-white md:p-8">
            <Image src={s.photo} alt="" fill sizes="(min-width: 768px) 45vw, 100vw" placeholder="blur" className={`object-cover ${s.position}`} />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/30 to-black/90" />
            <div className="relative flex items-start justify-between gap-4">
              <h3 className="text-[24px] font-semibold leading-tight md:text-[28px]"><span className="sr-only">Step {i + 1} of 3: </span>{s.title}</h3>
              <span aria-hidden="true" className="tabular flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-lg font-semibold text-ink">{i + 1}</span>
            </div>
            <div className="relative flex flex-col items-start gap-5">
              <p className="max-w-sm text-[15px] leading-relaxed text-white/90">{s.body}</p>
              <Link href={s.href} className="btn btn-light btn-sm gap-2">{s.cta}<Icon name="arrowRight" size={16} /></Link>
            </div>
          </div>
        ) : (
          <button key={s.title} type="button" onClick={() => setActive(i)} aria-label={`Show step ${i + 1}: ${s.title}`}
            className="group flex items-center gap-4 rounded-panel bg-tile px-5 py-4 text-left text-ink transition-[transform,background-color] duration-150 ease-out hover:bg-line active:scale-[0.98] md:w-[84px] md:shrink-0 md:flex-col md:justify-between md:px-0 md:py-6">
            <span className="tabular flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink text-lg font-semibold">{i + 1}</span>
            <span className="text-[15px] font-medium md:rotate-180 md:[writing-mode:vertical-rl]">{s.title}</span>
            <Icon name={s.icon} size={22} className="ml-auto shrink-0 md:ml-0" />
          </button>
        )
      )}
    </div>
  );
}
