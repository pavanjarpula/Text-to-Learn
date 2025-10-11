const express = require("express");
const {
  createCourse,
  getCourse,
  getUserCourses,
  getAllCourses,
  deleteCourse,
} = require("../controllers/courseController");

const checkJwt = require("../middlewares/authMiddleware"); // default export
const attachUser = require("../middlewares/attachUser");

const router = express.Router();

// 🟢 Protected routes first (specific paths before params)
router.get("/my", checkJwt, attachUser, getUserCourses); // ✅ must come before /:id
router.post("/", checkJwt, attachUser, createCourse);
router.delete("/:id", checkJwt, attachUser, deleteCourse);

/*router.delete(
  "/:id",
  (req, res, next) => {
    console.log("INCOMING DELETE HEADERS:", req.headers);
    next();
  },
  checkJwt,
  deleteCourse
);*/

// 🌍 Public routes
router.get("/", getAllCourses);
router.get("/:id", getCourse);

module.exports = router;
