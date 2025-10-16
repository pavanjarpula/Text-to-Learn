const Course = require("../models/course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");
const { generateCourse, generateLesson } = require("../services/aiService");
const { validateCourse, validateLesson } = require("../services/validator");

// ✅ Generate a full course
async function generateCourseHandler(req, res, next) {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ message: "Topic required" });

    console.log("🧠 Generating course for topic:", topic);
    const data = await generateCourse(topic);

    if (!data || !validateCourse(data))
      return res.status(422).json({ message: "Invalid course JSON" });

    const creatorSub = req.user?.sub || req.auth?.payload?.sub || "anonymous";

    const course = await Course.create({
      title: data.title,
      description: data.description,
      tags: data.tags || [],
      creator: creatorSub,
    });

    // Generate modules concurrently
    const modulePromises = data.modules.map(async (m, mi) => {
      const mod = await Module.create({
        title: m.title,
        course: course._id,
        order: mi,
      });

      // Generate lessons concurrently
      const lessonPromises = m.lessons.map(async (lessonTitle, li) => {
        const lessonData = await generateLesson(
          data.title,
          m.title,
          lessonTitle
        );

        const lesson = await Lesson.create({
          title: lessonData?.title || lessonTitle,
          objectives: lessonData?.objectives || [],
          content: lessonData?.content || [
            { type: "paragraph", text: `Content for ${lessonTitle}` },
          ],
          module: mod._id,
          order: li,
        });

        return lesson;
      });

      const lessons = await Promise.all(lessonPromises);
      mod.lessons = lessons.map((l) => l._id);
      await mod.save();
      return mod;
    });

    const modules = await Promise.all(modulePromises);
    course.modules = modules.map((m) => m._id);
    await course.save();

    // Populate modules → lessons for frontend
    const populatedCourse = await Course.findById(course._id).populate({
      path: "modules",
      populate: { path: "lessons" },
    });

    console.log("✅ Course generated successfully:", populatedCourse._id);
    res.status(201).json(populatedCourse);
  } catch (err) {
    console.error("🔥 Error in generateCourseHandler:", err);
    next(err);
  }
}

// ✅ Generate a single lesson
async function generateLessonHandler(req, res, next) {
  try {
    const { courseId, moduleId, lessonTitle } = req.body;
    if (!courseId || !moduleId || !lessonTitle)
      return res.status(400).json({ message: "Missing required fields" });

    const course = await Course.findById(courseId);
    const mod = await Module.findById(moduleId);
    if (!course || !mod)
      return res.status(404).json({ message: "Course or module not found" });

    const lessonData = await generateLesson(
      course.title,
      mod.title,
      lessonTitle
    );

    const lesson = await Lesson.create({
      title: lessonData?.title || lessonTitle,
      objectives: lessonData?.objectives || [],
      content: lessonData?.content || [
        { type: "paragraph", text: `Content for ${lessonTitle}` },
      ],
      module: mod._id,
      order: mod.lessons.length,
    });

    mod.lessons.push(lesson._id);
    await mod.save();

    console.log("✅ Lesson created successfully:", lesson._id);
    res.status(201).json(lesson);
  } catch (err) {
    console.error("🔥 Error in generateLessonHandler:", err);
    next(err);
  }
}

module.exports = {
  generateCourseHandler,
  generateLessonHandler,
};
