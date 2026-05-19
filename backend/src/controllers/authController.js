import crypto from "crypto";
import { body } from "express-validator";
import { User } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/jwt.js";

const cleanUser = (user) => ({ id: user.id, name: user.name, email: user.email });

export const registerRules = [body("name").trim().notEmpty(), body("email").isEmail(), body("password").isLength({ min: 8 })];
export const loginRules = [body("email").isEmail(), body("password").notEmpty()];

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(409).json({ message: "Email already registered" });
  const user = await User.create({ name, email, passwordHash: password });
  res.status(201).json({ token: signToken(user), user: cleanUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user || !(await user.comparePassword(req.body.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json({ token: signToken(user), user: cleanUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (user) {
    user.resetToken = crypto.randomBytes(24).toString("hex");
    user.resetTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 30);
    await user.save();
  }
  res.json({ message: "If this email exists, a reset link can be sent.", resetToken: process.env.NODE_ENV === "production" ? undefined : user?.resetToken });
});
