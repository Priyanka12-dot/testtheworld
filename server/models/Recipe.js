/**
 * models/Recipe.js
 * Mongoose schema for caching fetched / AI-generated recipes.
 * Caching avoids redundant Spoonacular / Groq calls for popular combos.
 */

const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true },
    amount:  { type: Number, default: null },
    unit:    { type: String, default: "" },
    original:{ type: String, default: "" }, // raw string from Spoonacular
  },
  { _id: false }
);

const stepSchema = new mongoose.Schema(
  {
    number:      { type: Number, required: true },
    instruction: { type: String, required: true },
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    // ── Source identification ──────────────────────────────────────────────
    country:  {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    cuisine:  { type: String, default: "" },   // Spoonacular cuisine label
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      required: true,
      index: true,
    },

    // ── Recipe content ────────────────────────────────────────────────────
    title:       { type: String, required: true },
    image:       { type: String, default: "" },
    description: { type: String, default: "" },
    ingredients: { type: [ingredientSchema], default: [] },
    steps:       { type: [stepSchema], default: [] },
    tips:        { type: [String], default: [] },   // Cultural / cooking tips

    // ── Meta ──────────────────────────────────────────────────────────────
    readyInMinutes: { type: Number, default: null },
    servings:       { type: Number, default: 2 },
    difficulty:     {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    tags:           { type: [String], default: [] },

    // ── Origin tracking ───────────────────────────────────────────────────
    source: {
      type: String,
      enum: ["spoonacular", "groq"],
      required: true,
    },
    spoonacularId: { type: Number, default: null }, // Only set if source === 'spoonacular'

    // ── Cache control ─────────────────────────────────────────────────────
    // Recipes expire after 7 days so content stays fresh
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      index: { expireAfterSeconds: 0 }, // MongoDB TTL index
    },

    // ── Popularity tracking ───────────────────────────────────────────────
    fetchCount: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

// Compound index: one cached recipe per country+mealType combo
recipeSchema.index({ country: 1, mealType: 1 });

// ── Static method: find a cached (non-expired) recipe ───────────────────────
recipeSchema.statics.findCached = function (country, mealType) {
  return this.findOne({
    country: new RegExp(`^${country}$`, "i"),
    mealType,
    expiresAt: { $gt: new Date() },
  });
};

module.exports = mongoose.model("Recipe", recipeSchema);