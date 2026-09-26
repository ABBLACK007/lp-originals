import Link from "next/link";
import { getImageProps } from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Photo from "@/components/Photo";
import DropsCarousel from "@/components/DropsCarousel";
import StyleFlyers from "@/components/StyleFlyers";
import OrderingSteps from "@/components/OrderingSteps";
import SectionTitle from "@/components/SectionTitle";
import JsonLd from "@/components/JsonLd";
import { getProduct, products } from "@/lib/products";
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

// Art-directed hero: landscape photo on tablet/desktop, portrait on phones. Both resized to WebP by next/image.
function heroSources() {
  const common = { alt: "", sizes: "100vw", quality: 75 };
  const { props: { srcSet: desktop } } = getImageProps({ ...common, src: images.heroDesktop });
  const { props: { srcSet: mobile, ...img } } = getImageProps({ ...common, src: images.heroMobile, priority: true });
  return { desktop, mobile, img };
}

export default function Home() {
  const hero = heroSources();
  const featured = getProduct("two-buckle-sandal-rust")!;
  return (
    <main id="main">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Store", name: site.name, url: siteUrl, logo: `${siteUrl}/icons/icon-512.png`, image: `${siteUrl}/opengraph-image.jpg`, description: "Handmade cork-footbed sandals, slides, palms and clogs.", sameAs: [site.instagram], areaServed: "NG" }} />
      {/* Hero */}
      <section className="px-3 pt-3 md:px-6 md:pt-6">
        <div className="relative flex h-[calc(100svh-24px)] max-h-[780px] min-h-[600px] flex-col justify-between overflow-hidden rounded-hero bg-ink px-5 pb-7 pt-5 md:h-[780px] md:px-10 md:pb-10 md:pt-7">
          <picture className="absolute inset-0">
            <source media="(min-width: 768px)" srcSet={hero.desktop} />
            <source srcSet={hero.mobile} />
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img {...hero.img} className="h-full w-full object-cover" />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/30 to-ink/70" aria-hidden="true" />
          <Header variant="overlay" />
          <div className="relative flex flex-col gap-5 md:-mt-10 md:items-center md:text-center">
            <span className="self-start rounded-full bg-ink/50 px-3.5 py-1.5 text-[11px] tracking-[0.3em] text-gold backdrop-blur md:self-center md:text-[12px]">HANDMADE IN NIGERIA</span>
            <h1 className="max-w-[900px] text-balance font-display text-[52px] font-medium uppercase leading-[0.98] text-white md:text-[96px]">Handmade comfort for every step</h1>
            <p className="max-w-[560px] text-[15px] leading-relaxed text-white/85 md:text-lg">Cork-footbed sandals, slides, palms and clogs, made by hand and built to go from native wear to street wear.</p>
          </div>
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-4">
              <span className="text-[13px] text-white/85 md:text-[15px]">Made to order, delivered nationwide</span>
              <div className="flex gap-3 md:items-center md:gap-5">
                <Link href="/shop" className="btn btn-gold flex-grow md:flex-grow-0">Shop now</Link>
                <a href={whatsappLink("Hi LP Originals, I'd like to place an order.")} target="_blank" rel="noreferrer" className="btn btn-outline-light flex-grow px-6 md:hidden">WhatsApp order</a>
                <Link href="#new-drops" className="hidden text-base text-white underline underline-offset-4 md:inline">See new drops</Link>
              </div>
            </div>
            {/* Real product teaser, glass card */}
            <Link href={`/shop/${featured.slug}`} className="group hidden w-[340px] items-center gap-4 rounded-panel bg-white/10 p-3 pr-5 no-underline ring-1 ring-inset ring-white/15 backdrop-blur-md transition-colors hover:bg-white/15 md:flex">
              <Photo src={featured.images[0]} alt="" sizes="80px" className="h-[100px] w-20 shrink-0 rounded-xl" />
              <div className="flex flex-col gap-1">
                <span className="text-[11px] tracking-[0.22em] text-gold">NEW DROP</span>
                <span className="font-display text-2xl font-medium uppercase leading-none text-white">{featured.name}</span>
                <span className="text-sm text-white/75">{featured.material} · Shop now →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-page flex-col px-5 md:px-8">
        {/* New drops */}
        <section id="new-drops" className="flex flex-col gap-9 pt-20 md:pt-32">
          <div className="flex items-end justify-between gap-6">
            <SectionTitle light="Meet our" strong="new drops" sub="The latest styles fresh from the workshop. Pick your colour and size before each batch sells out." />
            <Link href="/shop" className="link hidden shrink-0 text-[15px] md:inline">View all</Link>
          </div>
          <DropsCarousel items={products.filter((p) => p.isNew)} />
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
        <section className="pt-20 md:pt-32">
          <div className="grid overflow-hidden rounded-[24px] bg-sand md:h-[420px] md:grid-cols-2">
            <div className="flex flex-col justify-center gap-2 p-7 md:p-14">
              <span className="font-display text-xl font-light uppercase md:text-[30px]">{site.promo.title}</span>
              <span className="font-display text-6xl font-bold uppercase leading-none md:text-[104px]">{site.promo.discount}</span>
              <span className="text-[13px] tracking-[0.1em] text-[#5E5850] md:text-base">Sitewide, {site.promo.dates}</span>
              <div className="mt-6"><Link href="/shop" className="btn btn-ink">Shop the sale</Link></div>
            </div>
            <Photo src={images.promo} alt="Model in festive Ankara wear wearing LP slides" sizes="(min-width: 768px) 50vw, 100vw" className="h-[260px] w-full md:h-full" />
          </div>
        </section>

        {/* Step into comfort */}
        <section className="flex flex-col gap-14 pt-20 md:pt-32">
          <div className="relative grid overflow-hidden rounded-hero bg-dune md:h-[620px] md:grid-cols-2">
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
              <div className="absolute h-[320px] w-[320px] rounded-full border border-bronze/30 md:h-[500px] md:w-[500px]" aria-hidden="true" />
              <Photo src={photos.buckleRust} alt="LP two-buckle sandals in rust and tan suede" sizes="(min-width: 768px) 440px, 280px"
                className="h-[280px] w-[280px] rounded-full shadow-[0_30px_60px_-20px_rgba(20,18,16,0.45)] md:h-[440px] md:w-[440px]" />
              <Link href="/shop/two-buckle-sandal-rust" className="absolute bottom-8 right-6 rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-white no-underline md:bottom-16 md:right-14">Two-Buckle Sandal →</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-4 md:gap-5">
            {features.map((f) => (
              <div key={f.t} className="flex flex-col items-center gap-3 text-center">
                <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full border border-[#B8964F] md:h-[68px] md:w-[68px]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8C6B2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{f.icon}</svg>
                </span>
                <span className="text-[13px] font-semibold tracking-[0.08em]">{f.t}</span>
                <span className="text-[13px] text-muted">{f.s}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Ordering */}
        <section id="ordering" className="flex flex-col gap-11 pt-20 md:pt-36">
          <SectionTitle center light="Easy" strong="ordering process" sub="Choose, pay and get your handmade pair delivered in three simple steps." />
          <OrderingSteps />
        </section>

        {/* Details */}
        <section id="details" className="flex flex-col gap-11 pt-20 md:pt-36">
          <SectionTitle center light="Details down to" strong="the stitch" sub="Every pair is cut, stitched and finished by hand. Here is what goes into yours." />
          <div className="grid gap-4 md:grid-cols-3">
            {details.map((d) => (
              <figure key={d.text} className="relative h-[300px] overflow-hidden rounded-panel md:h-[460px]">
                <Photo src={d.src} alt={d.alt} sizes="(min-width: 768px) 33vw, 100vw" className="!absolute inset-0" />
                <figcaption className="absolute inset-x-0 top-0 bg-gradient-to-b from-ink/75 to-transparent p-6 pb-16 text-base font-medium leading-snug text-white md:p-8 md:text-lg">{d.text}</figcaption>
              </figure>
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
              <Link key={w.href + i} href={w.href} className={`group relative overflow-hidden rounded-card ${i === 0 ? "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto" : "aspect-square md:aspect-auto"}`}>
                <Photo src={w.src} alt={w.alt} sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"} className="!absolute inset-0"
                  imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
              </Link>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="pt-20 md:pt-28">
          <ul className="grid grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-5 md:gap-5">
            {services.map((s) => (
              <li key={s.t} className="flex flex-col items-center gap-3 text-center">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2A2724" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{s.icon}</svg>
                <span className="text-sm font-medium">{s.t}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <Footer />
    </main>
  );
}
