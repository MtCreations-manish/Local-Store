import dotenv from "dotenv";
import { sequelize } from "../config/database.js";
import { Product, ProductImage, Store, Theme, User } from "../models/index.js";
import { seedThemes } from "./themeSeed.js";

dotenv.config();

const productImages = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"
];

async function run() {
  await sequelize.sync({ force: true });
  await seedThemes();
  const user = await User.create({ name: "Demo Owner", email: "owner@localstore.test", passwordHash: "password123" });
  const theme = await Theme.findOne({ where: { key: "modern-shopping" } });
  const store = await Store.create({
    userId: user.id,
    themeId: theme.id,
    name: "Urban Daily Store",
    slug: "urban-daily-store",
    description: "Curated local products with friendly WhatsApp ordering.",
    category: "shopping",
    whatsappNumber: "919999999999",
    email: "hello@urbandaily.test",
    address: "MG Road, Bengaluru",
    instagramLink: "https://instagram.com"
  });
  const products = await Product.bulkCreate([
    { storeId: store.id, name: "Classic Watch", slug: "classic-watch", price: 2499, discountPrice: 1999, category: "Accessories", quantity: 12, sku: "UD-WATCH-1", featured: true, tags: ["watch", "style"] },
    { storeId: store.id, name: "Running Sneakers", slug: "running-sneakers", price: 3299, discountPrice: 2799, category: "Shoes", quantity: 20, sku: "UD-SHOE-1", featured: true, tags: ["shoes"] },
    { storeId: store.id, name: "Fresh Grocery Basket", slug: "fresh-grocery-basket", price: 799, category: "Grocery", quantity: 30, sku: "UD-GROC-1", featured: false, tags: ["fresh"], weight: "5", unit: "kg" }
  ]);
  await Promise.all(products.map((product, index) => ProductImage.create({ productId: product.id, url: productImages[index] })));
  console.log("Seed complete: owner@localstore.test / password123");
  await sequelize.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
