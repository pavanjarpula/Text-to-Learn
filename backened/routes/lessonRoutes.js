// backend/routes/lessonRoutes.js - UPDATED

const express = require("express");
const {
  addLesson,
  getLesson,
  deleteLesson,
  saveLesson, // 🔧 NEW
  getUserSavedLessons, // 🔧 NEW
} = require("../controllers/lessonController");
const checkJwt = require("../middlewares/authMiddleware");
const attachUser = require("../middlewares/attachUser");

const router = express.Router();

/**
 * 🔧 CRITICAL: SPECIFIC ROUTES BEFORE GENERIC :lessonId ROUTES
 */

// 🟢 Save lesson (protected)
router.post("/save", checkJwt, attachUser, saveLesson);

// 🟢 Get user's saved lessons (protected)
router.get("/user/saved", checkJwt, attachUser, getUserSavedLessons);

/**
 * Generic :lessonId routes AFTER specific routes
 */

// 🟢 Protected routes
router.post("/:moduleId", checkJwt, attachUser, addLesson); // Add lesson to a module
router.delete("/:lessonId", checkJwt, attachUser, deleteLesson); // Delete lesson

// 🔓 Public route
router.get("/:lessonId", getLesson); // Get lesson details

module.exports = router;
