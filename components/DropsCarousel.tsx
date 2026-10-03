import ProductCard from "./ProductCard";
import type { Product } from "@/lib/products";

// Swipeable row of new products (2 per screen on phones, 4 on desktop). No controls: swipe or scroll sideways.
export default function DropsCarousel({ items }: { items: Product[] }) {
  return (
    <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 md:mx-0 md:scroll-px-0 md:px-0">
      {items.map((p) => (
        <div key={p.slug} className="w-[calc(50%-10px)] shrink-0 snap-start md:w-[calc(25%-15px)]">
          <ProductCard p={p} />
        </div>
      ))}
    </div>
  );
}
