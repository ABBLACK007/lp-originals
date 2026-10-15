import { getImageProps } from "next/image";
import { preload } from "react-dom";
import JsonLd from "@/components/JsonLd";
import Onboarding from "@/components/Onboarding";
import StoreHeader from "@/components/StoreHeader";
import ShopGrid from "@/components/ShopGrid";
import { categoryThumbs } from "@/lib/category-photos";
import { siteUrl } from "@/lib/site";
import { fillTokens, getContent, visibleProducts, visibleSlides } from "@/lib/content";

// Home, as on the owner's mockup: the opening screen (first visible hero slide from /admin), then the store
// screen: store name, search, categories and the product grid. The tab bar comes from the app shell.
export default async function Home() {
  const content = await getContent();
  const { site } = content;
  const products = visibleProducts(content);
  const [slide] = visibleSlides(content);
  const photo = slide?.mobileImage ?? slide?.image;
  const art = photo ? getImageProps({ src: photo, alt: "", sizes: "430px", quality: 75 }).props : null;
  if (art?.srcSet) preload(art.src, { as: "image", imageSrcSet: art.srcSet, imageSizes: "430px", fetchPriority: "high" });

  return (
    <main id="main">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Store", name: site.name, url: siteUrl, logo: `${siteUrl}/icons/icon-512.png`, image: `${siteUrl}/opengraph-image.jpg`, description: "Handmade cork-footbed sandals, slides, palms and clogs.", sameAs: [site.instagram], areaServed: "NG" }} />
      <h1 className="sr-only">{site.name}: handmade cork-footbed sandals, slides, palms and clogs</h1>
      {slide && art && photo && (
        <Onboarding art={{ src: art.src, srcSet: art.srcSet ?? "", width: photo.width, height: photo.height, focus: slide.focus }}
          title={fillTokens(slide.title, content)} sub={fillTokens(slide.sub, content)} />
      )}
      <section id="store" aria-label="Shop" className="flex scroll-mt-2 flex-col gap-6 px-6 pt-8">
        <StoreHeader />
        <ShopGrid items={products} thumbs={categoryThumbs} />
      </section>
    </main>
  );
}
