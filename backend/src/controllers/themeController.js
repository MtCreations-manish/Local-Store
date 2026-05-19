import { Theme } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listThemes = asyncHandler(async (req, res) => {
  const themes = await Theme.findAll({ order: [["name", "ASC"]] });
  res.json({ themes });
});

export const createTheme = asyncHandler(async (req, res) => {
  const theme = await Theme.create(req.body);
  res.status(201).json({ theme });
});
