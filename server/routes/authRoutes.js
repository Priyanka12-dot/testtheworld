/**
 * routes/authRoutes.js
 * Authentication endpoints.
 *
 * POST /api/auth/register   — create account
 * POST /api/auth/login      — login, receive JWT
 * GET  /api/auth/me         — get current user (protected)
 * POST /api/auth/logout     — logout hint
 */

const express = require("express");
const router  = express.Router();

const { register, login, getMe, logout } = require("../controllers/authController");
const { protect }                        = require("../middleware/authMiddleware");

// Rate limiting for auth routes — prevent brute-force attacks
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      20,              // Limit each IP to 20 auth requests per window
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders:   false,
});

router.post("/register", authLimiter, register);
router.post("/login",    authLimiter, login);
router.get( "/me",       protect,     getMe);
router.post("/logout",   protect,     logout);

module.exports = router;