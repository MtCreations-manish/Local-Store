import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { sequelize } from "./config/database.js";
import "./models/index.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { apiRoutes } from "./routes/index.js";
import { seedThemes } from "./seed/themeSeed.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRoutes);
app.use(notFound);
app.use(errorHandler);

async function start() {
  await sequelize.authenticate();
  await sequelize.sync();
  await seedThemes();
  app.listen(port, () => console.log(`LocalStore API running on http://localhost:${port}`));
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
