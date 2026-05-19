import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Theme extends Model {}

Theme.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    key: { type: DataTypes.STRING(80), allowNull: false, unique: true },
    category: { type: DataTypes.ENUM("shopping", "grocery", "all"), defaultValue: "all" },
    previewImage: DataTypes.STRING,
    description: DataTypes.TEXT
  },
  { sequelize, modelName: "Theme", tableName: "themes", indexes: [{ unique: true, fields: ["key"] }] }
);
