import Link from "next/link";
import TopBar from "@/components/TopBar";
import ProductCard from "@/components/ProductCard";
import { getContent, visibleProducts } from "@/lib/content";

export default async function NotFound() {
  const products = visibleProducts(await getContent());
  return (
    <main id="main">
      <TopBar />
      <div className="flex flex-col gap-8 px-6 pt-6">
        <div className="flex flex-col items-start gap-4">
          <span aria-hidden="true" className="tabular text-[80px] font-bold leading-none tracking-[-0.04em]">404</span>
          <h1 className="text-[24px] font-semibold">This page walked off</h1>
          <p className="font-read text-[15px] text-muted">The link may be old or mistyped. Try the shop, or message us on WhatsApp and we&apos;ll help you find your pair.</p>
          <div className="flex gap-3"><Link href="/shop" className="btn btn-primary">Shop all styles</Link><Link href="/" className="btn btn-secondary">Back home</Link></div>
        </div>
        <div className="grid grid-cols-2 gap-x-[18px] gap-y-6">
          {products.slice(0, 4).map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      </div>
    </main>
  );
}
