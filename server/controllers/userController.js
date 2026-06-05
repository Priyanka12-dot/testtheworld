/**
 * controllers/userController.js
 * Handles all user-specific data:
 *   - Fetching the user profile
 *   - Saving a recipe to their cookbook
 *   - Toggling a favourite
 *   - Removing a saved recipe
 *   - Fetching saved recipes with filters
 *   - Updating preferences
 */

const User   = require("../models/User");
const Recipe = require("../models/Recipe");
const { asyncHandler, AppError } = require("../utils/errorHandler");

// ── GET /api/users/profile ────────────────────────────────────────────────────
/**
 * getProfile — returns the full authenticated user profile.
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path:   "savedRecipes.recipeId",
    select: "title country mealType image source",
  });

  if (!user) throw new AppError("User not found.", 404);

  res.status(200).json({ success: true, user });
});

// ── POST /api/users/save-recipe ───────────────────────────────────────────────
/**
 * saveRecipe — adds a recipe to the user's cookbook.
 * Body: { recipeId }
 */
const saveRecipe = asyncHandler(async (req, res) => {
  const { recipeId } = req.body;

  if (!recipeId) throw new AppError("recipeId is required.", 400);

  // Verify the recipe exists in our DB
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) throw new AppError("Recipe not found.", 404);

  const user = await User.findById(req.user._id);

  // Prevent duplicates
  if (user.hasRecipeSaved(recipeId)) {
    return res.status(200).json({
      success: true,
      message: "Recipe is already in your cookbook.",
      savedRecipes: user.savedRecipes,
    });
  }

  user.savedRecipes.push({
    recipeId:   recipe._id,
    title:      recipe.title,
    country:    recipe.country,
    mealType:   recipe.mealType,
    image:      recipe.image,
    isFavorite: false,
  });

  await user.save();

  res.status(200).json({
    success: true,
    message: `"${recipe.title}" saved to your cookbook!`,
    savedRecipes: user.savedRecipes,
  });
});

// ── DELETE /api/users/saved-recipes/:savedRecipeId ────────────────────────────
/**
 * removeSavedRecipe — removes a recipe from the user's cookbook.
 */
const removeSavedRecipe = asyncHandler(async (req, res) => {
  const { savedRecipeId } = req.params;

  const user = await User.findById(req.user._id);

  const index = user.savedRecipes.findIndex(
    (r) => r._id.toString() === savedRecipeId
  );

  if (index === -1) throw new AppError("Saved recipe not found.", 404);

  const removed = user.savedRecipes.splice(index, 1)[0];
  await user.save();

  res.status(200).json({
    success: true,
    message: `"${removed.title}" removed from your cookbook.`,
    savedRecipes: user.savedRecipes,
  });
});

// ── PATCH /api/users/saved-recipes/:savedRecipeId/favorite ───────────────────
/**
 * toggleFavorite — flips the isFavorite flag on a saved recipe.
 */
const toggleFavorite = asyncHandler(async (req, res) => {
  const { savedRecipeId } = req.params;

  const user = await User.findById(req.user._id);

  const savedRecipe = user.savedRecipes.id(savedRecipeId);
  if (!savedRecipe) throw new AppError("Saved recipe not found.", 404);

  savedRecipe.isFavorite = !savedRecipe.isFavorite;
  await user.save();

  res.status(200).json({
    success: true,
    message: savedRecipe.isFavorite
      ? `"${savedRecipe.title}" added to favourites! ⭐`
      : `"${savedRecipe.title}" removed from favourites.`,
    savedRecipes: user.savedRecipes,
  });
});

// ── GET /api/users/saved-recipes ─────────────────────────────────────────────
/**
 * getSavedRecipes — returns the user's saved recipe list.
 * Optional query filters: mealType, country, favoritesOnly
 */
const getSavedRecipes = asyncHandler(async (req, res) => {
  const { mealType, country, favoritesOnly } = req.query;

  const user = await User.findById(req.user._id).populate({
    path:   "savedRecipes.recipeId",
    select: "title country mealType image source description readyInMinutes servings",
  });

  let recipes = user.savedRecipes;

  // ── Apply optional filters ────────────────────────────────────────────────
  if (mealType) {
    recipes = recipes.filter(
      (r) => r.mealType?.toLowerCase() === mealType.toLowerCase()
    );
  }

  if (country) {
    recipes = recipes.filter(
      (r) => r.country?.toLowerCase() === country.toLowerCase()
    );
  }

  if (favoritesOnly === "true") {
    recipes = recipes.filter((r) => r.isFavorite);
  }

  res.status(200).json({
    success: true,
    count:   recipes.length,
    recipes,
  });
});

// ── PATCH /api/users/preferences ─────────────────────────────────────────────
/**
 * updatePreferences — updates the user's meal preferences.
 * Body: { defaultMealType, dietaryRestrictions }
 */
const updatePreferences = asyncHandler(async (req, res) => {
  const { defaultMealType, dietaryRestrictions } = req.body;

  const allowedMealTypes = ["breakfast", "lunch", "dinner"];

  if (defaultMealType && !allowedMealTypes.includes(defaultMealType)) {
    throw new AppError(
      `Invalid defaultMealType. Must be: ${allowedMealTypes.join(", ")}`,
      400
    );
  }

  const user = await User.findById(req.user._id);

  if (defaultMealType)       user.preferences.defaultMealType      = defaultMealType;
  if (dietaryRestrictions)   user.preferences.dietaryRestrictions  = dietaryRestrictions;

  await user.save();

  res.status(200).json({
    success:     true,
    message:     "Preferences updated.",
    preferences: user.preferences,
  });
});

// ── PATCH /api/users/spin-history ─────────────────────────────────────────────
/**
 * addToSpinHistory — logs a country the user spun to.
 * Body: { country }
 */
const addToSpinHistory = asyncHandler(async (req, res) => {
  const { country } = req.body;

  if (!country) throw new AppError("country is required.", 400);

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        spinHistory: {
          $each:  [country],
          $slice: -50, // Keep only the last 50 entries
        },
      },
    },
    { new: true }
  );

  res.status(200).json({ success: true, message: "Spin history updated." });
});

module.exports = {
  getProfile,
  saveRecipe,
  removeSavedRecipe,
  toggleFavorite,
  getSavedRecipes,
  updatePreferences,
  addToSpinHistory,
};