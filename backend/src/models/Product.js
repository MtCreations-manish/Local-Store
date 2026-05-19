import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Product extends Model {}

Product.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    storeId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    name: { type: DataTypes.STRING(180), allowNull: false },
    slug: { type: DataTypes.STRING(200), allowNull: false },
    description: DataTypes.TEXT,
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    discountPrice: DataTypes.DECIMAL(10, 2),
    category: DataTypes.STRING(100),
    availability: { type: DataTypes.BOOLEAN, defaultValue: true },
    quantity: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
    sku: DataTypes.STRING(80),
    featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    tags: { type: DataTypes.JSON, defaultValue: [] },
    weight: DataTypes.STRING(60),
    expiryDate: DataTypes.DATEONLY,
    unit: DataTypes.STRING(40)
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    indexes: [
      { fields: ["storeId"] },
      { fields: ["category"] },
      { fields: ["featured"] },
      { unique: true, fields: ["storeId", "slug"] },
      { fields: ["name"] }
    ]
  }
);
