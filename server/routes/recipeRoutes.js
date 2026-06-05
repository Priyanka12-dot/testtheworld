/**
 * routes/recipeRoutes.js
 * Recipe endpoints.
 *
 * GET  /api/recipes/fetch          — fetch recipe for country+mealType
 * GET  /api/recipes/countries      — list all supported countries
 * GET  /api/recipes/random         — get a random country (Spin the Globe)
 * GET  /api/recipes/recently-spun  — last fetched recipes (for UI strip)
 */

const express = require("express");
const router  = express.Router();

const {
  fetchRecipe,
  getCountries,
  getRandomCountry,
  recentlySpun,
} = require("../controllers/recipeController");

const { optionalAuth } = require("../middleware/authMiddleware");
const rateLimit        = require("express-rate-limit");

// Limit recipe fetches to avoid burning through Spoonacular / Groq credits
const recipeLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute window
  max:      30,          // 30 requests per minute per IP
  message: {
    success: false,
    message: "Too many recipe requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders:   false,
});

// Public routes — optionalAuth attaches user if logged in (for analytics)
router.get("/countries",     getCountries);
router.get("/random",        getRandomCountry);
router.get("/recently-spun", recentlySpun);
router.get("/fetch",         recipeLimiter, optionalAuth, fetchRecipe);

module.exports = router;