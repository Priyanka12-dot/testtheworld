/**
 * server.js
 * Entry point for the Taste the World API server.
 *
 * Boot sequence:
 *   1. Load .env
 *   2. Validate environment variables
 *   3. Connect to MongoDB
 *   4. Configure Express (CORS, JSON, logging, rate-limiting)
 *   5. Mount routes
 *   6. Register global error handler
 *   7. Start listening
 */

require("dotenv").config();

const { validateEnv }            = require("./config/env");
const connectDB                  = require("./config/db");
const { globalErrorMiddleware }  = require("./utils/errorHandler");

const express    = require("express");
const cors       = require("cors");
const morgan     = require("morgan");
const rateLimit  = require("express-rate-limit");

// ── Routes ────────────────────────────────────────────────────────────────────
const authRoutes   = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const userRoutes   = require("./routes/userRoutes");

// ── 1. Validate env ───────────────────────────────────────────────────────────
validateEnv();

// ── 2. Connect to MongoDB ─────────────────────────────────────────────────────
connectDB();

// ── 3. Create Express app ─────────────────────────────────────────────────────
const app = express();

// ── 4. Middleware ─────────────────────────────────────────────────────────────

// CORS — allow only the configured client origin
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    methods:            ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders:     ["Content-Type", "Authorization"],
    credentials:        true,
    optionsSuccessStatus: 200,
  })
);

// Parse JSON bodies (limit 10 MB for safety)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// HTTP request logging (skip in test env)
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

// Global rate limiter — defence against DoS
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      500,             // 500 requests per IP per window
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again later.",
  },
});
app.use(globalLimiter);

// ── 5. Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth",    authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/users",   userRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "🌍  Taste the World API is healthy!",
    env:     process.env.NODE_ENV,
    time:    new Date().toISOString(),
  });
});

// ── Root ──────────────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Taste the World API 🍜🌮🍣",
    version: "1.0.0",
    docs: {
      auth:    "/api/auth",
      recipes: "/api/recipes",
      users:   "/api/users",
      health:  "/health",
    },
  });
});

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found. Check the API documentation.",
  });
});

// ── 6. Global error middleware — MUST be last ─────────────────────────────────
app.use(globalErrorMiddleware);

// ── 7. Start server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  🌍  Taste the World API`);
  console.log(`  🚀  Running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  console.log(`  🔗  http://localhost:${PORT}`);
  console.log("═══════════════════════════════════════════════════════");
});

module.exports = app; // Export for testing