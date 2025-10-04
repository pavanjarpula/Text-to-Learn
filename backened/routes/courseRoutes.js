const express = require("express");
const {
  generateCourse,
  getCourseById,
  getUserCourses,
} = require("../controllers/courseController");
const checkJwt = require("../middlewares/authMiddleware");
const attachUser = require("../middlewares/attachUser");

const router = express.Router();

// Protected routes: require Auth0 login
router.post("/", checkJwt, attachUser, generateCourse); // create/save course
router.get("/my", checkJwt, attachUser, getUserCourses); // fetch logged-in user courses

// Public route: anyone can view
router.get("/:id", getCourseById);

module.exports = router;
