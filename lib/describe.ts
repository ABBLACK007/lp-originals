import type { Product } from "./content-types";

// The product's description: what the owner wrote in /admin, or one written from its fields.
export const describeProduct = (p: Product) =>
  p.description?.trim() ||
  `${p.name} in ${p.material.toLowerCase()}${p.footbed ? ` on a ${p.footbed.toLowerCase()}` : ""}. Cut, stitched and finished by hand in Nigeria and made to order in your EU size, 36 to 46.`;
