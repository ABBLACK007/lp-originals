import Link from "next/link";
import Image from "next/image";
import SandalArt from "./SandalArt";
import HeartButton from "./HeartButton";
import QuickAddButton from "./QuickAddButton";
import type { Product } from "@/lib/content-types";
import { formatNaira } from "@/lib/site";

// The mockup's product card: light grey card with two thin corner arcs, a black cart button (top left, opens the
// size sheet) and a heart (top right), the shoe floating in the middle, then name and price. Uses the product's
// cut-out photo when it has one; otherwise its first photo in a rounded frame. The whole card opens the product.
export default function ProductCard({ p, eager = false }: { p: Product; eager?: boolean }) {
  const cut = p.cutout;
  const photo = cut ?? p.images[0];
  return (
    <article className="group relative flex aspect-[0.92] flex-col overflow-hidden rounded-[10px] bg-tile shadow-[0_2px_5px_rgba(17,17,17,0.10)]">
      <span aria-hidden="true" className="pointer-events-none absolute -left-[34%] -top-[30%] aspect-square w-[68%] rounded-full border border-[#DCDCDC]" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-[34%] -right-[30%] aspect-square w-[68%] rounded-full border border-[#DCDCDC]" />
      <div className="relative z-10 flex items-center justify-between px-2.5 pt-2.5">
        <QuickAddButton p={p} />
        <HeartButton slug={p.slug} name={p.name} size="sm" />
      </div>
      <div className={`relative mx-3 min-h-0 flex-1 ${cut ? "" : "my-1 overflow-hidden rounded-[8px] bg-white"}`}>
        {photo ? (
          <Image src={photo} alt="" fill sizes="200px" loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"}
            placeholder={!cut && photo.blurDataURL ? "blur" : "empty"}
            className={`${cut ? "object-contain drop-shadow-[0_6px_6px_rgba(17,17,17,0.18)]" : "object-cover"} transition-transform duration-300 ease-out group-hover:scale-[1.04]`} />
        ) : (
          <SandalArt style={p.art.style} strap={p.art.strap} className="absolute inset-0 m-auto w-3/4" />
        )}
      </div>
      <div className="relative flex flex-col items-center px-2 pb-3 pt-1 text-center">
        {/* The name link covers the whole card (after:inset-0) so any tap opens the product. */}
        <Link href={`/shop/${p.slug}`} className="line-clamp-1 text-[14px] font-medium leading-snug tracking-[0.01em] no-underline after:absolute after:inset-0">{p.name}</Link>
        <span className="tabular mt-0.5 text-[12px] font-semibold">{formatNaira(p.price)}</span>
      </div>
    </article>
  );
}
