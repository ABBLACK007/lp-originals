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
      <div className="mx-auto flex max-w-page flex-col gap-12 px-5 pt-12 md:px-8 md:pt-20">
        <div className="flex flex-col items-start gap-5">
          <span aria-hidden="true" className="tabular text-[96px] font-bold leading-none tracking-[-0.04em] md:text-[160px]">404</span>
          <h1 className="text-[28px] font-semibold md:text-[40px]">This page walked off</h1>
          <p className="max-w-md text-muted">The link may be old or mistyped. Try the shop, or message us on WhatsApp and we&apos;ll help you find your pair.</p>
          <div className="flex flex-wrap gap-3"><Link href="/shop" className="btn btn-primary">Shop all styles</Link><Link href="/" className="btn btn-secondary">Back home</Link></div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      </div>
      <Footer />
    </main>
  );
}
