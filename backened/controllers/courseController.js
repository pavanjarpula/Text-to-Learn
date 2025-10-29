// backend/controllers/courseController.js - UPDATED WITH FIXES

const Course = require("../models/course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");
const User = require("../models/user");
const { validateLesson, sanitizeLesson } = require("../services/validator");

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
 * 🔧 UPDATED: Includes validation logging
 */
exports.getCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    console.log("📖 Fetching course:", id);

    const course = await Course.findById(id)
      .populate({
        path: "modules",
        options: { sort: { order: 1 } },
        populate: {
          path: "lessons",
          options: { sort: { order: 1 } },
          select: "title objectives content order",
        },
      })
      .lean();

    if (!course) {
      console.warn("❌ Course not found:", id);
      return res.status(404).json({ message: "Course not found" });
    }

    // 🔍 Debug: Log content structure
    console.log("📊 Course content structure:");
    course.modules?.forEach((mod, modIdx) => {
      mod.lessons?.forEach((lesson, lessonIdx) => {
        const contentStats = {
          total: lesson.content?.length || 0,
          mcq: lesson.content?.filter((b) => b.type === "mcq").length || 0,
          code: lesson.content?.filter((b) => b.type === "code").length || 0,
          video: lesson.content?.filter((b) => b.type === "video").length || 0,
        };
        console.log(
          `  Module ${modIdx} → Lesson ${lessonIdx} (${lesson.title}):`,
          contentStats
        );
      });
    });

    res.json(course);
  } catch (err) {
    console.error("❌ Get Course Error:", err);
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

    console.log("📚 Fetching user courses for:", userId);

    const courses = await Course.find({ creator: userId })
      .select("title description tags createdAt updatedAt")
      .lean();

    console.log(`✅ Found ${courses.length} courses`);
    res.json(courses);
  } catch (err) {
    console.error("❌ Get User Courses Error:", err);
    next(err);
  }
};

/**
 * Get all public courses
 */
exports.getAllCourses = async (req, res, next) => {
  try {
    console.log("📚 Fetching all public courses");

    const courses = await Course.find()
      .select("title description tags createdAt updatedAt")
      .lean();

    console.log(`✅ Found ${courses.length} public courses`);
    res.json(courses);
  } catch (err) {
    console.error("❌ Get All Courses Error:", err);
    next(err);
  }
};

/**
 * Delete a course
 */
exports.deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    console.log("🗑️  Deleting course:", id);

    const course = await Course.findById(id);
    if (!course) {
      console.warn("❌ Course not found:", id);
      return res.status(404).json({ message: "Course not found" });
    }

    const userId = req.user?.sub || req.auth?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (course.creator !== userId) {
      console.warn("❌ Unauthorized delete attempt for course:", id);
      return res.status(403).json({ message: "Not authorized" });
    }

    await course.deleteOne();
    console.log("✅ Course deleted:", id);
    res.json({ message: "Course deleted" });
  } catch (err) {
    console.error("❌ Delete Course Error:", err);
    next(err);
  }
};

/**
 * 🆕 LEGACY: Update a course (optional)
 */
exports.updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, tags } = req.body;

    const course = await Course.findByIdAndUpdate(
      id,
      { title, description, tags },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    console.log("✅ Course updated:", id);
    res.json(course);
  } catch (err) {
    console.error("❌ Update Course Error:", err);
    next(err);
  }
};
