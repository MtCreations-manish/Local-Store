import { Product } from "./Product.js";
import { ProductImage } from "./ProductImage.js";
import { SocialLink } from "./SocialLink.js";
import { Store } from "./Store.js";
import { StoreSection } from "./StoreSection.js";
import { Theme } from "./Theme.js";
import { User } from "./User.js";

User.hasMany(Store, { foreignKey: "userId", onDelete: "CASCADE" });
Store.belongsTo(User, { foreignKey: "userId" });

Theme.hasMany(Store, { foreignKey: "themeId", onDelete: "SET NULL" });
Store.belongsTo(Theme, { foreignKey: "themeId" });

Store.hasMany(Product, { foreignKey: "storeId", onDelete: "CASCADE" });
Product.belongsTo(Store, { foreignKey: "storeId" });

Product.hasMany(ProductImage, { foreignKey: "productId", as: "images", onDelete: "CASCADE" });
ProductImage.belongsTo(Product, { foreignKey: "productId" });

Store.hasMany(StoreSection, { foreignKey: "storeId", as: "sections", onDelete: "CASCADE" });
StoreSection.belongsTo(Store, { foreignKey: "storeId" });

Store.hasMany(SocialLink, { foreignKey: "storeId", as: "socialLinks", onDelete: "CASCADE" });
SocialLink.belongsTo(Store, { foreignKey: "storeId" });

export { Product, ProductImage, SocialLink, Store, StoreSection, Theme, User };
