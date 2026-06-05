/**
 * controllers/authController.js
 * Handles user registration and login.
 * Issues signed JWT tokens on success.
 */

const jwt  = require("jsonwebtoken");
const User = require("../models/User");
const { asyncHandler, AppError } = require("../utils/errorHandler");

// ── Helper: sign a JWT ────────────────────────────────────────────────────────
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ── Helper: build the response payload ───────────────────────────────────────
const sendAuthResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id:          user._id,
      username:    user.username,
      email:       user.email,
      savedRecipes: user.savedRecipes,
      preferences: user.preferences,
      createdAt:   user.createdAt,
    },
  });
};

// ── POST /api/auth/register ───────────────────────────────────────────────────
/**
 * register — creates a new user account.
 * Body: { username, email, password }
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Basic field presence check
  if (!username || !email || !password) {
    throw new AppError("username, email, and password are all required.", 400);
  }

  // Password strength: min 6 chars
  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters long.", 400);
  }

  // Check for duplicates (Mongoose unique index also guards this, but we give a nicer message)
  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username }],
  });

  if (existingUser) {
    const field = existingUser.email === email.toLowerCase() ? "Email" : "Username";
    throw new AppError(`${field} is already taken.`, 409);
  }

  // Create user — the pre-save hook will hash the password
  const user = await User.create({
    username,
    email,
    password_hash: password, // The model hashes this before saving
  });

  sendAuthResponse(user, 201, res);
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
/**
 * login — authenticates a user by email + password.
 * Body: { email, password }
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required.", 400);
  }

  // Include password_hash explicitly since it's excluded by default
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password_hash");

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError("Invalid email or password.", 401);
  }

  sendAuthResponse(user, 200, res);
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
/**
 * getMe — returns the authenticated user's profile.
 * Requires: protect middleware
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user is already attached by the protect middleware
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
/**
 * logout — client-side logout hint.
 * JWTs are stateless, so true invalidation requires a token blacklist (Redis).
 * For a hackathon, we simply tell the client to discard the token.
 */
const logout = asyncHandler(async (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully. Please discard your token on the client.",
  });
});

module.exports = { register, login, getMe, logout };