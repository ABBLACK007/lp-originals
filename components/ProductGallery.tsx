"use client";
import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import SandalArt from "./SandalArt";
import type { Product } from "@/lib/products";

export default function ProductGallery({ images, alt, art }: { images: StaticImageData[]; alt: string; art: Product["art"] }) {
  const [i, setI] = useState(0);
  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] flex-col items-center justify-center gap-4 rounded-hero bg-sand">
        <SandalArt style={art.style} strap={art.strap} className="w-3/4" />
        <span className="text-sm text-muted">Photo coming soon</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-hero bg-sand">
        {images.map((src, n) => (
          <Image key={n} src={src} alt={n === i ? alt : ""} fill priority={n === 0} placeholder="blur"
            sizes="(min-width: 768px) 50vw, 100vw"
            className={`object-cover transition-opacity duration-300 ease-out ${n === i ? "opacity-100" : "opacity-0"}`} />
        ))}
      </div>
      {images.length > 1 && (
        <div className="flex gap-3" role="group" aria-label="Product photos">
          {images.map((src, n) => (
            <button key={n} type="button" onClick={() => setI(n)} aria-label={`Show photo ${n + 1}`} aria-pressed={n === i}
              className={`relative aspect-square w-20 overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-cream transition-[box-shadow,transform] duration-150 active:scale-[0.96] ${n === i ? "ring-ink" : "ring-transparent"}`}>
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
