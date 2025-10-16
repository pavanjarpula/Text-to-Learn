const Lesson = require("../models/Lesson");
const Module = require("../models/Module");

/**
 * Add a lesson to a module
 */
exports.addLesson = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const { title, objectives = [], content = [] } = req.body;
    if (!title)
      return res.status(400).json({ message: "Lesson title required" });

    const mod = await Module.findById(moduleId);
    if (!mod) return res.status(404).json({ message: "Module not found" });

    // Optional: Check if user is authorized to add lesson to this module
    // const userId = req.user?.sub;
    // if (mod.creator !== userId) return res.status(403).json({ message: "Not authorized" });

    const lesson = new Lesson({
      title,
      objectives,
      content,
      module: mod._id,
      order: mod.lessons.length,
    });

    await lesson.save();

    // Add lesson to module's lessons array
    mod.lessons.push(lesson._id);
    await mod.save();

    res.status(201).json(lesson);
  } catch (err) {
    next(err);
  }
};

/**
 * Get lesson by ID
 */
exports.getLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;

    // 🏆 CRITICAL FIX: Populate the module and select the course field from it
    const lesson = await Lesson.findById(lessonId)
      .select("title objectives content module isEnriched")
      .populate({
        path: "module",
        select: "course", // We only need the course ID from the module
      })
      .lean();

    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    // The 'content' array (which is an array of mixed types) will be included in the response.
    // The lesson object now looks like: {..., module: { _id: 'moduleId', course: 'courseId' }}
    res.json(lesson);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a lesson by ID
 */
exports.deleteLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    // Optional: Authorization check
    // const userId = req.user?.sub;
    // if (lesson.creator !== userId) return res.status(403).json({ message: "Not authorized" });

    await Lesson.findByIdAndDelete(lessonId);

    // Also remove lesson from its parent module
    await Module.updateOne(
      { _id: lesson.module },
      { $pull: { lessons: lesson._id } }
    );

    res.json({ message: "Lesson deleted" });
  } catch (err) {
    next(err);
  }
};
