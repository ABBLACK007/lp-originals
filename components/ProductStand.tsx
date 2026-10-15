"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import Icon from "./Icon";
import SandalArt from "./SandalArt";
import type { Img, Product } from "@/lib/content-types";

// The product on a display stand (the mockup's product screen): the photo stands on a ring platform; the black
// disc on the front of the ring turns to the next photo, and a marker travels round the ring as it does.
// Thumbnails below choose a photo directly. Photos crossfade with a little blur so the swap reads as one turn.
const BACK = "M6 40 A194 34 0 0 1 394 40";  // far half of the ring (behind the photo)
const FRONT = "M6 40 A194 34 0 0 0 394 40"; // near half (in front of the photo's base)

export default function ProductStand({ images, alt, art, preloadFirst = false, sizes = "(min-width: 768px) 40vw, 80vw", thumbs = true }: {
  images: Img[]; alt: string; art: Product["art"]; preloadFirst?: boolean; sizes?: string; thumbs?: boolean;
}) {
  const [i, setI] = useState(0);
  const [turns, setTurns] = useState(0);
  const marker = useRef<SVGAnimateMotionElement>(null);
  const many = images.length > 1;
  const show = (n: number) => {
    if (n === i) return;
    setI(n);
    setTurns((t) => t + 1);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) marker.current?.beginElement();
  };

  return (
    <div className="flex flex-col items-center gap-[4.5rem] md:gap-24">
      <div className="relative w-[80%] max-w-[460px]">
        {/* contact shadow + far half of the ring, behind the photo */}
        <div aria-hidden="true" className="absolute inset-x-[-9%] bottom-0 aspect-[5/1] translate-y-1/2">
          <div className="absolute inset-x-[14%] top-[30%] h-[40%] rounded-[50%] bg-ink/20 blur-xl" />
          <svg viewBox="0 0 400 80" className="absolute inset-0 h-full w-full" fill="none"><path d={BACK} stroke="#111" strokeOpacity="0.18" strokeWidth="1.5" /></svg>
        </div>

        <div className="relative aspect-square overflow-hidden rounded-panel bg-tile shadow-tile">
          {images.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <SandalArt style={art.style} strap={art.strap} className="w-3/4" />
              <span className="text-sm text-muted">Photo coming soon</span>
            </div>
          ) : images.map((src, n) => (
            <Image key={n} src={src} alt={n === i ? alt : ""} fill preload={preloadFirst && n === 0} placeholder={src.blurDataURL ? "blur" : "empty"} sizes={sizes}
              className={`object-cover transition-[opacity,filter] duration-300 ease-out ${n === i ? "opacity-100 blur-0" : "opacity-0 blur-sm"}`} />
          ))}
        </div>

        {/* near half of the ring, the travelling marker and the turn disc, in front of the photo */}
        <div className="absolute inset-x-[-9%] bottom-0 z-10 aspect-[5/1] translate-y-1/2">
          <svg aria-hidden="true" viewBox="0 0 400 80" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
            <path d={FRONT} stroke="#111" strokeOpacity="0.32" strokeWidth="1.5" />
            <circle r="3.5" fill="#111" opacity={turns ? 1 : 0}>
              <animateMotion ref={marker} begin="indefinite" dur="0.7s" fill="freeze" calcMode="spline" keySplines="0.23 1 0.32 1" keyTimes="0;1" path={FRONT} />
            </circle>
          </svg>
          {many && (
            <button type="button" onClick={() => show((i + 1) % images.length)} aria-label={`Turn to photo ${((i + 1) % images.length) + 1} of ${images.length}`}
              className="absolute left-1/2 top-[92%] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-white shadow-float ring-4 ring-white transition-[transform,background-color] duration-150 ease-out hover:bg-char active:scale-[0.92]">
              <span className="transition-transform duration-500 ease-out" style={{ transform: `rotate(${turns * 360}deg)` }}><Icon name="turn" size={18} /></span>
            </button>
          )}
        </div>
      </div>

      {thumbs && many && (
        <div className="flex gap-2.5" role="group" aria-label="Product photos">
          {images.map((src, n) => (
            <button key={n} type="button" onClick={() => show(n)} aria-label={`Show photo ${n + 1}`} aria-pressed={n === i}
              className={`relative h-16 w-16 overflow-hidden rounded-chip border-2 bg-tile transition-[transform,border-color] duration-150 ease-out active:scale-[0.95] ${n === i ? "border-ink" : "border-transparent"}`}>
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
