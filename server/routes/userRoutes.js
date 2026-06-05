/**
 * routes/userRoutes.js
 * User-specific (protected) endpoints.
 *
 * GET    /api/users/profile                              — full user profile
 * POST   /api/users/save-recipe                         — save recipe to cookbook
 * GET    /api/users/saved-recipes                       — list saved recipes (with filters)
 * DELETE /api/users/saved-recipes/:savedRecipeId        — remove saved recipe
 * PATCH  /api/users/saved-recipes/:savedRecipeId/favorite — toggle favourite
 * PATCH  /api/users/preferences                         — update meal preferences
 * PATCH  /api/users/spin-history                        — log a spin
 */

const express = require("express");
const router  = express.Router();

const {
  getProfile,
  saveRecipe,
  removeSavedRecipe,
  toggleFavorite,
  getSavedRecipes,
  updatePreferences,
  addToSpinHistory,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// All user routes require authentication
router.use(protect);

router.get(  "/profile",                                    getProfile);
router.post( "/save-recipe",                                saveRecipe);
router.get(  "/saved-recipes",                              getSavedRecipes);
router.delete("/saved-recipes/:savedRecipeId",              removeSavedRecipe);
router.patch("/saved-recipes/:savedRecipeId/favorite",      toggleFavorite);
router.patch("/preferences",                                updatePreferences);
router.patch("/spin-history",                               addToSpinHistory);

module.exports = router;