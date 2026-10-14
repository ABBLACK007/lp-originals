import Image, { type StaticImageData } from "next/image";

// Optimised photo that fills its box. The wrapper takes the size/shape classes;
// next/image serves a resized WebP and shows a blurred preview while it loads.
export default function Photo({ src, alt, sizes, className = "", imgClassName = "", preload = false }: {
  src: StaticImageData; alt: string; sizes: string; className?: string; imgClassName?: string; preload?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} placeholder="blur" preload={preload} className={`object-cover ${imgClassName}`} />
    </div>
  );
}
