"use client";
import Image from "next/image";
import { useState } from "react";
import Icon from "./Icon";
import SandalArt from "./SandalArt";
import type { Img, Product } from "@/lib/content-types";

// The mockup's product stand: the shoe (its cut-out photo) floats over a thin oval ring with a small black disc
// on the front. The disc turns to the product's other photos, which show in a rounded frame on the same ring.
export default function ProductStand({ cutout, images, alt, art }: { cutout?: Img; images: Img[]; alt: string; art: Product["art"] }) {
  const shots = [...(cutout ? [{ img: cutout, cut: true }] : []), ...images.map((img) => ({ img, cut: false }))];
  const [i, setI] = useState(0);
  const [turns, setTurns] = useState(0);
  const many = shots.length > 1;
  const next = () => { setI((n) => (n + 1) % shots.length); setTurns((t) => t + 1); };

  return (
    <div className="relative mx-auto w-full pb-6 pt-2">
      {/* the ring, behind the shoe */}
      <svg aria-hidden="true" viewBox="0 0 400 90" className="absolute inset-x-[2%] bottom-6 h-auto w-[96%]" fill="none">
        <ellipse cx="200" cy="45" rx="196" ry="41" stroke="#3A3A3A" strokeWidth="1.3" />
      </svg>
      <div aria-hidden="true" className="absolute bottom-[42px] left-1/2 h-5 w-[58%] -translate-x-1/2 rounded-[50%] bg-ink/25 blur-md" />

      <div className="relative mx-auto aspect-[1.3] w-[84%]">
        {shots.length === 0 ? (
          <SandalArt style={art.style} strap={art.strap} className="absolute inset-0 m-auto w-4/5" />
        ) : shots.map((s, n) => (
          <div key={n} className={`absolute inset-0 transition-[opacity,filter,transform] duration-300 ease-out ${n === i ? "scale-100 opacity-100 blur-0" : "scale-[0.97] opacity-0 blur-sm"}`}>
            {s.cut ? (
              <Image src={s.img} alt={n === i ? alt : ""} fill sizes="380px" preload={n === 0} className="object-contain object-bottom drop-shadow-[0_10px_8px_rgba(17,17,17,0.22)]" />
            ) : (
              <div className="absolute inset-x-[8%] bottom-[6%] top-0 overflow-hidden rounded-[14px] bg-tile shadow-tile">
                <Image src={s.img} alt={n === i ? alt : ""} fill sizes="320px" preload={!cutout && n === 0} placeholder={s.img.blurDataURL ? "blur" : "empty"} className="object-cover" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* the disc on the front of the ring */}
      {many ? (
        <button type="button" onClick={next} aria-label={`Turn to photo ${((i + 1) % shots.length) + 1} of ${shots.length}`}
          className="absolute bottom-[13px] left-1/2 flex h-[24px] w-[24px] -translate-x-1/2 items-center justify-center rounded-full bg-ink text-white transition-transform duration-150 ease-out active:scale-[0.88]">
          <span aria-hidden="true" className="absolute -inset-2.5" />
          <span className="transition-transform duration-500 ease-out" style={{ transform: `rotate(${turns * 360}deg)` }}><Icon name="turn" size={13} strokeWidth={2.4} /></span>
        </button>
      ) : (
        <span aria-hidden="true" className="absolute bottom-[13px] left-1/2 h-[24px] w-[24px] -translate-x-1/2 rounded-full bg-ink" />
      )}
      {many && <span className="sr-only" aria-live="polite">Photo {i + 1} of {shots.length}</span>}
    </div>
  );
}
