import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopGrid from "@/components/ShopGrid";
import SectionTitle from "@/components/SectionTitle";
import { categories, products, sizes, type Category } from "@/lib/products";

export const metadata: Metadata = { title: "Shop all styles", description: "Cork-footbed sandals, slides, palms and clogs, handmade to order in EU sizes 36 to 46.", alternates: { canonical: "/shop" } };

export default async function Shop({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const initial = categories.some((c) => c.id === category) ? (category as Category) : "all";
  return (
    <main id="main">
      <Header />
      <div className="mx-auto flex max-w-page flex-col gap-10 px-5 pt-14 md:px-8 md:pt-20">
        <SectionTitle light="Shop" strong="all styles" sub="Cork-footbed sandals, slides, palms and clogs, each made to order in your size." />
        <ShopGrid items={products} initial={initial} />
        <section id="size-guide" className="mt-10 flex flex-col gap-5 rounded-panel bg-dune p-6 md:p-10">
          <h2 className="font-display text-3xl font-semibold uppercase text-bronze">Size guide</h2>
          <p className="max-w-xl text-[15px] leading-relaxed text-muted">We make every pair in EU sizes {sizes[0]} to {sizes[sizes.length - 1]}. Stand on a sheet of paper, mark your heel and longest toe, measure the distance in centimetres, and match it below. Between sizes? Size up, or send us your measurement on WhatsApp.</p>
          <div className="overflow-x-auto">
            <table className="min-w-[520px] text-left text-sm">
              <thead><tr className="border-b border-[#CFC6B9]"><th className="py-2 pr-6 font-semibold">EU size</th>{sizes.map((s) => <th key={s} className="px-2 py-2 font-medium">{s}</th>)}</tr></thead>
              <tbody><tr><td className="py-2 pr-6 font-semibold">Foot length</td>{sizes.map((s) => <td key={s} className="px-2 py-2 text-muted">[cm]</td>)}</tr></tbody>
            </table>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
