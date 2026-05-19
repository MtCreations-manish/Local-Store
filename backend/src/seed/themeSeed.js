import { Theme } from "../models/index.js";

export const themes = [
  { name: "Modern Shopping Theme", key: "modern-shopping", category: "shopping", description: "Bold ecommerce layout for fashion and general retail." },
  { name: "Minimal Theme", key: "minimal", category: "all", description: "Clean catalog with crisp typography and quiet product grids." },
  { name: "Grocery Theme", key: "grocery", category: "grocery", description: "Fast, fresh, category-forward grocery storefront." },
  { name: "Premium Catalog Theme", key: "premium-catalog", category: "shopping", description: "Editorial product presentation for premium catalogs." },
  { name: "Uttarakhand Aipan Theme", key: "uttarakhand-aipan", category: "all", description: "A vibrant Uttarakhand-inspired storefront with Aipan folk-art patterns, Himalayan warmth, and red ivory styling." }
];

export async function seedThemes() {
  await Promise.all(themes.map((theme) => Theme.findOrCreate({ where: { key: theme.key }, defaults: theme })));
}
