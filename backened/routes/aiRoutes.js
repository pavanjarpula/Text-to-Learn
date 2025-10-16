// backend/routes/aiRoutes.js
const express = require("express");
const {
  generateCourseHandler,
  generateLessonHandler,
} = require("../controllers/aiController");
const checkJwt = require("../middlewares/authMiddleware");
const attachUser = require("../middlewares/attachUser");

const router = express.Router();

// Protected
router.post("/generate-course", generateCourseHandler);
router.post("/generate-lesson", generateLessonHandler);

module.exports = router;
