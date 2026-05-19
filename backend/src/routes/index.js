import express from "express";
import { authRoutes } from "./authRoutes.js";
import { productRoutes } from "./productRoutes.js";
import { storeRoutes } from "./storeRoutes.js";
import { themeRoutes } from "./themeRoutes.js";
import { uploadRoutes } from "./uploadRoutes.js";

export const apiRoutes = express.Router();

apiRoutes.get("/health", (req, res) => res.json({ status: "ok", service: "localstore-api" }));
apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/stores", storeRoutes);
apiRoutes.use("/", productRoutes);
apiRoutes.use("/themes", themeRoutes);
apiRoutes.use("/uploads", uploadRoutes);
