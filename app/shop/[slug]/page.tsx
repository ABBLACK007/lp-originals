import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductStand from "@/components/ProductStand";
import ProductTopBar from "@/components/ProductTopBar";
import BuyBox, { type Colour } from "@/components/BuyBox";
import Fold from "@/components/Fold";
import JsonLd from "@/components/JsonLd";
import SizeHelpFlyer from "@/components/SizeHelpFlyer";
import { categoryLabel } from "@/lib/content-types";
import { findProduct, getContent, visibleProducts } from "@/lib/content";
import { describeProduct } from "@/lib/describe";
import { formatNaira, siteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return visibleProducts(await getContent()).map((p) => ({ slug: p.slug }));
}
// Products added in /admin after a deploy are rendered on first visit; unknown slugs still 404.
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = findProduct(await getContent(), (await params).slug);
  if (!p) return {};
  const title = `${p.name}, ${p.material}`;
  const images = p.images[0] ? [{ url: p.images[0].src, width: p.images[0].width, height: p.images[0].height, alt: title }] : undefined;
  return {
    title,
    description: describeProduct(p),
    alternates: { canonical: `/shop/${p.slug}` },
    openGraph: { title, description: describeProduct(p), url: `/shop/${p.slug}`, images },
  };
}

export default async function ProductPage({ params }: Props) {
  const content = await getContent();
  const { site } = content;
  const products = visibleProducts(content);
  const p = findProduct(content, (await params).slug);
  if (!p) notFound();
  const related = [...products.filter((x) => x.slug !== p.slug && x.category === p.category), ...products.filter((x) => x.category !== p.category)].slice(0, 4);
  // Other colours of this style: products with the same name.
  const colours: Colour[] = products.filter((x) => x.name === p.name).map((x) => ({ slug: x.slug, material: x.material, strap: x.art.strap, current: x.slug === p.slug }));

  // Product structured data. Offers are only added once a real price exists (never invent one).
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.name}, ${p.material}`,
    description: describeProduct(p),
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
      <Header className="hidden md:block" />
      <ProductTopBar slug={p.slug} name={p.name} />
      <div className="mx-auto flex max-w-page flex-col gap-16 px-5 pt-4 md:gap-24 md:px-8 md:pt-10">
        <div className="flex flex-col gap-6">
          <nav aria-label="Breadcrumb" className="hidden text-sm text-muted md:block">
            <Link href="/shop" className="link">Shop</Link> / <Link href={`/shop/category/${p.category}`} className="link">{categoryLabel(p.category)}</Link> / <span className="text-ink">{p.name}</span>
          </nav>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
            <div className="pb-6 md:sticky md:top-28 md:self-start">
              <ProductStand images={p.images} alt={`${p.name}, ${p.material}`} art={p.art} preloadFirst />
            </div>
            <div className="flex flex-col gap-7">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-[24px] font-semibold leading-tight md:text-[34px]">{p.name}</h1>
                  <span className="tabular whitespace-nowrap pt-0.5 text-[22px] font-semibold md:pt-1 md:text-[30px]">{formatNaira(p.price)}</span>
                </div>
                <p className="text-[13px] text-muted">
                  Handmade to order · <Link href={`/shop/category/${p.category}`} className="link">{categoryLabel(p.category)}</Link>{p.audience ? ` · for ${p.audience.toLowerCase()}` : ""}
                </p>
              </div>
              <BuyBox product={p} colours={colours} />
              <div className="border-t border-line">
                <Fold title="Description" open>
                  <p>{describeProduct(p)}</p>
                  <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                    <dt className="text-ink">Upper</dt><dd>{p.material}</dd>
                    {p.footbed && <><dt className="text-ink">Footbed</dt><dd>{p.footbed}</dd></>}
                    <dt className="text-ink">Sizes</dt><dd>EU 36 to 46, made to order</dd>
                  </dl>
                </Fold>
                <Fold title="Delivery and returns">
                  <ul className="flex flex-col gap-2.5">
                    <li>Made to order: production takes {site.productionDays} working days, then we deliver nationwide.</li>
                    <li>Wrong size? We&apos;ll exchange unworn pairs. See the <Link href="/shop#size-guide" className="link text-ink">size guide</Link>.</li>
                    <li>Add to cart for a receipt, or order directly on WhatsApp. We confirm payment and delivery with you.</li>
                  </ul>
                </Fold>
              </div>
            </div>
          </div>
        </div>
        <SizeHelpFlyer />
        {related.length > 0 && (
          <section className="flex flex-col gap-6">
            <h2 className="text-[22px] font-semibold md:text-[30px]">You may also like</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div>
          </section>
        )}
      </div>
      <Footer />
    </main>
  );
}
