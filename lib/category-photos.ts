// Pictures for the Categories chips (home and shop): the LP logo for "All", a shoe cut-out for each style.
// Server-side, passed to the client chips as props.
import { cutouts } from "./images";
import logoDark from "@/public/images/logo-dark.png";
import type { CategoryThumbs } from "@/components/ShopGrid";

export const categoryThumbs: CategoryThumbs = {
  all: logoDark,
  cork: cutouts.cutBandChocolate,
  slides: cutouts.cutCutoutRed,
  clogs: cutouts.cutClogMocha,
  Men: cutouts.cutCrossStrapBlack,
  Women: cutouts.cutToePostCream,
};
