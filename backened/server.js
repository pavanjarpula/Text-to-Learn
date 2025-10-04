const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const courseRoutes = require("./routes/courseRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS setup to allow frontend origin and Authorization header
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000", // your frontend
    allowedHeaders: ["Content-Type", "Authorization"], // allow Auth0 Bearer token
  })
);

// Body parser
app.use(express.json());

// Routes
app.use("/api/courses", courseRoutes);

console.log("AUTH0_DOMAIN:", process.env.AUTH0_DOMAIN);
console.log("AUTH0_AUDIENCE:", process.env.AUTH0_AUDIENCE);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
