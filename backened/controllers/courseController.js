const Course = require("../models/course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");
const User = require("../models/user");

/**
 * Create a new course (optionally with modules/lessons arrays)
 */
exports.createCourse = async (req, res, next) => {
  try {
    const { title, description = "", tags = [], modules = [] } = req.body;
    if (!title) return res.status(400).json({ message: "Title required" });

    // ✅ Ensure creator is taken from JWT
    const creatorSub = req.user?.sub || req.auth?.payload?.sub;
    if (!creatorSub) return res.status(401).json({ message: "Unauthorized" });

    const course = new Course({
      title,
      description,
      creator: creatorSub,
      tags,
    });
    await course.save();

    // Attach to user document if storing users
    await User.updateOne(
      { auth0Sub: creatorSub },
      { $addToSet: { courses: course._id } }
    );

    // Create modules and lessons if provided
    for (const [index, modData] of (modules || []).entries()) {
      const mod = new Module({
        title: modData.title,
        course: course._id,
        order: index,
      });
      await mod.save();
      course.modules.push(mod._id);

      for (const [li, lessonData] of (modData.lessons || []).entries()) {
        const lesson = new Lesson({
          title: lessonData.title || `Lesson ${li + 1}`,
          objectives: lessonData.objectives || [],
          content: lessonData.content || [],
          module: mod._id,
          order: li,
        });
        await lesson.save();
      }
    }

    await course.save();
    return res.status(201).json(course);
  } catch (err) {
    console.error("Create Course Error:", err);
    next(err);
  }
};

/**
 * Get a single course by ID (with modules and lessons)
 */
exports.getCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id)
      .lean()
      .populate({
        path: "modules",
        options: { sort: { order: 1, createdAt: 1 } },
        populate: {
          path: "lessons",
          options: { sort: { order: 1, createdAt: 1 } },
        },
      });

    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all courses for logged-in user
 */
exports.getUserCourses = async (req, res, next) => {
  try {
    const userId = req.user?.sub || req.auth?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const courses = await Course.find({ creator: userId }).select(
      "title description tags createdAt updatedAt"
    );
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all courses (public)
 */
exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().select(
      "title description tags createdAt updatedAt"
    );
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a course by ID
 */
exports.deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const userId = req.user?.sub || req.auth?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Authorization check
    if (course.creator !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Use deleteOne instead of remove
    await course.deleteOne();

    res.json({ message: "Course deleted" });
  } catch (err) {
    next(err);
  }
};
