/**
 * utils/spoonacularClient.js
 * Wraps Spoonacular API calls with cuisine-country mapping and
 * structured error handling.
 */

const axios = require("axios");

const BASE_URL =
  process.env.SPOONACULAR_BASE_URL || "https://api.spoonacular.com";

// ── Country → Spoonacular cuisine mapping ────────────────────────────────────
// Spoonacular uses cuisine labels, not country names.
const COUNTRY_TO_CUISINE = {
  // Asia
  japan:        "Japanese",
  china:        "Chinese",
  india:        "Indian",
  thailand:     "Thai",
  vietnam:      "Vietnamese",
  korea:        "Korean",
  indonesia:    "Indonesian",
  malaysia:     "Malaysian",
  philippines:  "Filipino",
  myanmar:      "Burmese",
  cambodia:     "Cambodian",
  laos:         "Laotian",
  singapore:    "Singaporean",
  bangladesh:   "Bangladeshi",
  pakistan:     "Pakistani",
  "sri lanka":  "Sri Lankan",
  nepal:        "Nepali",

  // Middle East
  "saudi arabia": "Middle Eastern",
  iran:           "Persian",
  turkey:         "Turkish",
  lebanon:        "Lebanese",
  israel:         "Jewish",
  iraq:           "Iraqi",
  jordan:         "Middle Eastern",
  uae:            "Middle Eastern",
  egypt:          "Egyptian",

  // Africa
  morocco:        "Moroccan",
  ethiopia:       "Ethiopian",
  nigeria:        "Nigerian",
  ghana:          "Ghanaian",
  "south africa": "South African",
  kenya:          "Kenyan",
  senegal:        "Senegalese",
  tanzania:       "Tanzanian",

  // Europe
  italy:          "Italian",
  france:         "French",
  spain:          "Spanish",
  greece:         "Greek",
  germany:        "German",
  portugal:       "Portuguese",
  uk:             "British",
  "united kingdom": "British",
  ireland:        "Irish",
  netherlands:    "Dutch",
  belgium:        "Belgian",
  switzerland:    "Swiss",
  austria:        "Austrian",
  sweden:         "Scandinavian",
  norway:         "Scandinavian",
  denmark:        "Scandinavian",
  finland:        "Finnish",
  poland:         "Polish",
  russia:         "Eastern European",
  ukraine:        "Eastern European",
  hungary:        "Hungarian",
  czech:          "Eastern European",
  romania:        "Eastern European",

  // Americas
  mexico:         "Mexican",
  usa:            "American",
  "united states":"American",
  canada:         "Canadian",
  brazil:         "Brazilian",
  argentina:      "Argentinian",
  peru:           "Peruvian",
  colombia:       "Colombian",
  chile:          "Chilean",
  venezuela:      "Venezuelan",
  cuba:           "Cuban",
  jamaica:        "Jamaican",
  haiti:          "Haitian",

  // Oceania
  australia:      "Australian",
  "new zealand":  "New Zealand",
};

/**
 * getCuisineLabel — converts a country name into a Spoonacular cuisine string.
 * Falls back to the raw country name if no mapping exists.
 *
 * @param {string} country
 * @returns {string}
 */
const getCuisineLabel = (country) => {
  const key = country.trim().toLowerCase();
  return COUNTRY_TO_CUISINE[key] || country;
};

/**
 * getMealTypeFilter — maps our meal types to Spoonacular's meal type param.
 *
 * @param {string} mealType  'breakfast' | 'lunch' | 'dinner'
 * @returns {string}
 */
const getMealTypeFilter = (mealType) => {
  const map = {
    breakfast: "breakfast",
    lunch:     "main course",
    dinner:    "main course",
  };
  return map[mealType] || "main course";
};

/**
 * searchRecipes — searches Spoonacular for recipes matching a cuisine and meal type.
 *
 * @param {string} country
 * @param {string} mealType  'breakfast' | 'lunch' | 'dinner'
 * @param {number} number    How many results to request (default: 5)
 * @returns {Promise<Object[]>}  Array of basic recipe objects
 */
const searchRecipes = async (country, mealType, number = 5) => {
  const cuisine  = getCuisineLabel(country);
  const mealTag  = getMealTypeFilter(mealType);

  const params = {
    apiKey:  process.env.SPOONACULAR_API_KEY,
    cuisine,
    type:    mealTag,
    number,
    addRecipeInformation: true,
    fillIngredients:      true,
    instructionsRequired: true,
    sort:                 "popularity",
  };

  const response = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
    params,
    timeout: 10000,
  });

  return response.data?.results || [];
};

/**
 * getRecipeDetails — fetches full step-by-step info for a specific recipe ID.
 *
 * @param {number} recipeId
 * @returns {Promise<Object>}
 */
const getRecipeDetails = async (recipeId) => {
  const response = await axios.get(`${BASE_URL}/recipes/${recipeId}/information`, {
    params: {
      apiKey:          process.env.SPOONACULAR_API_KEY,
      includeNutrition: false,
    },
    timeout: 10000,
  });

  return response.data;
};

/**
 * getAnalyzedInstructions — fetches parsed step-by-step instructions.
 *
 * @param {number} recipeId
 * @returns {Promise<Object[]>}
 */
const getAnalyzedInstructions = async (recipeId) => {
  const response = await axios.get(
    `${BASE_URL}/recipes/${recipeId}/analyzedInstructions`,
    {
      params: { apiKey: process.env.SPOONACULAR_API_KEY },
      timeout: 10000,
    }
  );
  return response.data || [];
};

/**
 * fetchSpoonacularRecipe — orchestrates search + detail + instructions for a
 * country + meal type combo. Returns null if nothing useful is found.
 *
 * @param {string} country
 * @param {string} mealType
 * @returns {Promise<Object|null>}
 */
const fetchSpoonacularRecipe = async (country, mealType) => {
  const results = await searchRecipes(country, mealType, 5);

  if (!results || results.length === 0) return null;

  // Pick a random recipe from the top results for variety
  const pick = results[Math.floor(Math.random() * results.length)];

  // If the search already returned full info (addRecipeInformation: true)
  // we may already have what we need; still fetch instructions separately
  // because complexSearch doesn't always include them.
  const [details, instructions] = await Promise.all([
    pick.analyzedInstructions ? Promise.resolve(pick) : getRecipeDetails(pick.id),
    getAnalyzedInstructions(pick.id),
  ]);

  return { ...details, analyzedInstructions: instructions };
};

module.exports = {
  fetchSpoonacularRecipe,
  getCuisineLabel,
  COUNTRY_TO_CUISINE,
};