const Module = require("../models/Module");
const Course = require("../models/course");
const Lesson = require("../models/Lesson");

exports.addModule = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, description = "" } = req.body;
    if (!title)
      return res.status(400).json({ message: "Module title required" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const mod = new Module({
      title,
      description,
      course: course._id,
      order: course.modules.length,
    });
    await mod.save();

    course.modules.push(mod._id);
    await course.save();

    res.status(201).json(mod);
  } catch (err) {
    next(err);
  }
};

exports.deleteModule = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const mod = await Module.findById(moduleId);
    if (!mod) return res.status(404).json({ message: "Module not found" });

    // auth check could go here (verify course creator)
    await mod.remove(); // triggers pre remove to delete lessons & remove from course
    res.json({ message: "Module deleted" });
  } catch (err) {
    next(err);
  }
};
