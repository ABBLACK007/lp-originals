import Link from "next/link";
import Image from "next/image";
import SandalArt from "./SandalArt";
import HeartButton from "./HeartButton";
import QuickAddButton from "./QuickAddButton";
import type { Product } from "@/lib/content-types";
import { formatNaira } from "@/lib/site";

// Card image sizes: 2 columns on phones, 3 on tablets, 4 on desktop.
const SIZES = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw";

// Grey product tile: quick-add (cart) top left, save (heart) top right, photo, name, material, price.
// The whole tile opens the product; the two buttons sit above the link.
// `eager`: the first row of the shop grid, on screen as the page opens.
export default function ProductCard({ p, eager = false }: { p: Product; eager?: boolean }) {
  const main = p.images[0];
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card bg-tile p-2 shadow-tile transition-shadow duration-200 ease-out hover:shadow-float">
      {/* Faint ring in the corner, as on the mockup's tiles */}
      <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full border border-white" />
      <div className="relative z-10 flex items-center justify-between p-1">
        <QuickAddButton p={p} />
        <HeartButton slug={p.slug} name={p.name} size="sm" />
      </div>
      <div className="relative mx-1 mt-1 aspect-square overflow-hidden rounded-chip bg-white">
        {main ? (
          <Image src={main} alt="" fill sizes={SIZES} placeholder={main.blurDataURL ? "blur" : "empty"}
            loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <SandalArt style={p.art.style} strap={p.art.strap} className="w-3/4" />
            <span className="text-xs text-muted">Photo coming soon</span>
          </div>
        )}
        {p.isNew && <span className="absolute bottom-2 left-2 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium">New</span>}
      </div>
      <div className="flex flex-col items-center px-1.5 pb-2.5 pt-3 text-center">
        {/* The name link covers the whole tile (after:inset-0) so any tap opens the product. */}
        <Link href={`/shop/${p.slug}`} className="text-[14px] font-medium leading-snug no-underline after:absolute after:inset-0 md:text-[15px]">{p.name}</Link>
        <span className="mt-0.5 line-clamp-1 text-[12px] text-muted md:text-[13px]">{p.material}</span>
        <span className="tabular mt-1.5 text-[14px] font-semibold">{formatNaira(p.price)}</span>
      </div>
    </article>
  );
}
