import express from "express";
import { upload } from "../config/cloudinary.js";
import { uploadProductImages, uploadStoreAsset } from "../controllers/uploadController.js";
import { auth } from "../middleware/auth.js";

export const uploadRoutes = express.Router();

uploadRoutes.use(auth);
uploadRoutes.post("/stores/:storeId", upload.single("image"), uploadStoreAsset);
uploadRoutes.post("/products/:productId", upload.array("images", 6), uploadProductImages);
