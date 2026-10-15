import Link from "next/link";
import Image from "next/image";
import SandalArt from "./SandalArt";
import { categoryLabel, type Product } from "@/lib/content-types";
import { formatNaira } from "@/lib/site";

// Card image sizes: 2 columns on phones, 4 on desktop.
const SIZES = "(min-width: 768px) 25vw, 50vw";

export default function ProductCard({ p }: { p: Product }) {
  const [main, alt] = p.images;
  return (
    <article className="group flex flex-col gap-3.5">
      <Link href={`/shop/${p.slug}`} className="relative block aspect-[4/5] overflow-hidden rounded-card bg-sand" aria-label={`${p.name}, ${p.material}`}>
        {main ? (
          <>
            <Image src={main} alt="" fill sizes={SIZES} placeholder="blur"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
            {/* Second photo fades in on hover (desktop only). */}
            {alt && <Image src={alt} alt="" fill sizes={SIZES}
              className="object-cover opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <SandalArt style={p.art.style} strap={p.art.strap} className="w-3/4" />
            <span className="absolute bottom-3.5 left-3.5 text-xs text-muted">Photo coming soon</span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {p.isNew && <span className="glass rounded-full px-3 py-1.5 text-xs font-semibold">New</span>}
          {p.audience && <span className="glass-dark rounded-full px-3 py-1.5 text-xs font-semibold text-white">{p.audience}</span>}
        </div>
      </Link>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs uppercase tracking-[0.14em] text-bronze">{categoryLabel(p.category)}</span>
        <Link href={`/shop/${p.slug}`} className="text-[15px] font-medium no-underline md:text-[17px]">{p.name}</Link>
        <span className="text-[13px] text-muted">{p.material}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{formatNaira(p.price)}</span>
        <Link href={`/shop/${p.slug}`} className="link py-2 text-sm">Choose size</Link>
      </div>
    </article>
  );
}
