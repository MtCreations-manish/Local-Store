import express from "express";
import { body } from "express-validator";
import { forgotPassword, login, loginRules, me, register, registerRules } from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const authRoutes = express.Router();

authRoutes.post("/register", registerRules, validate, register);
authRoutes.post("/login", loginRules, validate, login);
authRoutes.post("/forgot-password", body("email").isEmail(), validate, forgotPassword);
authRoutes.get("/me", auth, me);
