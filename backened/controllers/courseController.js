const Course = require("../models/course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");
const User = require("../models/user");

/**
 * Create a new course with optional modules & lessons
 */
exports.createCourse = async (req, res, next) => {
  try {
    const { title, description = "", tags = [], modules = [] } = req.body;
    if (!title) return res.status(400).json({ message: "Title required" });

    const creatorSub = req.user?.sub || req.auth?.payload?.sub;
    if (!creatorSub) return res.status(401).json({ message: "Unauthorized" });

    const course = await Course.create({
      title,
      description,
      creator: creatorSub,
      tags,
    });

    // Add course to user
    await User.updateOne(
      { auth0Sub: creatorSub },
      { $addToSet: { courses: course._id } }
    );

    // Create modules and lessons if provided
    for (const [modIndex, modData] of (modules || []).entries()) {
      const mod = await Module.create({
        title: modData.title,
        course: course._id,
        order: modIndex,
      });
      course.modules.push(mod._id);

      const lessons = (modData.lessons || []).map(
        (lessonData, lessonIndex) => ({
          title: lessonData.title || `Lesson ${lessonIndex + 1}`,
          objectives: lessonData.objectives || [],
          content: lessonData.content || [],
          module: mod._id,
          order: lessonIndex,
        })
      );
      const createdLessons = await Lesson.insertMany(lessons);
      mod.lessons = createdLessons.map((l) => l._id);
      await mod.save();
    }

    await course.save();
    return res.status(201).json(course);
  } catch (err) {
    console.error("Create Course Error:", err);
    next(err);
  }
};

/**
 * Get a single course with fully populated modules and lessons (including content)
 */
exports.getCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate({
        path: "modules",
        options: { sort: { order: 1 } },
        populate: {
          path: "lessons",
          options: { sort: { order: 1 } },
          select: "title objectives content order", // Make sure content is included
        },
      })
      .lean(); // lean improves performance and returns plain JSON

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course);
  } catch (err) {
    console.error("Get Course Error:", err);
    next(err);
  }
};

/**
 * Get all courses of the logged-in user
 */
exports.getUserCourses = async (req, res, next) => {
  try {
    const userId = req.user?.sub || req.auth?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const courses = await Course.find({ creator: userId })
      .select("title description tags createdAt updatedAt")
      .lean();

    res.json(courses);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all public courses
 */
exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find()
      .select("title description tags createdAt updatedAt")
      .lean();

    res.json(courses);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a course
 */
exports.deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const userId = req.user?.sub || req.auth?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (course.creator !== userId)
      return res.status(403).json({ message: "Not authorized" });

    await course.deleteOne();
    res.json({ message: "Course deleted" });
  } catch (err) {
    next(err);
  }
};
