const express = require("express");
const {
  createCourse,
  getCourse,
  getUserCourses,
  getAllCourses,
  deleteCourse,
} = require("../controllers/courseController");

const {
  generateCourseHandler,
  generateLessonHandler,
} = require("../controllers/aiController");

const checkJwt = require("../middlewares/authMiddleware"); // default export
const attachUser = require("../middlewares/attachUser");

const router = express.Router();

// 🟢 Protected routes first (specific paths before params)
router.get("/my", checkJwt, attachUser, getUserCourses); // ✅ must come before /:id
router.post("/", checkJwt, attachUser, createCourse);
router.delete("/:id", checkJwt, attachUser, deleteCourse);

// 🧠 AI Course generation routes (protected)
router.post("/generate", checkJwt, attachUser, generateCourseHandler);
router.post("/generate-lesson", checkJwt, attachUser, generateLessonHandler);

// 🌍 Public routes
router.get("/", getAllCourses);
router.get("/:id", getCourse); // Returns course with modules populated if you want

module.exports = router;
