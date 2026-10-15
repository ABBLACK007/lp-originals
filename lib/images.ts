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
import platformToePost from "@/assets/photos/platform-toe-post-brown.jpg";
import stitchedBlack from "@/assets/photos/stitched-slide-black.jpg";
import slidesTrio from "@/assets/photos/lp-slides-trio.jpg";
import wovenOlive from "@/assets/photos/woven-slide-olive.jpg";
import stitchedGreen from "@/assets/photos/stitched-slide-green.jpg";

// Product cut-outs (transparent background), made from the photos above by scripts/make-cutouts.py
import cutBuckleRust from "@/assets/cutouts/buckle-sandal-rust.png";
import cutWideBandTan from "@/assets/cutouts/wide-band-slide-tan.png";
import cutCrossStrapBlack from "@/assets/cutouts/cross-strap-slide-black.png";
import cutTwoStrapBrown from "@/assets/cutouts/two-strap-slide-brown.png";
import cutBandChocolate from "@/assets/cutouts/band-slide-chocolate.png";
import cutPlatformToePost from "@/assets/cutouts/platform-toe-post-brown.png";
import cutStitchedBlack from "@/assets/cutouts/stitched-slide-black.png";
import cutStitchedGreen from "@/assets/cutouts/stitched-slide-green.png";
import cutWovenOlive from "@/assets/cutouts/woven-slide-olive.png";
import cutCutoutRed from "@/assets/cutouts/cutout-slide-red.png";
import cutPerforatedBrown from "@/assets/cutouts/perforated-slide-brown.png";
import cutCrossSlideBlack from "@/assets/cutouts/cross-slide-black-leather.png";
import cutToePostCream from "@/assets/cutouts/toe-post-sandal-cream.png";
import cutClogMocha from "@/assets/cutouts/clog-mocha.png";

// Campaign imagery (AI-generated lifestyle shots)
export const images = { heroDesktop, heroMobile, promo, ordering, buckle, sole };

// Real LP product photos
export const photos = {
  corkCollection, wideBandTan, crossStrapBlack, twoStrapBrown, buckleRust, buckleGroup,
  bandChocolate, corkFootbed, cutoutRed, crossSlideBlack, toePostCream, perforatedBrown, clogMocha, buckleWorn,
  platformToePost, stitchedBlack, slidesTrio, wovenOlive, stitchedGreen,
};

// The shoes on their own, for product cards and the product stand
export const cutouts = {
  cutBuckleRust, cutWideBandTan, cutCrossStrapBlack, cutTwoStrapBrown, cutBandChocolate, cutPlatformToePost, cutStitchedBlack, cutStitchedGreen, cutWovenOlive, cutCutoutRed, cutPerforatedBrown, cutCrossSlideBlack, cutToePostCream, cutClogMocha,
};

