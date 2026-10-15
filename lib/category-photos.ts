// Small photos for the category chips (home and shop). Server-side, passed to the client chips as props.
import { photos } from "./images";
import type { CategoryThumbs } from "@/components/ShopGrid";

export const categoryThumbs: CategoryThumbs = {
  all: photos.corkCollection,
  cork: photos.buckleGroup,
  slides: photos.cutoutRed,
  clogs: photos.clogMocha,
};
