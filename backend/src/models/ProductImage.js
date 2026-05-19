import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class ProductImage extends Model {}

ProductImage.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    publicId: DataTypes.STRING,
    sortOrder: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 }
  },
  { sequelize, modelName: "ProductImage", tableName: "product_images", indexes: [{ fields: ["productId"] }] }
);
