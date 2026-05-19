import express from "express";
import { createProduct, deleteProduct, listProducts, productRules, updateProduct } from "../controllers/productController.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const productRoutes = express.Router();

productRoutes.use(auth);
productRoutes.get("/stores/:storeId/products", listProducts);
productRoutes.post("/stores/:storeId/products", productRules, validate, createProduct);
productRoutes.put("/products/:productId", updateProduct);
productRoutes.delete("/products/:productId", deleteProduct);
