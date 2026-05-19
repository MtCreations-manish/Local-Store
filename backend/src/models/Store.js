import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Store extends Model {}

Store.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    themeId: { type: DataTypes.INTEGER.UNSIGNED },
    name: { type: DataTypes.STRING(140), allowNull: false },
    slug: { type: DataTypes.STRING(160), allowNull: false, unique: true },
    description: DataTypes.TEXT,
    logoUrl: DataTypes.STRING,
    bannerUrl: DataTypes.STRING,
    category: { type: DataTypes.ENUM("shopping", "grocery"), allowNull: false },
    colorPalette: { type: DataTypes.JSON, defaultValue: { primary: "#2563eb", accent: "#f97316" } },
    sectionOrder: { type: DataTypes.JSON, defaultValue: ["hero", "featured", "products", "about", "contact"] },
    hiddenSections: { type: DataTypes.JSON, defaultValue: [] },
    whatsappNumber: DataTypes.STRING(32),
    email: DataTypes.STRING(160),
    address: DataTypes.TEXT,
    instagramLink: DataTypes.STRING,
    facebookLink: DataTypes.STRING,
    youtubeLink: DataTypes.STRING,
    upiId: DataTypes.STRING(120),
    paymentQrUrl: DataTypes.STRING,
    codEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
    upiEnabled: { type: DataTypes.BOOLEAN, defaultValue: true }
  },
  {
    sequelize,
    modelName: "Store",
    tableName: "stores",
    indexes: [
      { unique: true, fields: ["slug"] },
      { fields: ["userId"] },
      { fields: ["category"] }
    ]
  }
);
