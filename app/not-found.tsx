import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getContent, visibleProducts } from "@/lib/content";

export default async function NotFound() {
  const products = visibleProducts(await getContent());
  return (
    <main id="main">
      <Header />
      <div className="mx-auto flex max-w-page flex-col gap-14 px-5 pt-16 md:px-8 md:pt-24">
        <div className="flex flex-col items-start gap-5">
          <span className="font-display text-[120px] font-semibold leading-none text-bronze md:text-[180px]">404</span>
          <h1 className="font-display text-4xl font-light uppercase text-bronze md:text-5xl">This page <strong className="font-semibold">walked off</strong></h1>
          <p className="max-w-md text-muted">The link may be old or mistyped. Try the shop, or message us on WhatsApp and we&apos;ll help you find your pair.</p>
          <div className="flex flex-wrap gap-3"><Link href="/shop" className="btn btn-gold">Shop all styles</Link><Link href="/" className="btn btn-outline">Back home</Link></div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {products.slice(0, 4).map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      </div>
      <Footer />
    </main>
  );
}
