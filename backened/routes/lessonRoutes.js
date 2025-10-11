const express = require("express");
const {
  addLesson,
  getLesson,
  deleteLesson,
} = require("../controllers/lessonController");
const checkJwt = require("../middlewares/authMiddleware");
const attachUser = require("../middlewares/attachUser");

const router = express.Router();

// 🟢 Protected routes
router.post("/:moduleId", checkJwt, attachUser, addLesson); // Add lesson to a module
router.delete("/:lessonId", checkJwt, attachUser, deleteLesson); // Delete lesson

// 🔓 Public route
router.get("/:lessonId", getLesson); // Get lesson details

module.exports = router;
