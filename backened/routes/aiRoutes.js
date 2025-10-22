/* ==================== FILE 2: backend/routes/aiRoutes.js (FIXED) ==================== */

const express = require("express");
const {
  generateCourseHandler,
  generateLessonHandler,
} = require("../controllers/aiController");

// Optional: Require auth middleware if you want to protect these routes
// const checkJwt = require("../middlewares/authMiddleware");
// const attachUser = require("../middlewares/attachUser");

const router = express.Router();

// Routes - Currently public (can be protected if needed)
// To protect: add checkJwt and attachUser middleware

/**
 * POST /api/ai/generate-course
 * Generate a complete course from a topic prompt
 * Body: { topic: "string" }
 */
router.post("/generate-course", generateCourseHandler);

/**
 * POST /api/ai/generate-lesson
 * Generate a specific lesson
 * Body: { courseTitle: "string", moduleTitle: "string", lessonTitle: "string" }
 */
router.post("/generate-lesson", generateLessonHandler);

module.exports = router;
