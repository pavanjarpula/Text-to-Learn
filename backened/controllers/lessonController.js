// backend/controllers/lessonController.js - FIXED

const Lesson = require("../models/Lesson");
const Module = require("../models/Module");

/**
 * 🔧 NEW: POST /api/lessons/save
 * Save a lesson from course to user's collection
 * Called when student clicks "Save" button in lesson renderer
 */
exports.saveLesson = async (req, res, next) => {
  try {
    const {
      title,
      objectives = [],
      content = [],
      courseTitle,
      moduleName,
    } = req.body;
    const userId = req.user?.sub || req.auth?.payload?.sub;

    console.log("💾 SAVE LESSON - New Lesson Document:", {
      title,
      courseTitle,
      moduleName,
      userId,
      contentBlocks: content?.length || 0,
    });

    if (!title) {
      return res.status(400).json({ message: "Lesson title is required" });
    }

    // Create a NEW independent lesson (not tied to module in course)
    const lesson = new Lesson({
      title,
      objectives: objectives || [],
      content: content || [],
      module: null, // 🔧 CRITICAL: null = saved lesson, not in any module
      order: 0,
      isEnriched: false,
    });

    // Add metadata for saved lessons
    lesson.savedBy = userId;
    lesson.isSaved = true;
    lesson.courseTitle = courseTitle;
    lesson.moduleName = moduleName;

    const saved = await lesson.save();

    console.log("✅ Lesson saved successfully:", {
      lessonId: saved._id,
      title: saved.title,
    });

    res.status(201).json({
      _id: saved._id,
      title: saved.title,
      objectives: saved.objectives,
      content: saved.content,
      courseTitle: saved.courseTitle,
      moduleName: saved.moduleName,
      createdAt: saved.createdAt,
    });
  } catch (err) {
    console.error("❌ Error saving lesson:", err);
    res.status(500).json({
      message: "Failed to save lesson",
      error: err.message,
    });
  }
};

/**
 * GET /api/lessons/user/saved
 * Fetch all lessons saved by current user
 */
exports.getUserSavedLessons = async (req, res, next) => {
  try {
    const userId = req.user?.sub || req.auth?.payload?.sub;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("📚 Fetching saved lessons for user:", userId);

    const savedLessons = await Lesson.find({
      savedBy: userId,
      isSaved: true,
    })
      .sort({ createdAt: -1 })
      .select("title objectives content courseTitle moduleName createdAt");

    console.log(`✅ Found ${savedLessons.length} saved lessons`);

    res.json(savedLessons);
  } catch (err) {
    console.error("❌ Error fetching saved lessons:", err);
    res.status(500).json({
      message: "Failed to fetch saved lessons",
      error: err.message,
    });
  }
};

/**
 * 🟢 EXISTING: Add lesson to a module
 */
exports.addLesson = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const { title, objectives = [], content = [] } = req.body;
    if (!title)
      return res.status(400).json({ message: "Lesson title required" });

    const mod = await Module.findById(moduleId);
    if (!mod) return res.status(404).json({ message: "Module not found" });

    const lesson = new Lesson({
      title,
      objectives,
      content,
      module: mod._id,
      order: mod.lessons.length,
    });

    await lesson.save();

    mod.lessons.push(lesson._id);
    await mod.save();

    res.status(201).json(lesson);
  } catch (err) {
    next(err);
  }
};

/**
 * 🟢 EXISTING: Get lesson by ID
 */
exports.getLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;

    console.log("📖 Fetching lesson:", lessonId);

    const lesson = await Lesson.findById(lessonId)
      .select(
        "title objectives content module isEnriched courseTitle moduleName"
      )
      .populate({
        path: "module",
        select: "title course",
      })
      .lean();

    if (!lesson) {
      console.warn("❌ Lesson not found:", lessonId);
      return res.status(404).json({ message: "Lesson not found" });
    }

    console.log("✅ Lesson retrieved:", {
      title: lesson.title,
      contentBlocks: lesson.content?.length || 0,
    });

    res.json(lesson);
  } catch (err) {
    console.error("❌ Error fetching lesson:", err);
    res.status(500).json({
      message: "Failed to fetch lesson",
      error: err.message,
    });
  }
};

/**
 * 🟢 EXISTING: Delete lesson
 */
exports.deleteLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    await Lesson.findByIdAndDelete(lessonId);

    // Remove from module if it exists
    if (lesson.module) {
      await Module.updateOne(
        { _id: lesson.module },
        { $pull: { lessons: lesson._id } }
      );
    }

    res.json({ message: "Lesson deleted" });
  } catch (err) {
    next(err);
  }
};
