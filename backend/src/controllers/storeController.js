import { body, param } from "express-validator";
import { Op } from "sequelize";
import { Product, ProductImage, SocialLink, Store, StoreSection, Theme } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uniqueStoreSlug } from "../utils/slug.js";

const storeInclude = [
  Theme,
  { model: StoreSection, as: "sections" },
  { model: SocialLink, as: "socialLinks" }
];

export const storeRules = [
  body("name").trim().notEmpty(),
  body("category").isIn(["shopping", "grocery"]),
  body("themeId").optional({ nullable: true }).isInt()
];

export const createStore = asyncHandler(async (req, res) => {
  const theme = req.body.themeId ? await Theme.findByPk(req.body.themeId) : await Theme.findOne({ where: { key: req.body.category === "grocery" ? "grocery" : "modern-shopping" } });
  const store = await Store.create({
    ...req.body,
    userId: req.user.id,
    themeId: theme?.id,
    slug: await uniqueStoreSlug(req.body.slug || req.body.name)
  });
  await StoreSection.bulkCreate([
    { storeId: store.id, sectionKey: "hero", title: store.name, sortOrder: 1 },
    { storeId: store.id, sectionKey: "featured", title: "Featured products", sortOrder: 2 },
    { storeId: store.id, sectionKey: "products", title: "All products", sortOrder: 3 },
    { storeId: store.id, sectionKey: "about", title: "About us", content: store.description, sortOrder: 4 },
    { storeId: store.id, sectionKey: "contact", title: "Contact", sortOrder: 5 }
  ]);
  res.status(201).json({ store: await Store.findByPk(store.id, { include: storeInclude }) });
});

export const listMyStores = asyncHandler(async (req, res) => {
  const stores = await Store.findAll({ where: { userId: req.user.id }, include: storeInclude, order: [["createdAt", "DESC"]] });
  res.json({ stores });
});

export const getMyStore = asyncHandler(async (req, res) => {
  const store = await Store.findOne({ where: { id: req.params.id, userId: req.user.id }, include: storeInclude });
  if (!store) return res.status(404).json({ message: "Store not found" });
  res.json({ store });
});

export const updateStore = asyncHandler(async (req, res) => {
  const store = await Store.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!store) return res.status(404).json({ message: "Store not found" });
  const protectedFields = ["id", "userId", "slug"];
  Object.entries(req.body).forEach(([key, value]) => {
    if (!protectedFields.includes(key)) store[key] = value;
  });
  await store.save();
  res.json({ store: await Store.findByPk(store.id, { include: storeInclude }) });
});

export const deleteStore = asyncHandler(async (req, res) => {
  const store = await Store.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!store) return res.status(404).json({ message: "Store not found" });
  await store.destroy();
  res.status(204).send();
});

export const validateSlug = asyncHandler(async (req, res) => {
  const store = await Store.findOne({ where: { slug: req.params.slug } });
  res.json({ available: !store });
});

export const getPublicStore = asyncHandler(async (req, res) => {
  const { search, category, page = 1, limit = 12 } = req.query;
  const store = await Store.findOne({ where: { slug: req.params.slug }, include: storeInclude });
  if (!store) return res.status(404).json({ message: "Store not found" });

  const productWhere = { storeId: store.id };
  if (search) productWhere.name = { [Op.like]: `%${search}%` };
  if (category) productWhere.category = category;
  const offset = (Number(page) - 1) * Number(limit);
  const { rows: products, count } = await Product.findAndCountAll({
    where: productWhere,
    include: [{ model: ProductImage, as: "images" }],
    limit: Number(limit),
    offset,
    order: [["featured", "DESC"], ["createdAt", "DESC"]]
  });
  const categories = await Product.findAll({ where: { storeId: store.id }, attributes: ["category"], group: ["category"] });
  res.json({
    store,
    products,
    categories: categories.map((item) => item.category).filter(Boolean),
    pagination: { page: Number(page), limit: Number(limit), total: count, pages: Math.ceil(count / Number(limit)) }
  });
});

export const updateSections = asyncHandler(async (req, res) => {
  const store = await Store.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!store) return res.status(404).json({ message: "Store not found" });
  store.sectionOrder = req.body.sectionOrder || store.sectionOrder;
  store.hiddenSections = req.body.hiddenSections || store.hiddenSections;
  await store.save();
  if (Array.isArray(req.body.sections)) {
    await Promise.all(
      req.body.sections.map((section) =>
        StoreSection.update(section, { where: { id: section.id, storeId: store.id } })
      )
    );
  }
  res.json({ store: await Store.findByPk(store.id, { include: storeInclude }) });
});
