/**
 * config/env.js
 * Validates that all required environment variables are present
 * before the server starts. Fails fast with a clear error message.
 */

const REQUIRED_ENV_VARS = [
  "MONGODB_URI",
  "JWT_SECRET",
  "SPOONACULAR_API_KEY",
  "GROQ_API_KEY",
];

const validateEnv = () => {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("═══════════════════════════════════════════════════");
    console.error("  ❌  Missing required environment variables:");
    missing.forEach((key) => console.error(`      - ${key}`));
    console.error("  Please check your .env file and try again.");
    console.error("═══════════════════════════════════════════════════");
    process.exit(1);
  }

  console.log("✅  All required environment variables are present.");
};

module.exports = { validateEnv };