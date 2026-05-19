import { body } from "express-validator";
import { Op } from "sequelize";
import { Product, ProductImage, Store } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uniqueProductSlug } from "../utils/slug.js";

export const productRules = [
  body("name").trim().notEmpty(),
  body("price").isFloat({ min: 0 }),
  body("discountPrice").optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }),
  body("quantity").optional({ nullable: true, checkFalsy: true }).isInt({ min: 0 }),
  body("expiryDate").optional({ nullable: true, checkFalsy: true }).isISO8601()
];

async function findOwnedStore(userId, storeId) {
  return Store.findOne({ where: { id: storeId, userId } });
}

function productPayload(body) {
  const payload = { ...body };
  for (const key of ["discountPrice", "quantity", "expiryDate", "weight", "unit", "sku", "category", "description"]) {
    if (payload[key] === "") payload[key] = null;
  }
  if (payload.quantity == null) payload.quantity = 0;
  if (typeof payload.tags === "string") {
    payload.tags = payload.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  }
  return payload;
}

export const listProducts = asyncHandler(async (req, res) => {
  const store = await findOwnedStore(req.user.id, req.params.storeId);
  if (!store) return res.status(404).json({ message: "Store not found" });
  const { search, category, page = 1, limit = 20 } = req.query;
  const where = { storeId: store.id };
  if (search) where.name = { [Op.like]: `%${search}%` };
  if (category) where.category = category;
  const offset = (Number(page) - 1) * Number(limit);
  const { rows: products, count } = await Product.findAndCountAll({
    where,
    include: [{ model: ProductImage, as: "images" }],
    limit: Number(limit),
    offset,
    order: [["createdAt", "DESC"]]
  });
  res.json({ products, pagination: { total: count, page: Number(page), pages: Math.ceil(count / Number(limit)) } });
});

export const createProduct = asyncHandler(async (req, res) => {
  const store = await findOwnedStore(req.user.id, req.params.storeId);
  if (!store) return res.status(404).json({ message: "Store not found" });
  const payload = productPayload(req.body);
  const product = await Product.create({
    ...payload,
    storeId: store.id,
    slug: await uniqueProductSlug(store.id, payload.name)
  });
  res.status(201).json({ product: await Product.findByPk(product.id, { include: [{ model: ProductImage, as: "images" }] }) });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    where: { id: req.params.productId },
    include: [{ model: Store, where: { userId: req.user.id } }]
  });
  if (!product) return res.status(404).json({ message: "Product not found" });
  const payload = productPayload(req.body);
  Object.assign(product, payload);
  if (payload.name) product.slug = await uniqueProductSlug(product.storeId, payload.name, product.id);
  await product.save();
  res.json({ product: await Product.findByPk(product.id, { include: [{ model: ProductImage, as: "images" }] }) });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    where: { id: req.params.productId },
    include: [{ model: Store, where: { userId: req.user.id } }]
  });
  if (!product) return res.status(404).json({ message: "Product not found" });
  await product.destroy();
  res.status(204).send();
});
