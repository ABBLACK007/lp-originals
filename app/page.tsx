import Link from "next/link";
import Image, { getImageProps } from "next/image";
import { preload } from "react-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Photo from "@/components/Photo";
import Icon, { type IconName } from "@/components/Icon";
import ChipRow from "@/components/ChipRow";
import SearchField from "@/components/SearchField";
import ProductCard from "@/components/ProductCard";
import ProductStand from "@/components/ProductStand";
import OrderingSteps from "@/components/OrderingSteps";
import SectionTitle from "@/components/SectionTitle";
import JsonLd from "@/components/JsonLd";
import HeroSlider, { type HeroArt, type HeroSlide } from "@/components/HeroSlider";
import Reveal from "@/components/Reveal";
import FlyerBoard from "@/components/FlyerBoard";
import { images, photos } from "@/lib/images";
import { categoryThumbs } from "@/lib/category-photos";
import { formatNaira, siteUrl, whatsappHref } from "@/lib/site";
import { fillTokens, findProduct, getContent, visibleProducts, visibleSlides } from "@/lib/content";
import { categories, type Img } from "@/lib/content-types";

// What every pair has, and how ordering works: one quiet strip instead of a wall of cards.
const facts: { icon: IconName; t: string; s: string }[] = [
  { icon: "leaf", t: "Lightweight", s: "Easy on your feet" },
  { icon: "cushion", t: "Cushioned footbed", s: "All-day comfort" },
  { icon: "air", t: "Breathable", s: "Keeps you fresh" },
  { icon: "shield", t: "Built to last", s: "Durable and reliable" },
  { icon: "scissors", t: "Made to order", s: "Cut for your size" },
  { icon: "truck", t: "Nationwide delivery", s: "To your door" },
  { icon: "swap", t: "Easy size exchange", s: "On unworn pairs" },
  { icon: "gift", t: "Gift packaging", s: "On request" },
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

// Small round photos in the promo ("In the drop")
const promoPicks = [
  { src: photos.buckleRust, alt: "Two-Buckle Sandal", href: "/shop/two-buckle-sandal-rust" },
  { src: photos.cutoutRed, alt: "Cut-Out Slide", href: "/shop/cut-out-slide-red" },
  { src: photos.perforatedBrown, alt: "Perforated Cut-Out Slide", href: "/shop/perforated-cut-out-slide-brown" },
  { src: photos.clogMocha, alt: "Closed-Toe Clog", href: "/shop/closed-toe-clog-mocha" },
];

// Art-directed, resized srcsets for photo slides (landscape on tablet/desktop, portrait on phones).
// The first slide's photo is the largest thing on screen, so it's preloaded from the <head> for each screen size.
function art(desktop: Img, mobile: Img = desktop, first = false): HeroArt {
  const common = { alt: "", sizes: "100vw", quality: 75 };
  const d = getImageProps({ ...common, src: desktop }).props;
  const m = getImageProps({ ...common, src: mobile }).props;
  if (first) {
    preload(m.src, { as: "image", imageSrcSet: m.srcSet, imageSizes: "100vw", media: "(max-width: 767px)", fetchPriority: "high" });
    preload(d.src, { as: "image", imageSrcSet: d.srcSet, imageSizes: "100vw", media: "(min-width: 768px)", fetchPriority: "high" });
  }
  return { desktop: d.srcSet ?? d.src, mobile: m.srcSet ?? m.src, src: m.src, width: mobile.width, height: mobile.height, sizes: "100vw" };
}

export default async function Home() {
  const content = await getContent();
  const { site } = content;
  const products = visibleProducts(content);
  const drops = (products.some((p) => p.isNew) ? products.filter((p) => p.isNew) : products).slice(0, 8);
  const featured = findProduct(content, "two-buckle-sandal-rust") ?? products[0];
  const whatsappLink = (want = "") => whatsappHref(site, want);
  const slides: HeroSlide[] = visibleSlides(content).map((s, n) => ({
    id: s.id, art: art(s.image, s.mobileImage ?? s.image, n === 0), focus: s.focus,
    title: fillTokens(s.title, content), sub: fillTokens(s.sub, content),
    ctas: s.ctas.map((c) => c.href === "whatsapp"
      ? { label: c.label, href: whatsappLink(), style: c.style, external: true }
      : { label: c.label, href: c.href, style: c.style, external: c.href.startsWith("https://") }),
  }));
  const count = (id: string) => products.filter((p) => p.category === id).length;

  return (
    <main id="main">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Store", name: site.name, url: siteUrl, logo: `${siteUrl}/icons/icon-512.png`, image: `${siteUrl}/opengraph-image.jpg`, description: "Handmade cork-footbed sandals, slides, palms and clogs.", sameAs: [site.instagram], areaServed: "NG" }} />
      {/* The hero slides change, so the page's main heading is fixed text for search engines and screen readers. */}
      <h1 className="sr-only">{site.name}: handmade cork-footbed sandals, slides, palms and clogs</h1>
      <Header variant="float" />
      <HeroSlider slides={slides} />

      <div className="mx-auto flex max-w-page flex-col px-5 md:px-8">
        {/* The store: who we are, search, categories */}
        <section aria-labelledby="find-heading" className="flex flex-col gap-6 pt-8 md:pt-12">
          <h2 id="find-heading" className="sr-only">Find your pair</h2>
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
            <div className="flex items-center justify-between gap-4 md:contents">
              <div className="flex min-w-0 flex-col gap-0.5 md:shrink-0">
                <span className="text-[17px] font-semibold md:text-xl">{site.name}</span>
                <span className="flex items-center gap-1.5 text-[13px] text-muted md:text-sm"><Icon name="pin" size={15} />Handmade in Nigeria · delivered nationwide</span>
              </div>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="Chat with LP Wears on WhatsApp" className="icon-btn md:order-last"><Icon name="chat" size={20} /></a>
            </div>
            <div className="md:ml-auto md:w-full md:max-w-xl">
              <SearchField filter={
                <Link href="/shop" aria-label="Sort and filter in the shop" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-tile"><Icon name="sliders" size={20} /></Link>
              } />
            </div>
          </div>
          <ChipRow title="Categories" label="Shop by style">
            <Link href="/shop" className="chip shrink-0 snap-start py-1.5 pl-1.5 pr-4 no-underline">
              <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[7px] bg-tile"><Image src={categoryThumbs.all} alt="" fill sizes="32px" className="object-cover" /></span>
              <span className="whitespace-nowrap">All styles</span><span className="tabular text-[13px] opacity-60">{products.length}</span>
            </Link>
            {categories.map((c) => (
              <Link key={c.id} href={`/shop/category/${c.id}`} className="chip shrink-0 snap-start py-1.5 pl-1.5 pr-4 no-underline">
                <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[7px] bg-tile"><Image src={categoryThumbs[c.id]} alt="" fill sizes="32px" className="object-cover" /></span>
                <span className="whitespace-nowrap">{c.label}</span><span className="tabular text-[13px] opacity-60">{count(c.id)}</span>
              </Link>
            ))}
          </ChipRow>
        </section>

        {/* New drops */}
        <section id="new-drops" className="flex flex-col gap-6 pt-12 md:pt-16">
          <SectionTitle title="New drops" sub="Fresh from the workshop. Pick your colour and size before each batch sells out."
            action={<Link href="/shop" className="link whitespace-nowrap text-sm font-medium">See all</Link>} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {drops.map((p, n) => <Reveal key={p.slug} delay={(n % 4) * 60} className="h-full"><ProductCard p={p} /></Reveal>)}
          </div>
        </section>

        {/* Featured pair on its stand */}
        {featured && (
          <Reveal as="section" className="pt-16 md:pt-24">
            <div className="grid grid-cols-1 items-center gap-12 rounded-panel bg-mist px-5 pb-12 pt-10 md:grid-cols-2 md:gap-10 md:p-14">
              <ProductStand images={featured.images} alt={`${featured.name}, ${featured.material}`} art={featured.art} thumbs={false} />
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <h2 className="text-[32px] font-bold uppercase leading-[1.02] md:text-[52px]">Step into comfort</h2>
                  <p className="max-w-md text-[15px] leading-relaxed text-muted">Everyday, anywhere. A contoured cork footbed with a deep heel cup, under suede you can wear from morning to night.</p>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-y border-line py-4">
                  <span className="flex flex-col"><span className="text-base font-semibold">{featured.name}</span><span className="text-sm text-muted">{featured.material}</span></span>
                  <span className="tabular text-lg font-semibold">{formatNaira(featured.price)}</span>
                </div>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  {facts.slice(0, 4).map((f) => (
                    <li key={f.t} className="flex items-center gap-2.5"><Icon name={f.icon} size={20} />{f.t}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link href={`/shop/${featured.slug}`} className="btn btn-primary">Shop the sandal</Link>
                  <Link href={`/shop/category/${featured.category}`} className="btn btn-secondary">More like this</Link>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* Promo: discount and dates are set in /admin (Settings) */}
        {site.promo.enabled && (
          <Reveal as="section" className="pt-16 md:pt-24">
            <div className="grid grid-cols-1 overflow-hidden rounded-panel bg-ink text-white md:grid-cols-[1.1fr_1fr]">
              <div className="flex flex-col gap-6 p-7 md:p-12">
                <div className="flex flex-col gap-3">
                  <h2 className="text-[22px] font-semibold md:text-[28px]">{site.promo.title}</h2>
                  <span className="text-[56px] font-bold uppercase leading-none tracking-[-0.03em] md:text-[88px]">{site.promo.discount}</span>
                  <span className="text-sm text-white/70">Sitewide, {site.promo.dates}</span>
                </div>
                <p className="max-w-md text-[15px] leading-relaxed text-white/80">
                  Our festive edit for owambe, December weddings and nights out. Every pair is still handmade to order, so order early: production takes {site.productionDays} working days before delivery.
                </p>
                <ul className="grid gap-2.5 text-sm text-white/90 sm:grid-cols-2">
                  {["Every style: sandals, slides, palms and clogs", "Made to order in EU sizes 36 to 46", "Delivered nationwide", "Gift packaging on request"].map((t) => (
                    <li key={t} className="flex gap-2.5"><Icon name="check" size={18} className="mt-0.5 shrink-0" />{t}</li>
                  ))}
                </ul>
                <div className="flex flex-col gap-3">
                  <span className="text-sm text-white/70">In the drop</span>
                  <div className="flex flex-wrap gap-2.5">
                    {promoPicks.map((p) => (
                      <Link key={p.href} href={p.href} aria-label={p.alt} className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white/20 transition-transform duration-150 ease-out active:scale-95 md:h-16 md:w-16">
                        <Photo src={p.src} alt="" sizes="64px" className="!absolute inset-0" />
                      </Link>
                    ))}
                    <Link href="/shop" aria-label="See every style" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 text-white no-underline transition-colors hover:border-white md:h-16 md:w-16"><Icon name="arrowRight" size={20} /></Link>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/shop" className="btn btn-light">Shop the sale</Link>
                  <a href={whatsappLink(`a pair from the ${site.promo.title}: `)} target="_blank" rel="noreferrer" className="btn btn-ghost-light">Order on WhatsApp</a>
                </div>
              </div>
              <Photo src={images.promo} alt="Model in festive Ankara wear wearing LP slides" sizes="(min-width: 768px) 46vw, 100vw"
                className="h-[340px] w-full md:h-full md:min-h-[560px]" imgClassName="grayscale contrast-[1.05]" />
            </div>
          </Reveal>
        )}

        {/* Made the LP way */}
        <section aria-labelledby="facts-heading" className="pt-16 md:pt-24">
          <h2 id="facts-heading" className="mb-6 text-[22px] font-semibold md:text-[30px]">Made the LP way</h2>
          <ul className="grid grid-cols-2 border-t border-line md:grid-cols-4">
            {facts.map((f) => (
              <li key={f.t} className="flex items-center gap-3.5 border-b border-line py-5 pr-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tile"><Icon name={f.icon} size={21} /></span>
                <span className="flex flex-col leading-snug"><span className="text-sm font-medium">{f.t}</span><span className="text-[13px] text-muted">{f.s}</span></span>
              </li>
            ))}
          </ul>
        </section>

        {/* Ordering */}
        <section id="ordering" className="flex flex-col gap-8 pt-16 md:pt-24">
          <SectionTitle title="How to order" sub="Choose, confirm on WhatsApp, and get your handmade pair delivered." />
          <Reveal><OrderingSteps /></Reveal>
        </section>

        {/* Good to know (flyers) */}
        <section className="flex flex-col gap-8 pt-16 md:pt-24">
          <SectionTitle title="Good to know" sub="How we make, pack and send your pair." />
          <FlyerBoard />
        </section>

        {/* Details */}
        <section id="details" className="flex flex-col gap-8 pt-16 md:pt-24">
          <SectionTitle title="Details down to the stitch" sub="Every pair is cut, stitched and finished by hand. Here is what goes into yours." />
          <div className="grid gap-4 md:grid-cols-3">
            {details.map((d, n) => (
              <Reveal key={d.text} delay={n * 100}>
                <figure className="group relative h-[300px] overflow-hidden rounded-panel bg-tile md:h-[440px]">
                  {/* zoom-out: the photo starts zoomed in and settles as the card scrolls into view (see globals.css) */}
                  <Photo src={d.src} alt={d.alt} sizes="(min-width: 768px) 33vw, 100vw" className="zoom-out !absolute inset-0"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
                  <figcaption className="zoom-caption absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20 text-base font-medium leading-snug text-white md:p-7 md:pt-24">{d.text}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* From the workshop */}
        <section className="flex flex-col gap-8 pt-16 md:pt-24">
          <SectionTitle title="From the workshop" sub={`Fresh pairs from our latest batches. Follow ${site.instagramHandle} to see every drop first.`}
            action={<div className="hidden gap-2 sm:flex"><Link href="/gallery" className="btn btn-primary btn-sm">Open gallery</Link><a href={site.instagram} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">Instagram</a></div>} />
          <div className="grid grid-cols-2 gap-3 md:h-[560px] md:grid-cols-4 md:grid-rows-2 md:gap-5">
            {workshop.map((w, i) => (
              <Reveal key={w.href + i} delay={i * 70} className={i === 0 ? "col-span-2 md:row-span-2" : ""}>
                <Link href={w.href} aria-label={w.alt} className={`group relative block h-full overflow-hidden rounded-card bg-tile ${i === 0 ? "aspect-[4/3] md:aspect-auto" : "aspect-square md:aspect-auto"}`}>
                  <Photo src={w.src} alt={w.alt} sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"} className="!absolute inset-0"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="flex gap-3 sm:hidden"><Link href="/gallery" className="btn btn-primary btn-sm flex-1">Open gallery</Link><a href={site.instagram} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm flex-1">Instagram</a></div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
