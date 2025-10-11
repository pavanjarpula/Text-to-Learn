const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const moduleRoutes = require("./routes/moduleRoutes"); // ✅ Module routes
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS setup to allow frontend origin and Authorization header
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser
app.use(express.json());

// API Routes
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes); // Module routes
app.use("/api/lessons", lessonRoutes); // Lesson routes

console.log("AUTH0_DOMAIN:", process.env.AUTH0_DOMAIN);
console.log("AUTH0_AUDIENCE:", process.env.AUTH0_AUDIENCE);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
