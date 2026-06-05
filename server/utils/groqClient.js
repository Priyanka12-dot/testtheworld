/**
 * utils/groqClient.js
 * Fallback recipe generator using Groq AI (LLaMA 3).
 * Called when Spoonacular returns no results for a country+mealType combo.
 * Returns a structured recipe JSON that matches our recipeParser schema.
 */

const Groq = require("groq-sdk");

let groq;

const getGroqClient = () => {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
};

// ── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert culinary historian and chef specialising in authentic, 
traditional recipes from around the world. When given a country and meal type, you generate 
ONE authentic, traditional recipe from that country's culinary heritage.

You MUST respond with valid JSON only — no markdown fences, no preamble, no explanations.
The JSON must match this exact structure:

{
  "title": "Recipe Name (Local Name in Parentheses if Different)",
  "description": "2-3 sentence cultural context and description of the dish.",
  "country": "Country Name",
  "cuisine": "Cuisine Label",
  "mealType": "breakfast | lunch | dinner",
  "readyInMinutes": 30,
  "servings": 4,
  "difficulty": "easy | medium | hard",
  "image": "",
  "ingredients": [
    { "name": "ingredient name", "amount": 1, "unit": "cup", "original": "1 cup ingredient name" }
  ],
  "steps": [
    { "number": 1, "instruction": "Detailed step instruction." }
  ],
  "tips": [
    "A cultural or cooking tip about this dish."
  ],
  "tags": ["traditional", "authentic", "country-name"]
}

Rules:
- Provide at least 5 ingredients and at least 5 steps.
- Instructions must be detailed and actionable.
- Include 2-3 tips with cultural context.
- Difficulty: easy (< 30 min, few steps), medium (30-60 min), hard (> 60 min or complex technique).
- The recipe must be genuinely traditional and authentic to that country.
- RESPOND WITH JSON ONLY. No markdown, no backticks, no extra text.`;

/**
 * generateGroqRecipe — prompts Groq LLaMA 3 to produce an authentic recipe.
 *
 * @param {string} country
 * @param {string} mealType  'breakfast' | 'lunch' | 'dinner'
 * @returns {Promise<Object>}  Parsed recipe object
 */
const generateGroqRecipe = async (country, mealType) => {
  const client = getGroqClient();

  const userPrompt = `Generate one authentic traditional ${mealType} recipe from ${country}. 
Make it genuinely traditional — a dish locals actually eat, not a tourist-facing adaptation.`;

  const completion = await client.chat.completions.create({
    model:      "llama3-70b-8192",   // Best quality model on Groq
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user",   content: userPrompt },
    ],
    temperature: 0.7,   // Some creativity but mostly factual
    max_tokens:  2048,
  });

  const rawText = completion.choices[0]?.message?.content;

  if (!rawText) {
    throw new Error("Groq returned an empty response.");
  }

  // Strip any accidental markdown fences before parsing
  const cleaned = rawText
    .replace(/^```(?:json)?\n?/m, "")
    .replace(/\n?```$/m, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (parseErr) {
    console.error("❌  Groq response was not valid JSON:", cleaned.slice(0, 300));
    throw new Error(`Failed to parse Groq response as JSON: ${parseErr.message}`);
  }

  // Ensure source is tagged
  parsed.source = "groq";

  return parsed;
};

module.exports = { generateGroqRecipe };