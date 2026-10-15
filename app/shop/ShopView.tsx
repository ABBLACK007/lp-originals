import StoreHeader from "@/components/StoreHeader";
import ShopGrid from "@/components/ShopGrid";
import { categories, type Category } from "@/lib/content-types";
import { getContent, visibleProducts } from "@/lib/content";
import { categoryThumbs } from "@/lib/category-photos";

// The store screen on its own (the mockup's home screen without the opening photo): /shop and the pre-built
// category pages (/shop/category/<id>).
export default async function ShopView({ initial }: { initial: "all" | Category }) {
  const products = visibleProducts(await getContent());
  const label = initial === "all" ? "Shop all styles" : `Shop ${categories.find((c) => c.id === initial)?.label.toLowerCase()}`;
  return (
    <main id="main" className="flex flex-col gap-6 px-6 pt-6">
      <h1 className="sr-only">{label}</h1>
      <StoreHeader />
      <ShopGrid items={products} initial={initial} thumbs={categoryThumbs} syncUrl />
    </main>
  );
}
