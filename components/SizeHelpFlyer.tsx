import Link from "next/link";
import Image from "next/image";
import Reveal from "./Reveal";
import RotatingStamp from "./RotatingStamp";
import { photos } from "@/lib/images";
import { whatsappLink } from "@/lib/site";

// Wide banner flyer for shop and product pages: size help, with WhatsApp as the fallback.
export default function SizeHelpFlyer() {
  return (
    <Reveal>
      <aside className="cork-dots-light relative grid overflow-hidden rounded-hero bg-ink text-white md:grid-cols-[1.2fr_1fr]">
        <span aria-hidden="true" className="text-outline pointer-events-none absolute -bottom-6 left-4 select-none font-display text-[140px] font-bold uppercase leading-none text-gold/15 md:text-[220px]">FIT</span>
        <div className="relative flex flex-col gap-5 p-7 md:p-12">
          <span className="text-[11px] tracking-[0.3em] text-gold">NOT SURE OF YOUR SIZE?</span>
          <h2 className="font-display text-[44px] font-semibold uppercase leading-[0.92] md:text-[64px]">Send us your<br />foot length</h2>
          <p className="max-w-md text-[15px] leading-relaxed text-white/80">Stand on paper, mark heel and longest toe, measure in centimetres and message us. We&apos;ll match you to the right EU size before we make your pair.</p>
          <div className="flex flex-wrap gap-3">
            <a href={whatsappLink("help choosing my size. My foot length is ___ cm.")} target="_blank" rel="noreferrer" className="btn btn-gold">Ask on WhatsApp</a>
            <Link href="/shop#size-guide" className="btn btn-outline-light">Size guide</Link>
          </div>
        </div>
        <div className="relative hidden items-center justify-center p-10 md:flex">
          <div className="relative h-[300px] w-[240px] rotate-[4deg] bg-white p-2.5 pb-9 shadow-2xl transition-transform duration-500 ease-out hover:rotate-0">
            <div className="relative h-full w-full overflow-hidden"><Image src={photos.corkFootbed} alt="Cork footbed of an LP slide" fill sizes="240px" className="object-cover" /></div>
            <span className="absolute bottom-2 left-0 right-0 text-center font-display text-sm uppercase tracking-[0.2em] text-muted">made to measure</span>
          </div>
          <RotatingStamp size={110} className="absolute bottom-8 right-10" />
        </div>
      </aside>
    </Reveal>
  );
}
