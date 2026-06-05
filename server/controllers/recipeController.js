/**
 * controllers/recipeController.js
 * Core recipe logic:
 *   1. Check MongoDB cache for an existing recipe.
 *   2. Try Spoonacular for a real recipe.
 *   3. Fall back to Groq AI if Spoonacular has nothing.
 *   4. Persist to cache and return to client.
 */

const Recipe   = require("../models/Recipe");
const { fetchSpoonacularRecipe }       = require("../utils/spoonacularClient");
const { generateGroqRecipe }           = require("../utils/groqClient");
const {
  parseSpoonacularRecipe,
  parseGroqRecipe,
  validateParsedRecipe,
}              = require("../utils/recipeParser");
const { asyncHandler, AppError }       = require("../utils/errorHandler");

// ── List of supported countries (for random spin) ─────────────────────────────
const SUPPORTED_COUNTRIES = [
  // Asia
  "Japan", "China", "India", "Thailand", "Vietnam", "South Korea",
  "Indonesia", "Malaysia", "Philippines", "Singapore", "Bangladesh",
  "Pakistan", "Sri Lanka", "Nepal", "Myanmar", "Cambodia",
  // Middle East
  "Turkey", "Lebanon", "Iran", "Saudi Arabia", "Egypt", "Israel",
  "Iraq", "Jordan",
  // Africa
  "Morocco", "Ethiopia", "Nigeria", "Ghana", "Kenya", "South Africa",
  "Senegal", "Tanzania",
  // Europe
  "Italy", "France", "Spain", "Greece", "Germany", "Portugal",
  "United Kingdom", "Ireland", "Netherlands", "Belgium", "Sweden",
  "Norway", "Denmark", "Finland", "Poland", "Russia", "Hungary",
  "Switzerland", "Austria",
  // Americas
  "Mexico", "Brazil", "Argentina", "Peru", "Colombia", "Cuba",
  "Jamaica", "Venezuela", "Chile", "Canada", "United States",
  // Oceania
  "Australia", "New Zealand",
];

const VALID_MEAL_TYPES = ["breakfast", "lunch", "dinner"];

// ── GET /api/recipes/countries ────────────────────────────────────────────────
/**
 * getCountries — returns the full list of supported countries for the UI dropdown.
 */
const getCountries = asyncHandler(async (_req, res) => {
  res.status(200).json({
    success: true,
    countries: SUPPORTED_COUNTRIES,
  });
});

// ── GET /api/recipes/random ───────────────────────────────────────────────────
/**
 * getRandomCountry — picks a random country (used by the "Spin the Globe" button).
 */
const getRandomCountry = asyncHandler(async (_req, res) => {
  const country = SUPPORTED_COUNTRIES[
    Math.floor(Math.random() * SUPPORTED_COUNTRIES.length)
  ];
  res.status(200).json({ success: true, country });
});

// ── GET /api/recipes/fetch ────────────────────────────────────────────────────
/**
 * fetchRecipe — the main endpoint.
 * Query params: country (string), mealType (breakfast|lunch|dinner)
 *
 * Flow:
 *   1. Validate inputs
 *   2. Check MongoDB cache
 *   3. Try Spoonacular
 *   4. Fallback to Groq
 *   5. Save to cache
 *   6. Return normalised recipe
 */
const fetchRecipe = asyncHandler(async (req, res) => {
  const { country, mealType } = req.query;

  // ── 1. Validate ─────────────────────────────────────────────────────────────
  if (!country || !mealType) {
    throw new AppError("Both 'country' and 'mealType' query parameters are required.", 400);
  }

  const normalizedMealType = mealType.toLowerCase();
  if (!VALID_MEAL_TYPES.includes(normalizedMealType)) {
    throw new AppError(
      `Invalid mealType. Must be one of: ${VALID_MEAL_TYPES.join(", ")}`,
      400
    );
  }

  const normalizedCountry = country.trim();

  // ── 2. Check cache ──────────────────────────────────────────────────────────
  console.log(`🔍  Looking for cached recipe: ${normalizedCountry} | ${normalizedMealType}`);
  const cached = await Recipe.findCached(normalizedCountry, normalizedMealType);

  if (cached) {
    console.log(`✅  Cache hit — returning cached recipe: "${cached.title}"`);
    // Increment fetch count in the background
    Recipe.findByIdAndUpdate(cached._id, { $inc: { fetchCount: 1 } }).exec();

    return res.status(200).json({
      success: true,
      fromCache: true,
      recipe: cached,
    });
  }

  // ── 3. Try Spoonacular ──────────────────────────────────────────────────────
  let parsedRecipe = null;
  let source       = null;

  try {
    console.log(`🌐  Querying Spoonacular for: ${normalizedCountry} | ${normalizedMealType}`);
    const raw = await fetchSpoonacularRecipe(normalizedCountry, normalizedMealType);

    if (raw && raw.analyzedInstructions?.length > 0) {
      parsedRecipe = parseSpoonacularRecipe(raw, normalizedCountry, normalizedMealType);
      validateParsedRecipe(parsedRecipe);
      source = "spoonacular";
      console.log(`✅  Spoonacular returned: "${parsedRecipe.title}"`);
    } else {
      console.log("⚠️   Spoonacular returned no usable results — falling back to Groq.");
    }
  } catch (spoonacularError) {
    console.warn(`⚠️   Spoonacular error: ${spoonacularError.message}. Falling back to Groq.`);
  }

  // ── 4. Groq fallback ────────────────────────────────────────────────────────
  if (!parsedRecipe) {
    try {
      console.log(`🤖  Generating recipe with Groq AI: ${normalizedCountry} | ${normalizedMealType}`);
      const rawGroq = await generateGroqRecipe(normalizedCountry, normalizedMealType);
      parsedRecipe  = parseGroqRecipe(rawGroq, normalizedCountry, normalizedMealType);
      validateParsedRecipe(parsedRecipe);
      source = "groq";
      console.log(`✅  Groq generated: "${parsedRecipe.title}"`);
    } catch (groqError) {
      console.error(`❌  Groq error: ${groqError.message}`);
      throw new AppError(
        "We could not find or generate a recipe for this combination. Please try a different country or meal type.",
        503
      );
    }
  }

  // ── 5. Persist to cache ─────────────────────────────────────────────────────
  let savedRecipe;
  try {
    savedRecipe = await Recipe.create({
      ...parsedRecipe,
      source,
    });
    console.log(`💾  Recipe cached with id: ${savedRecipe._id}`);
  } catch (dbError) {
    // Cache failure is non-fatal — still return the recipe to the user
    console.warn(`⚠️   Could not cache recipe: ${dbError.message}`);
    savedRecipe = parsedRecipe; // Return raw parsed object
  }

  // ── 6. Respond ──────────────────────────────────────────────────────────────
  res.status(200).json({
    success: true,
    fromCache: false,
    recipe: savedRecipe,
  });
});

// ── GET /api/recipes/recently-spun ───────────────────────────────────────────
/**
 * recentlySpun — returns the most recently cached recipes (for the UI strip).
 */
const recentlySpun = asyncHandler(async (_req, res) => {
  const recent = await Recipe.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select("title country mealType image source createdAt");

  res.status(200).json({ success: true, recipes: recent });
});

module.exports = {
  fetchRecipe,
  getCountries,
  getRandomCountry,
  recentlySpun,
};