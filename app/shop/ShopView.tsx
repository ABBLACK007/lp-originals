import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopGrid from "@/components/ShopGrid";
import SectionTitle from "@/components/SectionTitle";
import SizeHelpFlyer from "@/components/SizeHelpFlyer";
import { sizes, type Category } from "@/lib/content-types";
import { getContent, visibleProducts } from "@/lib/content";
import { categoryThumbs } from "@/lib/category-photos";

// The shop page, shared by /shop and the pre-built category pages (/shop/category/<id>).
export default async function ShopView({ initial }: { initial: "all" | Category }) {
  const content = await getContent();
  const products = visibleProducts(content);
  // Foot lengths are set in /admin (Settings › Size guide); until then only the measuring tip shows.
  const foot = content.site.footLength ?? {};
  const hasChart = sizes.some((s) => foot[s]?.trim());
  return (
    <main id="main">
      <Header />
      <div className="mx-auto flex max-w-page flex-col gap-8 px-5 pt-8 md:px-8 md:pt-14">
        <SectionTitle level={1} title="Shop all styles" sub="Cork-footbed sandals, slides, palms and clogs, each made to order in your size." />
        <ShopGrid items={products} initial={initial} thumbs={categoryThumbs} />
        <div className="mt-6"><SizeHelpFlyer /></div>
        <section id="size-guide" className="flex scroll-mt-24 flex-col gap-5 rounded-panel bg-mist p-6 md:p-10">
          <h2 className="text-[22px] font-semibold md:text-[30px]">Size guide</h2>
          <p className="max-w-xl text-[15px] leading-relaxed text-muted">We make every pair in EU sizes {sizes[0]} to {sizes[sizes.length - 1]}. Stand on a sheet of paper, mark your heel and longest toe, measure the distance in centimetres{hasChart ? ", and match it below. Between sizes? Size up, or send us your measurement on WhatsApp." : ", and send it to us on WhatsApp: we'll match you to the right size before we make your pair."}</p>
          {hasChart && (
            <div className="overflow-x-auto">
              <table className="min-w-[520px] text-left text-sm">
                <thead><tr className="border-b border-edge"><th scope="row" className="py-2 pr-6 font-semibold">EU size</th>{sizes.map((s) => <th key={s} scope="col" className="px-2 py-2 font-medium">{s}</th>)}</tr></thead>
                <tbody><tr><th scope="row" className="py-2 pr-6 font-semibold">Foot length (cm)</th>{sizes.map((s) => <td key={s} className="px-2 py-2 text-muted">{foot[s]?.trim() || "–"}</td>)}</tr></tbody>
              </table>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}
