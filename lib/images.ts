// All site photography, imported statically so next/image can resize, compress (WebP) and blur-load it.
// assets/generated: Higgsfield lifestyle and detail shots (npm run assets, see assets/manifest.json)
// assets/photos:    real LP product photos, cropped from assets/photos/originals (npm run photos)
import heroDesktop from "@/assets/generated/hero-desktop.png";
import heroMobile from "@/assets/generated/hero-mobile.png";
import promo from "@/assets/generated/promo-campaign.png";
import ordering from "@/assets/generated/ordering-feet.png";
import buckle from "@/assets/generated/detail-buckle.png";
import sole from "@/assets/generated/detail-sole.png";

import corkCollection from "@/assets/photos/cork-collection.jpg";
import wideBandTan from "@/assets/photos/wide-band-slide-tan.jpg";
import crossStrapBlack from "@/assets/photos/cross-strap-slide-black.jpg";
import twoStrapBrown from "@/assets/photos/two-strap-slide-brown.jpg";
import buckleRust from "@/assets/photos/buckle-sandal-rust.jpg";
import buckleGroup from "@/assets/photos/buckle-sandal-group.jpg";
import bandChocolate from "@/assets/photos/band-slide-chocolate.jpg";
import corkFootbed from "@/assets/photos/cork-footbed-detail.jpg";
import cutoutRed from "@/assets/photos/cutout-slide-red.jpg";
import crossSlideBlack from "@/assets/photos/cross-slide-black-leather.jpg";
import toePostCream from "@/assets/photos/toe-post-sandal-cream.jpg";
import perforatedBrown from "@/assets/photos/perforated-slide-brown.jpg";
import clogMocha from "@/assets/photos/clog-mocha.jpg";
import buckleWorn from "@/assets/photos/buckle-slide-worn.jpg";

// Campaign imagery (AI-generated lifestyle shots)
export const images = { heroDesktop, heroMobile, promo, ordering, buckle, sole };

// Real LP product photos
export const photos = {
  corkCollection, wideBandTan, crossStrapBlack, twoStrapBrown, buckleRust, buckleGroup,
  bandChocolate, corkFootbed, cutoutRed, crossSlideBlack, toePostCream, perforatedBrown, clogMocha, buckleWorn,
};

export const logo = "/images/logo.jpg";
