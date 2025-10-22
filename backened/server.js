const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

// Load environment variables BEFORE anything else
dotenv.config();

// Import Routes
const courseRoutes = require("./routes/courseRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// ==================== MIDDLEWARE ====================

// CORS Configuration
app.use(
  cors({
    origin: [
      process.env.CLIENT_ORIGIN || "http://localhost:3000",
      "http://localhost:5173", // Vite default
      "http://localhost:3000", // Create React App default
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Parse JSON requests
app.use(express.json());

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// ==================== HEALTH CHECK ====================

app.get("/", (req, res) => {
  res.json({
    message: "🚀 Text-to-Learn Backend API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// ==================== API ROUTES ====================

// Mount all API routes
app.use("/api/ai", aiRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/lessons", lessonRoutes);

// ==================== DEBUG INFO ====================

console.log("📋 Configuration loaded:");
console.log("  - Auth0 Domain:", process.env.AUTH0_DOMAIN || "NOT SET");
console.log("  - Auth0 Audience:", process.env.AUTH0_AUDIENCE || "NOT SET");
console.log("  - MongoDB:", process.env.MONGO_URI ? "CONFIGURED" : "NOT SET");
console.log(
  "  - Gemini API:",
  process.env.GEMINI_API_KEY ? "CONFIGURED" : "NOT SET"
);
console.log("  - Client Origins: Configured");

// ==================== ERROR HANDLING ====================

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════════╗
    ║  ✅ Backend Server Running             ║
    ║  🌐 Port: ${PORT}                      ║
    ║  📍 URL: http://localhost:${PORT}      ║
    ║  🔧 API: http://localhost:${PORT}/api  ║
    ╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

module.exports = app;
