import express from "express";
import { body } from "express-validator";
import { createTheme, listThemes } from "../controllers/themeController.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const themeRoutes = express.Router();

themeRoutes.get("/", listThemes);
themeRoutes.post("/", auth, [body("name").notEmpty(), body("key").notEmpty()], validate, createTheme);
