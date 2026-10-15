import Link from "next/link";
import Image from "next/image";
import logoLight from "@/public/images/logo-light.png";
import logoDark from "@/public/images/logo-dark.png";

// LP Wears logo. Cream + gold for dark backgrounds; `dark` crossfades to the ink + brown version
// (used when a light hero slide is showing). Both files are built by `npm run logo`.
export default function Logo({ className = "h-12 w-auto md:h-14", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className="relative flex shrink-0 items-center no-underline" aria-label="LP Wears home">
      <Image src={logoLight} alt="" priority sizes="160px" className={`${className} transition-opacity duration-700 ${dark ? "opacity-0" : "opacity-100"}`} />
      <Image src={logoDark} alt="" sizes="160px" className={`${className} absolute left-0 top-1/2 -translate-y-1/2 transition-opacity duration-700 ${dark ? "opacity-100" : "opacity-0"}`} />
    </Link>
  );
}
