/**
 * middleware/authMiddleware.js
 * Verifies JWT on protected routes.
 * Attaches decoded user payload to req.user.
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * protect — must be used on any route that requires a logged-in user.
 * Expects: Authorization: Bearer <token>
 */
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized — no token provided.",
    });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id).select("-password_hash");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized — user no longer exists.",
      });
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Not authorized — token has expired.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Not authorized — invalid token.",
    });
  }
};

/**
 * optionalAuth — attaches user if token is valid, but does NOT block the request.
 * Useful for routes that work both authenticated and unauthenticated.
 */
const optionalAuth = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password_hash");
    } catch (_) {
      // Silently ignore invalid tokens for optional auth
      req.user = null;
    }
  }

  next();
};

module.exports = { protect, optionalAuth };