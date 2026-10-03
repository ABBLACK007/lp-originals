import Link from "next/link";
import Image from "next/image";
import logoLight from "@/public/images/logo-light.png";

// LP Wears logo (cream + gold version for the dark header and footer). Built by `npm run logo`.
export default function Logo({ className = "h-12 w-auto md:h-14" }: { className?: string }) {
  return (
    <Link href="/" className="flex shrink-0 items-center no-underline" aria-label="LP Wears home">
      <Image src={logoLight} alt="" priority sizes="160px" className={className} />
    </Link>
  );
}
