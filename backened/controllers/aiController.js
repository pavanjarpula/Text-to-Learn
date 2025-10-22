const Course = require("../models/course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");
const { generateCourse, generateLesson } = require("../services/aiService");
const { validateCourse, validateLesson } = require("../services/validator");

/**
 * Generate a full course from a topic prompt
 * POST /api/ai/generate-course
 */
async function generateCourseHandler(req, res, next) {
  try {
    const { topic } = req.body;

    // Validate input
    if (!topic || !topic.trim()) {
      return res.status(400).json({
        message: "Topic is required",
        error: "MISSING_TOPIC",
      });
    }

    console.log("🧠 Generating course for topic:", topic);
    const data = await generateCourse(topic.trim());

    // Validate AI response
    if (!data || !validateCourse(data)) {
      return res.status(422).json({
        message: "Failed to generate valid course structure",
        error: "INVALID_COURSE_JSON",
      });
    }

    // Get creator ID from Auth0 token
    const creatorSub = req.user?.sub || req.auth?.payload?.sub || "anonymous";

    // Create course
    const course = await Course.create({
      title: data.title || "Untitled Course",
      description: data.description || "AI-generated course",
      tags: data.tags || [],
      creator: creatorSub,
    });

    console.log("📚 Course created:", course._id);

    // Generate modules concurrently
    const modulePromises = (data.modules || []).map(async (m, mi) => {
      const mod = await Module.create({
        title: m.title || `Module ${mi + 1}`,
        course: course._id,
        order: mi,
      });

      console.log("📖 Module created:", mod._id);

      // Generate lessons concurrently for each module
      const lessonPromises = (m.lessons || []).map(async (lessonTitle, li) => {
        try {
          const lessonData = await generateLesson(
            data.title,
            m.title,
            lessonTitle
          );

          const lesson = await Lesson.create({
            title: lessonData?.title || lessonTitle,
            objectives: lessonData?.objectives || [],
            content: lessonData?.content || [
              { type: "paragraph", text: `Lesson: ${lessonTitle}` },
            ],
            module: mod._id,
            order: li,
          });

          console.log("📝 Lesson created:", lesson._id);
          return lesson;
        } catch (lessonErr) {
          console.error("Error generating lesson:", lessonErr);
          // Create lesson with fallback content
          const lesson = await Lesson.create({
            title: lessonTitle,
            objectives: [],
            content: [{ type: "paragraph", text: `Lesson: ${lessonTitle}` }],
            module: mod._id,
            order: li,
          });
          return lesson;
        }
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

    res.status(201).json({
      success: true,
      message: "Course generated successfully",
      data: populatedCourse,
    });
  } catch (err) {
    console.error("🔥 Error in generateCourseHandler:", err);
    next(err);
  }
}

/**
 * Generate a single lesson
 * POST /api/ai/generate-lesson
 */
async function generateLessonHandler(req, res, next) {
  try {
    const { courseTitle, moduleTitle, lessonTitle } = req.body;

    // Validate input
    if (!courseTitle || !moduleTitle || !lessonTitle) {
      return res.status(400).json({
        message: "courseTitle, moduleTitle, and lessonTitle are required",
        error: "MISSING_FIELDS",
      });
    }

    console.log("🧠 Generating lesson:", lessonTitle);

    const lessonData = await generateLesson(
      courseTitle,
      moduleTitle,
      lessonTitle
    );

    // Validate AI response
    if (!lessonData || !validateLesson(lessonData)) {
      return res.status(422).json({
        message: "Failed to generate valid lesson",
        error: "INVALID_LESSON_JSON",
      });
    }

    console.log("✅ Lesson generated successfully");

    res.status(201).json({
      success: true,
      message: "Lesson generated successfully",
      data: lessonData,
    });
  } catch (err) {
    console.error("🔥 Error in generateLessonHandler:", err);
    next(err);
  }
}

module.exports = {
  generateCourseHandler,
  generateLessonHandler,
};
