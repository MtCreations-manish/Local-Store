import express from "express";
import {
  createStore,
  deleteStore,
  getMyStore,
  getPublicStore,
  listMyStores,
  storeRules,
  updateSections,
  updateStore,
  validateSlug
} from "../controllers/storeController.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const storeRoutes = express.Router();

storeRoutes.get("/public/:slug", getPublicStore);
storeRoutes.get("/slug/:slug", validateSlug);
storeRoutes.use(auth);
storeRoutes.get("/", listMyStores);
storeRoutes.post("/", storeRules, validate, createStore);
storeRoutes.get("/:id", getMyStore);
storeRoutes.put("/:id", updateStore);
storeRoutes.patch("/:id/sections", updateSections);
storeRoutes.delete("/:id", deleteStore);
