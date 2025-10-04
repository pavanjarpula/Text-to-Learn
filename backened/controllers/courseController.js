const Course = require("../models/course");
const courseService = require("../services/courseService");

const generateCourse = async (req, res) => {
  try {
    const { prompt } = req.body;
    const creatorId = req.user?.sub; // Auth0 user ID

    // Generate course via service and associate with the logged-in user
    const savedCourse = await courseService.generateAndSaveCourse(
      prompt,
      creatorId
    );

    res.status(201).json(savedCourse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getUserCourses = async (req, res) => {
  try {
    const userId = req.user?.sub;
    const courses = await courseService.getCoursesByCreator(userId);
    res.status(200).json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  generateCourse,
  getUserCourses,
  getCourseById,
};
