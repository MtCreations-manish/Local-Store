import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class SocialLink extends Model {}

SocialLink.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    storeId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    platform: { type: DataTypes.ENUM("instagram", "facebook", "youtube", "website"), allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false }
  },
  { sequelize, modelName: "SocialLink", tableName: "social_links", indexes: [{ fields: ["storeId"] }] }
);
