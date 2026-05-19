import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class StoreSection extends Model {}

StoreSection.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    storeId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    sectionKey: { type: DataTypes.STRING(60), allowNull: false },
    title: DataTypes.STRING(140),
    content: DataTypes.TEXT,
    visible: { type: DataTypes.BOOLEAN, defaultValue: true },
    sortOrder: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 }
  },
  { sequelize, modelName: "StoreSection", tableName: "store_sections", indexes: [{ fields: ["storeId", "sectionKey"] }] }
);
