import Icon from "./Icon";

// The mockup's opening screen: one full-height black & white photo, a bold uppercase title and a line of text
// centred near the bottom, and a white "Next" button that moves on to the store. Uses the first visible hero
// slide from /admin (photo, headline, text).
export type OpeningArt = { srcSet: string; src: string; width: number; height: number; focus?: string };

export default function Onboarding({ art, title, sub }: { art: OpeningArt; title: string; sub: string }) {
  return (
    <section aria-label="Welcome" className="px-3 pt-3">
      <div className="relative flex h-[calc(100svh-112px)] max-h-[860px] min-h-[540px] flex-col items-center justify-end overflow-hidden rounded-[24px] bg-ink px-8 pb-10 text-center text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={art.src} srcSet={art.srcSet} sizes="430px" width={art.width} height={art.height} alt="" fetchPriority="high" decoding="async"
          style={art.focus ? { objectPosition: art.focus } : undefined}
          className="absolute inset-0 h-full w-full object-cover contrast-[1.05] grayscale" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/95" />
        <div className="relative flex w-full flex-col items-center">
          <h2 className="animate-rise text-balance text-[38px] font-semibold uppercase leading-[1.22] tracking-[0.01em]">{title}</h2>
          {sub && <p className="mt-3 max-w-[30ch] animate-rise font-read text-[15px] leading-snug text-white/90 [animation-delay:80ms]">{sub}</p>}
          <a href="#store" className="mt-10 flex h-[50px] w-[78%] animate-rise items-center justify-center gap-3 rounded-[5px] bg-white text-[16px] font-medium tracking-[0.04em] text-ink no-underline transition-transform duration-150 ease-out [animation-delay:160ms] active:scale-[0.97]">
            Next <Icon name="arrowLong" size={22} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </section>
  );
}
