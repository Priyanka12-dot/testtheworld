/**
 * models/User.js
 * Mongoose schema for registered users.
 * Stores hashed passwords, saved recipes, and favourites.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const savedRecipeSchema = new mongoose.Schema(
  {
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
    title:    { type: String, required: true },
    country:  { type: String, required: true },
    mealType: { type: String, enum: ["breakfast", "lunch", "dinner"], required: true },
    image:    { type: String, default: "" },
    isFavorite: { type: Boolean, default: false },
    savedAt:  { type: Date, default: Date.now },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters."],
      maxlength: [30, "Username must not exceed 30 characters."],
      match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."],
    },

    password_hash: {
      type: String,
      required: [true, "Password is required."],
      minlength: 6,
    },

    savedRecipes: {
      type: [savedRecipeSchema],
      default: [],
    },

    // Tracks the countries the user has "spun" to
    spinHistory: {
      type: [String],
      default: [],
    },

    // User preferences
    preferences: {
      defaultMealType: {
        type: String,
        enum: ["breakfast", "lunch", "dinner"],
        default: "dinner",
      },
      dietaryRestrictions: {
        type: [String],
        default: [],
      },
    },

    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password_hash; // Never expose the hash in API responses
        return ret;
      },
    },
  }
);

// ── Pre-save hook: hash password before storing ──────────────────────────────
userSchema.pre("save", async function () {
  if (!this.isModified("password_hash")) return;
  const salt = await bcrypt.genSalt(12);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
});

// ── Instance method: compare candidate password with stored hash ─────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

// ── Instance method: check if a recipe is already saved ─────────────────────
userSchema.methods.hasRecipeSaved = function (recipeId) {
  return this.savedRecipes.some(
    (r) => r.recipeId?.toString() === recipeId?.toString()
  );
};

module.exports = mongoose.model("User", userSchema);