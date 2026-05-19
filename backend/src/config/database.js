import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const sslEnabled = process.env.DB_SSL === "true";

export const sequelize = new Sequelize(
  process.env.DB_NAME || "localstore_platform",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    dialectOptions: sslEnabled ? { ssl: { require: true, rejectUnauthorized: false } } : {}
  }
);
