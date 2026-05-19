import slugify from "slugify";
import { Product, Store } from "../models/index.js";

export const baseSlug = (value) =>
  slugify(value || "store", { lower: true, strict: true, trim: true }).slice(0, 150) || "store";

export async function uniqueStoreSlug(name) {
  const base = baseSlug(name);
  let slug = base;
  let count = 1;
  while (await Store.findOne({ where: { slug } })) {
    slug = `${base}-${count++}`;
  }
  return slug;
}

export async function uniqueProductSlug(storeId, name, existingProductId) {
  const base = baseSlug(name);
  let slug = base;
  let count = 1;
  while (true) {
    const product = await Product.findOne({ where: { storeId, slug } });
    if (!product || product.id === Number(existingProductId)) return slug;
    slug = `${base}-${count++}`;
  }
}
