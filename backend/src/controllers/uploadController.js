import { Product, ProductImage, Store } from "../models/index.js";
import { uploadBuffer } from "../config/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const uploadStoreAsset = asyncHandler(async (req, res) => {
  const store = await Store.findOne({ where: { id: req.params.storeId, userId: req.user.id } });
  if (!store) return res.status(404).json({ message: "Store not found" });
  if (!req.file) return res.status(400).json({ message: "Image file is required" });
  const result = await uploadBuffer(req.file, "localstore/stores");
  if (req.body.type === "logo") store.logoUrl = result.url;
  if (req.body.type === "banner") store.bannerUrl = result.url;
  await store.save();
  res.json({ url: result.url, store });
});

export const uploadProductImages = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    where: { id: req.params.productId },
    include: [{ model: Store, where: { userId: req.user.id } }]
  });
  if (!product) return res.status(404).json({ message: "Product not found" });
  const files = req.files || [];
  const uploaded = await Promise.all(files.map((file) => uploadBuffer(file, "localstore/products")));
  const images = await ProductImage.bulkCreate(
    uploaded.map((item, index) => ({ productId: product.id, url: item.url, publicId: item.publicId, sortOrder: index }))
  );
  res.status(201).json({ images });
});
