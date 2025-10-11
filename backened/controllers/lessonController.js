const Lesson = require("../models/Lesson");
const Module = require("../models/Module");

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

    await lesson.save(); // post save will push to module.lessons
    res.status(201).json(lesson);
  } catch (err) {
    next(err);
  }
};

exports.getLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId).lean();
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.json(lesson);
  } catch (err) {
    next(err);
  }
};

exports.deleteLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    await lesson.remove();
    res.json({ message: "Lesson deleted" });
  } catch (err) {
    next(err);
  }
};
