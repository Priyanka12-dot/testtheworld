/**
 * config/db.js
 * Establishes and manages the MongoDB Atlas connection via Mongoose.
 * Uses retry logic for resilience on initial connection failure.
 */

const mongoose = require("mongoose");

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

const connectDB = async (retries = MAX_RETRIES) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options prevent deprecation warnings
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
      socketTimeoutMS: 45000,          // Close sockets after 45s
    });

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);

    // Graceful shutdown — close connection when process ends
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🔌  MongoDB connection closed (process termination).");
      process.exit(0);
    });
  } catch (error) {
    console.error(`❌  MongoDB connection error: ${error.message}`);

    if (retries > 0) {
      console.log(`🔄  Retrying in ${RETRY_DELAY_MS / 1000}s... (${retries} attempt(s) left)`);
      await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      return connectDB(retries - 1);
    }

    console.error("🚫  Could not connect to MongoDB after multiple retries. Exiting.");
    process.exit(1);
  }
};

module.exports = connectDB;