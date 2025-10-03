const courseService = require("../services/courseService");

const generateCourse = (req, res) => {
  const { topic } = req.body;
  if (!topic || !topic.trim()) {
    return res.status(400).json({ message: "Topic is required." });
  }
  const course = courseService.generateMockCourse(topic);
  res.json(course);
};

module.exports = { generateCourse };
