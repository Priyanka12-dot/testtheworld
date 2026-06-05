/**
 * utils/recipeParser.js
 * Normalises recipe data from Spoonacular OR Groq into a single,
 * consistent shape that the frontend always receives.
 *
 * Output shape:
 * {
 *   title, description, country, cuisine, mealType,
 *   image, readyInMinutes, servings, difficulty,
 *   ingredients: [{ name, amount, unit, original }],
 *   steps:       [{ number, instruction }],
 *   tips:        string[],
 *   tags:        string[],
 *   source:      'spoonacular' | 'groq',
 *   spoonacularId: number | null,
 * }
 */

/**
 * parseDifficulty — infers difficulty from cooking time.
 *
 * @param {number|null} minutes
 * @returns {'easy'|'medium'|'hard'}
 */
const parseDifficulty = (minutes) => {
  if (!minutes) return "medium";
  if (minutes <= 25)  return "easy";
  if (minutes <= 60)  return "medium";
  return "hard";
};

/**
 * parseIngredients — normalises Spoonacular's extendedIngredients array.
 *
 * @param {Object[]} rawIngredients
 * @returns {Object[]}
 */
const parseIngredients = (rawIngredients = []) =>
  rawIngredients.map((ing) => ({
    name:     ing.name      || ing.nameClean || "Unknown",
    amount:   ing.amount    ?? null,
    unit:     ing.unit      || "",
    original: ing.original  || `${ing.amount} ${ing.unit} ${ing.name}`.trim(),
  }));

/**
 * parseSteps — normalises Spoonacular's analyzedInstructions array.
 *
 * @param {Object[]} analyzedInstructions  Raw Spoonacular instructions
 * @returns {Object[]}
 */
const parseSteps = (analyzedInstructions = []) => {
  // Spoonacular may return multiple instruction blocks; flatten them.
  const allSteps = [];
  analyzedInstructions.forEach((block) => {
    (block.steps || []).forEach((s) => {
      allSteps.push({
        number:      s.number,
        instruction: s.step,
      });
    });
  });
  return allSteps;
};

/**
 * extractTips — generates basic cultural tips from Spoonacular tags.
 * Since Spoonacular doesn't provide tips, we build simple ones from metadata.
 *
 * @param {Object} raw  Full Spoonacular recipe object
 * @returns {string[]}
 */
const extractTips = (raw) => {
  const tips = [];

  if (raw.veryHealthy) {
    tips.push("This dish is considered very nutritious in its home country.");
  }
  if (raw.cheap) {
    tips.push("This is a budget-friendly everyday dish enjoyed by locals.");
  }
  if (raw.veryPopular) {
    tips.push("One of the most beloved dishes in this cuisine — a true crowd-pleaser.");
  }
  if (raw.dairyFree) {
    tips.push("Naturally dairy-free — perfect if you're lactose intolerant.");
  }
  if (raw.glutenFree) {
    tips.push("This recipe is gluten-free as traditionally prepared.");
  }
  if (raw.vegetarian) {
    tips.push("A classic vegetarian option in this cuisine.");
  }

  if (tips.length === 0) {
    tips.push(
      `Best enjoyed fresh. Leftovers can be refrigerated and reheated gently.`
    );
  }

  return tips;
};

/**
 * parseSpoonacularRecipe — converts a raw Spoonacular API response
 * into our normalised recipe shape.
 *
 * @param {Object} raw     Full Spoonacular recipe object
 * @param {string} country The country that was requested
 * @param {string} mealType
 * @returns {Object}       Normalised recipe
 */
const parseSpoonacularRecipe = (raw, country, mealType) => ({
  title:          raw.title || "Untitled Recipe",
  description:    raw.summary
    ? raw.summary.replace(/<[^>]+>/g, "").slice(0, 300) + "…"   // Strip HTML
    : "",
  country,
  cuisine:        (raw.cuisines || [])[0] || country,
  mealType,
  image:          raw.image || "",
  readyInMinutes: raw.readyInMinutes || null,
  servings:       raw.servings || 2,
  difficulty:     parseDifficulty(raw.readyInMinutes),
  ingredients:    parseIngredients(raw.extendedIngredients),
  steps:          parseSteps(raw.analyzedInstructions),
  tips:           extractTips(raw),
  tags:           [
    ...(raw.dishTypes || []),
    ...(raw.cuisines  || []),
    ...(raw.diets     || []),
  ],
  source:         "spoonacular",
  spoonacularId:  raw.id || null,
});

/**
 * parseGroqRecipe — validates and normalises a Groq-generated recipe.
 * The Groq prompt already targets our schema, so this is mainly defensive.
 *
 * @param {Object} raw     Parsed JSON from Groq
 * @param {string} country
 * @param {string} mealType
 * @returns {Object}       Normalised recipe
 */
const parseGroqRecipe = (raw, country, mealType) => ({
  title:          raw.title          || "Traditional Dish",
  description:    raw.description    || "",
  country:        raw.country        || country,
  cuisine:        raw.cuisine        || country,
  mealType:       raw.mealType       || mealType,
  image:          raw.image          || "",
  readyInMinutes: raw.readyInMinutes || null,
  servings:       raw.servings       || 2,
  difficulty:     raw.difficulty     || parseDifficulty(raw.readyInMinutes),
  ingredients:    (raw.ingredients   || []).map((ing) => ({
    name:     ing.name     || "Ingredient",
    amount:   ing.amount   ?? null,
    unit:     ing.unit     || "",
    original: ing.original || `${ing.amount ?? ""} ${ing.unit || ""} ${ing.name || ""}`.trim(),
  })),
  steps:          (raw.steps || []).map((s, i) => ({
    number:      s.number      || i + 1,
    instruction: s.instruction || s.step || "",
  })),
  tips:           raw.tips || [],
  tags:           raw.tags || [country.toLowerCase(), "traditional"],
  source:         "groq",
  spoonacularId:  null,
});

/**
 * validateParsedRecipe — ensures the recipe has the minimum required fields.
 * Throws if the recipe is unusable.
 *
 * @param {Object} recipe
 */
const validateParsedRecipe = (recipe) => {
  if (!recipe.title) throw new Error("Recipe has no title.");
  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    throw new Error("Recipe has no ingredients.");
  }
  if (!recipe.steps || recipe.steps.length === 0) {
    throw new Error("Recipe has no steps.");
  }
};

module.exports = {
  parseSpoonacularRecipe,
  parseGroqRecipe,
  validateParsedRecipe,
};