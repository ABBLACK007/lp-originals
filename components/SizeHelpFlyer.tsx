import Link from "next/link";
import Image from "next/image";
import Reveal from "./Reveal";
import { photos } from "@/lib/images";
import { getContent } from "@/lib/content";
import { whatsappHref } from "@/lib/site";

// Wide banner for shop and product pages: size help, with WhatsApp as the fallback.
export default async function SizeHelpFlyer() {
  const { site } = await getContent();
  const whatsappLink = (want = "") => whatsappHref(site, want);
  return (
    <Reveal>
      <aside className="relative grid grid-cols-1 overflow-hidden rounded-panel bg-ink text-white md:grid-cols-[1.3fr_1fr]">
        <div className="relative flex flex-col gap-5 p-7 md:p-12">
          <h2 className="text-[30px] font-bold uppercase leading-[1.02] md:text-[44px]">Not sure of your size?</h2>
          <p className="max-w-md text-[15px] leading-relaxed text-white/80">Stand on paper, mark your heel and longest toe, measure in centimetres and send it to us. We&apos;ll match you to the right EU size before we make your pair.</p>
          <div className="flex flex-wrap gap-3">
            <a href={whatsappLink("help choosing my size. My foot length is ___ cm.")} target="_blank" rel="noreferrer" className="btn btn-light">Ask on WhatsApp</a>
            <Link href="/shop#size-guide" className="btn btn-ghost-light">Size guide</Link>
          </div>
        </div>
        <div className="relative hidden items-center justify-center p-10 md:flex">
          <div className="relative h-[280px] w-[224px] rotate-[3deg] bg-white p-2.5 pb-9 shadow-float transition-transform duration-500 ease-out hover:rotate-0">
            <div className="relative h-full w-full overflow-hidden"><Image src={photos.corkFootbed} alt="Cork footbed of an LP slide" fill sizes="224px" className="object-cover" /></div>
            <span className="absolute bottom-2.5 left-0 right-0 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-muted">made to measure</span>
          </div>
        </div>
      </aside>
    </Reveal>
  );
}
