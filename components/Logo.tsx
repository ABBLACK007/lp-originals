import Link from "next/link";
import Image from "next/image";
import logoLight from "@/public/images/logo-light.png";
import logoDark from "@/public/images/logo-dark.png";

// LP Wears logo. Cream + gold for dark backgrounds; `dark` crossfades to the ink + brown version
// (used when a light hero slide is showing). Both files are built by `npm run logo`.
// `sizes` is the logo's rendered width (md:h-14 is 79px wide), so phones get the 256px file, not 384px.
export default function Logo({ className = "h-12 w-auto md:h-14", dark = false, sizes = "80px" }: { className?: string; dark?: boolean; sizes?: string }) {
  return (
    <Link href="/" className="relative flex shrink-0 items-center no-underline" aria-label="LP Wears home">
      <Image src={logoLight} alt="" loading="eager" sizes={sizes} className={`${className} transition-opacity duration-700 ${dark ? "opacity-0" : "opacity-100"}`} />
      <Image src={logoDark} alt="" sizes={sizes} className={`${className} absolute left-0 top-1/2 -translate-y-1/2 transition-opacity duration-700 ${dark ? "opacity-100" : "opacity-0"}`} />
    </Link>
  );
}
