import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import ProductStand from "@/components/ProductStand";
import BuyBox, { OrderOnWhatsApp, type Colour } from "@/components/BuyBox";
import Fold from "@/components/Fold";
import JsonLd from "@/components/JsonLd";
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

// The mockup's product screen: back and cart buttons, the shoe on its stand, label + name + price, colours and
// quantity, sizes, Description and Delivery fold-outs, and Buy now / Add to cart above the tab bar.
export default async function ProductPage({ params }: Props) {
  const content = await getContent();
  const { site } = content;
  const products = visibleProducts(content);
  const p = findProduct(content, (await params).slug);
  if (!p) notFound();
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
    <main id="main" className="pb-24">
      <JsonLd data={ld} />
      <TopBar />
      <div className="flex flex-col px-6">
        <ProductStand cutout={p.cutout} images={p.images} alt={`${p.name}, ${p.material}`} art={p.art} />
        <div className="mt-5 flex items-center justify-between font-read text-[11px] text-[#9A9A9A]">
          <span>Handmade quality</span>
          <span>{categoryLabel(p.category)}</span>
        </div>
        <div className="mt-1.5 flex items-start justify-between gap-4">
          <h1 className="text-[19px] font-semibold leading-snug">{p.name}</h1>
          <span className="tabular whitespace-nowrap text-[19px] font-bold leading-snug">{formatNaira(p.price)}</span>
        </div>
        <div className="mt-5"><BuyBox product={p} colours={colours}>
        <div className="flex flex-col gap-1">
          <Fold title="Description" open>
            <p>{describeProduct(p)}</p>
            <p className="mt-2">{p.material}{p.footbed ? `, ${p.footbed.toLowerCase()}` : ""}. EU sizes 36 to 46.</p>
          </Fold>
          <Fold title="Delivery and returns">
            <p>Made to order: production takes {site.productionDays} working days, then we deliver nationwide. Wrong size? We&apos;ll exchange unworn pairs (see the <a href="/help#sizes" className="link text-ink">size guide</a>).</p>
            <p className="mt-2">Add to cart for a receipt, or <OrderOnWhatsApp product={p} />; we confirm payment and delivery with you.</p>
          </Fold>
        </div>
        </BuyBox></div>
      </div>
    </main>
  );
}
