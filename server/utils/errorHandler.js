/**
 * utils/errorHandler.js
 * Centralised error handling utilities.
 *
 * Usage in controllers:
 *   router.get('/route', asyncHandler(myControllerFn));
 */

/**
 * asyncHandler — wraps an async controller function and forwards
 * any thrown errors to Express's next() error middleware.
 *
 * @param {Function} fn  Async controller function (req, res, next)
 * @returns {Function}   Express-compatible middleware
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * AppError — custom error class that carries an HTTP status code.
 * Throw this inside controllers for predictable error responses.
 *
 * @example
 *   throw new AppError('Country not found', 404);
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Operational errors = safe to expose to client
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * globalErrorMiddleware — must be registered LAST in server.js.
 * Handles AppErrors, Mongoose validation errors, JWT errors, and unknowns.
 */
const globalErrorMiddleware = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || "Internal Server Error";

  // ── Mongoose: duplicate key (e.g. duplicate email / username) ─────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }

  // ── Mongoose: validation error ────────────────────────────────────────────
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(". ");
  }

  // ── Mongoose: bad ObjectId ────────────────────────────────────────────────
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
  }

  // ── JWT errors ────────────────────────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired.";
  }

  // ── Log unexpected server errors ──────────────────────────────────────────
  if (statusCode === 500) {
    console.error("🔴  Unhandled error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { asyncHandler, AppError, globalErrorMiddleware };