import Link from "next/link";
import { getImageProps, type StaticImageData } from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Photo from "@/components/Photo";
import DropsCarousel from "@/components/DropsCarousel";
import StyleFlyers from "@/components/StyleFlyers";
import OrderingSteps from "@/components/OrderingSteps";
import SectionTitle from "@/components/SectionTitle";
import JsonLd from "@/components/JsonLd";
import HeroSlider, { type HeroArt, type HeroSlide } from "@/components/HeroSlider";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import RotatingStamp from "@/components/RotatingStamp";
import FlyerBoard from "@/components/FlyerBoard";
import { products } from "@/lib/products";
import { images, photos } from "@/lib/images";
import { site, siteUrl, whatsappLink } from "@/lib/site";

const features = [
  { t: "Lightweight", s: "Easy on your feet", icon: <><path d="M20 4C11 4 5 10 5 19" /><path d="M20 4c0 9-6 14-13 14" /><path d="M5 19l7-7" /></> },
  { t: "Cushioned footbed", s: "All-day comfort", icon: <><path d="M3 15c3 0 4-5 9-5s6 3 9 3v3H3z" /><path d="M3 18h18" /></> },
  { t: "Breathable design", s: "Keeps you fresh", icon: <><path d="M3 9c3-2 6 2 9 0s6-2 9 0" /><path d="M3 14c3-2 6 2 9 0s6-2 9 0" /><path d="M3 19c3-2 6 2 9 0s6-2 9 0" /></> },
  { t: "Durable and reliable", s: "Built to last", icon: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></> },
];

const services = [
  { t: "Nationwide delivery", icon: <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></> },
  { t: "Made to order", icon: <><circle cx="6" cy="7" r="2.5" /><circle cx="6" cy="17" r="2.5" /><path d="M8 8.5L20 17" /><path d="M8 15.5L20 7" /></> },
  { t: "Easy size exchange", icon: <><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 5v6h-6" /></> },
  { t: "Gift packaging", icon: <><path d="M4 10h16v10H4z" /><path d="M3 7h18v3H3z" /><path d="M12 7v13" /></> },
  { t: "Secure payment", icon: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></> },
];

const details = [
  { text: "Contoured cork footbed with deep heel cup and arch support", src: photos.corkFootbed, alt: "Cork footbed and suede strap of an LP slide" },
  { text: "Adjustable metal buckles so every strap fits just right", src: images.buckle, alt: "Metal buckle on a leather strap" },
  { text: "Anti-slip rubber sole made for city streets", src: images.sole, alt: "Rubber sole and cork midsole close-up" },
];

// Home "From the workshop" strip: real LP product photos only.
const workshop = [
  { src: photos.buckleGroup, alt: "Two-buckle cork sandals in rust, orange and tan suede", href: "/shop/two-buckle-sandal-rust" },
  { src: photos.cutoutRed, alt: "Red cut-out slides", href: "/shop/cut-out-slide-red" },
  { src: photos.toePostCream, alt: "Toe-post sandals with cream straps", href: "/shop/toe-post-sandal-cream" },
  { src: photos.corkCollection, alt: "Suede cork slides in tan, black and dark brown", href: "/shop/wide-band-slide-tan" },
  { src: photos.crossSlideBlack, alt: "Black cross-over slides", href: "/shop/cross-over-slide-black" },
];

const ticker = ["Handmade in Nigeria", "Cork-latex footbed", "Made to order", "EU sizes 36–46", "Delivered nationwide", "Order on WhatsApp"];

// Art-directed, resized srcsets for photo slides (landscape on tablet/desktop, portrait on phones).
function art(desktop: StaticImageData, mobile: StaticImageData = desktop): HeroArt {
  const common = { alt: "", sizes: "100vw", quality: 75 };
  const d = getImageProps({ ...common, src: desktop }).props;
  const m = getImageProps({ ...common, src: mobile }).props;
  return { desktop: d.srcSet ?? d.src, mobile: m.srcSet ?? m.src, src: m.src, width: mobile.width, height: mobile.height, sizes: "100vw" };
}

const wa = whatsappLink("Hi LP Originals, I'd like to place an order.");

const slides: HeroSlide[] = [
  {
    id: "handmade", kind: "photo", art: art(images.heroDesktop, images.heroMobile),
    eyebrow: "HANDMADE IN NIGERIA", title: "Handmade comfort for every step",
    sub: "Cork-footbed sandals, slides, palms and clogs, made by hand and built to go from native wear to street wear.",
    ctas: [{ label: "Shop now", href: "/shop", style: "gold" }, { label: "WhatsApp order", href: wa, style: "outline", external: true }],
  },
  {
    id: "buckle", kind: "flyer", tone: "ink", word: "Cork", photos: [photos.buckleRust, photos.buckleGroup],
    eyebrow: "NEW DROP", title: "The two-buckle sandal",
    sub: "Rust suede on a contoured cork-latex footbed, with adjustable metal buckles.",
    ctas: [{ label: "Shop the sandal", href: "/shop/two-buckle-sandal-rust", style: "gold" }, { label: "All cork footbed", href: "/shop?category=cork", style: "outline" }],
  },
  {
    id: "promo", kind: "photo", art: art(images.promo), position: "object-[70%_center]",
    eyebrow: site.promo.title.toUpperCase(), title: `${site.promo.discount}, sitewide`,
    sub: `Our festive drop, ${site.promo.dates}. Order early: every pair is made to order.`,
    ctas: [{ label: "Shop the sale", href: "/shop", style: "gold" }],
  },
  {
    id: "slides", kind: "flyer", tone: "sand", word: "Palms", photos: [photos.perforatedBrown, photos.cutoutRed],
    eyebrow: "SLIDES & PALMS", title: "Flat out easy",
    sub: "Leather slides and palms for native and street wear, for men and women.",
    ctas: [{ label: "Shop slides & palms", href: "/shop?category=slides", style: "gold" }],
  },
  {
    id: "order", kind: "flyer", tone: "cocoa", word: "Yours", photos: [photos.corkCollection, photos.bandChocolate],
    eyebrow: "MADE TO ORDER", title: "Your size, your pair",
    sub: "Choose your style and EU size, pay online or on WhatsApp, and we deliver nationwide.",
    ctas: [{ label: "How to order", href: "#ordering", style: "gold" }, { label: "Chat on WhatsApp", href: wa, style: "outline", external: true }],
  },
];

export default function Home() {
  return (
    <main id="main">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Store", name: site.name, url: siteUrl, logo: `${siteUrl}/icons/icon-512.png`, image: `${siteUrl}/opengraph-image.jpg`, description: "Handmade cork-footbed sandals, slides, palms and clogs.", sameAs: [site.instagram], areaServed: "NG" }} />
      <Header variant="float" />
      <HeroSlider slides={slides} />

      <div className="mt-6 md:mt-8"><Marquee items={ticker} /></div>

      <div className="mx-auto flex max-w-page flex-col px-5 md:px-8">
        {/* New drops */}
        <section id="new-drops" className="flex flex-col gap-9 pt-20 md:pt-28">
          <div className="flex items-end justify-between gap-6">
            <SectionTitle light="Meet our" strong="new drops" sub="The latest styles fresh from the workshop. Pick your colour and size before each batch sells out." />
            <Link href="/shop" className="link hidden shrink-0 text-[15px] md:inline">View all</Link>
          </div>
          <Reveal><DropsCarousel items={products.filter((p) => p.isNew)} /></Reveal>
        </section>

        {/* Shop by style flyers */}
        <section className="flex flex-col gap-9 pt-20 md:pt-32">
          <div className="flex items-end justify-between gap-6">
            <SectionTitle light="Shop by" strong="style" />
            <Link href="/shop" className="link shrink-0 text-[15px]">Shop all</Link>
          </div>
          <StyleFlyers />
        </section>

        {/* Promo */}
        <Reveal as="section" className="pt-20 md:pt-32">
          <div className="grid overflow-hidden rounded-[24px] bg-sand md:h-[420px] md:grid-cols-2">
            <div className="cork-dots relative flex flex-col justify-center gap-2 p-7 md:p-14">
              <span className="font-display text-xl font-light uppercase md:text-[30px]">{site.promo.title}</span>
              <span className="font-display text-6xl font-bold uppercase leading-none md:text-[104px]">{site.promo.discount}</span>
              <span className="text-[13px] tracking-[0.1em] text-[#5E5850] md:text-base">Sitewide, {site.promo.dates}</span>
              <div className="mt-6"><Link href="/shop" className="btn btn-ink">Shop the sale</Link></div>
              <RotatingStamp size={96} tone="bronze" text="DETTY DECEMBER · LP DROP · " className="absolute right-6 top-6 hidden md:block" />
            </div>
            <Photo src={images.promo} alt="Model in festive Ankara wear wearing LP slides" sizes="(min-width: 768px) 50vw, 100vw" className="h-[260px] w-full md:h-full" />
          </div>
        </Reveal>

        {/* Step into comfort */}
        <section className="flex flex-col gap-14 pt-20 md:pt-32">
          <Reveal>
            <div className="cork-dots relative grid overflow-hidden rounded-hero bg-dune md:h-[620px] md:grid-cols-2">
              <div className="flex flex-col justify-center gap-5 p-7 md:p-[72px]">
                <span className="text-[15px] tracking-[0.28em] text-bronze md:text-[22px]">STEP INTO</span>
                <span className="font-display text-[88px] font-semibold leading-[0.88] text-bronze md:text-[160px]">COMFORT</span>
                <div className="h-0.5 w-14 bg-bronze" aria-hidden="true" />
                <span className="text-[13px] tracking-[0.3em] text-[#4F4640] md:text-[17px]">EVERYDAY. ANYWHERE.</span>
                <div className="mt-3 hidden flex-col gap-1.5 border-l-2 border-gold pl-4 text-[15px] font-semibold tracking-[0.2em] text-bronze md:flex">
                  <span>PREMIUM COMFORT</span><span>TIMELESS STYLE</span>
                </div>
              </div>
              <div className="relative flex items-center justify-center pb-10 md:pb-0">
                <div className="absolute h-[320px] w-[320px] animate-spin-slow rounded-full border border-dashed border-bronze/40 md:h-[510px] md:w-[510px]" aria-hidden="true" />
                <Photo src={photos.buckleRust} alt="LP two-buckle sandals in rust and tan suede" sizes="(min-width: 768px) 440px, 280px"
                  className="h-[280px] w-[280px] rounded-full shadow-[0_30px_60px_-20px_rgba(20,18,16,0.45)] md:h-[440px] md:w-[440px]" />
                {/* Second photo: worn on feet, as a small round print in the upper corner */}
                <Photo src={photos.buckleWorn} alt="Black buckle slides worn with white linen trousers" sizes="(min-width: 768px) 200px, 128px"
                  className="!absolute right-1 top-0 h-[128px] w-[128px] rounded-full shadow-[0_18px_40px_-14px_rgba(20,18,16,0.5)] ring-4 ring-dune md:right-12 md:top-10 md:h-[200px] md:w-[200px]"
                  imgClassName="object-[50%_62%]" />
                <RotatingStamp size={104} tone="bronze" filled className="absolute left-0 top-0 md:left-10 md:top-16" />
                <Link href="/shop/two-buckle-sandal-rust" className="absolute bottom-8 right-6 rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-white no-underline transition-transform duration-150 active:scale-[0.97] md:bottom-16 md:right-14">Two-Buckle Sandal →</Link>
              </div>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-4 md:gap-5">
            {features.map((f, n) => (
              <Reveal key={f.t} delay={n * 80} className="group flex flex-col items-center gap-3 text-center">
                <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full border border-[#B8964F] transition-[transform,background-color] duration-300 ease-out group-hover:-translate-y-1 group-hover:bg-gold/15 md:h-[68px] md:w-[68px]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8C6B2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{f.icon}</svg>
                </span>
                <span className="text-[13px] font-semibold tracking-[0.08em]">{f.t}</span>
                <span className="text-[13px] text-muted">{f.s}</span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Ordering */}
        <section id="ordering" className="flex flex-col gap-11 pt-20 md:pt-36">
          <SectionTitle center light="Easy" strong="ordering process" sub="Choose, pay and get your handmade pair delivered in three simple steps." />
          <Reveal><OrderingSteps /></Reveal>
        </section>

        {/* Flyer board */}
        <section className="flex flex-col gap-10 pt-20 md:pt-32">
          <SectionTitle light="The LP" strong="flyer board" sub="How we make, pack and send your pair, in four posters." />
          <FlyerBoard />
        </section>

        {/* Details */}
        <section id="details" className="flex flex-col gap-11 pt-20 md:pt-32">
          <SectionTitle center light="Details down to" strong="the stitch" sub="Every pair is cut, stitched and finished by hand. Here is what goes into yours." />
          <div className="grid gap-4 md:grid-cols-3">
            {details.map((d, n) => (
              <Reveal key={d.text} delay={n * 100}>
                <figure className="group relative h-[300px] overflow-hidden rounded-panel md:h-[460px]">
                  <Photo src={d.src} alt={d.alt} sizes="(min-width: 768px) 33vw, 100vw" className="!absolute inset-0"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                  <figcaption className="absolute inset-x-0 top-0 bg-gradient-to-b from-ink/75 to-transparent p-6 pb-16 text-base font-medium leading-snug text-white md:p-8 md:text-lg">
                    <span className="mb-2 block font-display text-sm tracking-[0.2em] text-gold">0{n + 1}</span>{d.text}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* From the workshop */}
        <section className="flex flex-col gap-9 pt-20 md:pt-32">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionTitle light="From the" strong="workshop" sub={`Fresh pairs from our latest batches. Follow ${site.instagramHandle} to see every drop first.`} />
            <div className="flex shrink-0 gap-3">
              <Link href="/gallery" className="btn btn-ink btn-sm">Open gallery</Link>
              <a href={site.instagram} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">Instagram</a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:h-[560px] md:grid-cols-4 md:grid-rows-2 md:gap-5">
            {workshop.map((w, i) => (
              <Reveal key={w.href + i} delay={i * 70} className={i === 0 ? "col-span-2 md:row-span-2" : ""}>
                <Link href={w.href} className={`group relative block h-full overflow-hidden rounded-card ${i === 0 ? "aspect-[4/3] md:aspect-auto" : "aspect-square md:aspect-auto"}`}>
                  <Photo src={w.src} alt={w.alt} sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"} className="!absolute inset-0"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="pt-20 md:pt-28">
          <ul className="grid grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-5 md:gap-5">
            {services.map((s, n) => (
              <Reveal as="li" key={s.t} delay={n * 60} className="flex flex-col items-center gap-3 text-center">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2A2724" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{s.icon}</svg>
                <span className="text-sm font-medium">{s.t}</span>
              </Reveal>
            ))}
          </ul>
        </section>
      </div>

      <div className="-mb-8 mt-20 md:-mb-12 md:mt-28"><Marquee variant="outline" reverse items={["Step into comfort", "LP Originals", "Handmade in Nigeria"]} /></div>
      <Footer />
    </main>
  );
}
