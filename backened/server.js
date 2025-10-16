// backend/server.js
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
const aiRoutes = require("./routes/aiRoutes"); // ✅ New AI generation routes

// Connect to MongoDB
connectDB();

const app = express();

// ✅ Middleware setup
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", // Vite default port
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON requests
app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.json({ message: "🚀 Text-to-Learn Backend API is running" });
});

// ✅ API Routes
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/ai", aiRoutes); // 🧠 AI endpoints (generate-course, generate-lesson)

// Debug info (safe to remove later)
console.log("AUTH0_DOMAIN:", process.env.AUTH0_DOMAIN);
console.log("AUTH0_AUDIENCE:", process.env.AUTH0_AUDIENCE);

// ✅ Error handling middleware
app.use(notFound);
app.use(errorHandler);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at: http://localhost:${PORT}`);
});
