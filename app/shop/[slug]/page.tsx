import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import BuyBox from "@/components/BuyBox";
import JsonLd from "@/components/JsonLd";
import { categoryLabel, getProduct, products, type Product } from "@/lib/products";
import { formatNaira, site, siteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false; // unknown slugs 404 without rendering

const describe = (p: Product) =>
  `${p.name} in ${p.material.toLowerCase()}${p.footbed ? ` on a ${p.footbed.toLowerCase()}` : ""}. Handmade to order in EU sizes 36 to 46 by LP Originals, delivered nationwide.`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const title = `${p.name}, ${p.material}`;
  const images = p.images[0] ? [{ url: p.images[0].src, width: p.images[0].width, height: p.images[0].height, alt: title }] : undefined;
  return {
    title,
    description: describe(p),
    alternates: { canonical: `/shop/${p.slug}` },
    openGraph: { title, description: describe(p), url: `/shop/${p.slug}`, images },
  };
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const related = [...products.filter((x) => x.slug !== p.slug && x.category === p.category), ...products.filter((x) => x.category !== p.category)].slice(0, 4);

  // Product structured data. Offers are only added once a real price exists (never invent one).
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.name}, ${p.material}`,
    description: describe(p),
    image: p.images.map((i) => new URL(i.src, siteUrl).toString()),
    category: categoryLabel(p.category),
    brand: { "@type": "Brand", name: site.name },
    url: `${siteUrl}/shop/${p.slug}`,
    ...(p.price !== null && {
      offers: { "@type": "Offer", price: p.price, priceCurrency: "NGN", availability: "https://schema.org/MadeToOrder", url: `${siteUrl}/shop/${p.slug}` },
    }),
  };

  return (
    <main id="main">
      <JsonLd data={ld} />
      <Header />
      <div className="mx-auto flex max-w-page flex-col gap-20 px-5 pt-8 md:px-8 md:pt-12">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link href="/shop" className="link">Shop</Link> / <Link href={`/shop?category=${p.category}`} className="link">{categoryLabel(p.category)}</Link> / {p.name}
        </nav>
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <ProductGallery images={p.images} alt={`${p.name}, ${p.material}`} art={p.art} />
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.18em] text-bronze">{categoryLabel(p.category)}{p.audience ? ` · ${p.audience}` : ""}</span>
              <h1 className="font-display text-5xl font-semibold uppercase leading-none text-bronze md:text-6xl">{p.name}</h1>
              <p className="text-muted">{p.material}{p.footbed ? `, ${p.footbed.toLowerCase()}` : ""}</p>
              <p className="text-xl font-medium">{formatNaira(p.price)}</p>
            </div>
            <BuyBox product={p} />
            <ul className="flex flex-col gap-3 border-t border-line pt-6 text-[15px] leading-relaxed text-muted">
              <li className="flex gap-3"><Tick /><span>Made to order: production takes {site.productionDays} working days, then we deliver nationwide.</span></li>
              <li className="flex gap-3"><Tick /><span>Wrong size? We&apos;ll exchange unworn pairs. See the <Link href="/shop#size-guide" className="link">size guide</Link>.</span></li>
              <li className="flex gap-3"><Tick /><span>Pay by card or transfer, or order directly on WhatsApp.</span></li>
            </ul>
          </div>
        </div>
        {related.length > 0 && (
          <section className="flex flex-col gap-8">
            <h2 className="font-display text-4xl font-light uppercase text-bronze">You may <strong className="font-semibold">also like</strong></h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-5">{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div>
          </section>
        )}
      </div>
      <Footer />
    </main>
  );
}

function Tick() {
  return (
    <svg className="mt-1 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C6B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
  );
}
