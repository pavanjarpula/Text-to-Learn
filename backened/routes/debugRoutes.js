// backend/routes/debugRoutes.js - Add this for testing

const express = require("express");
const router = express.Router();
const Lesson = require("../models/Lesson");
const Course = require("../models/course");

/**
 * GET /api/debug/lesson/:lessonId
 * Check what's actually in the database
 */
router.get("/lesson/:lessonId", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    const analysis = {
      title: lesson.title,
      objectivesCount: lesson.objectives?.length || 0,
      contentBlocksCount: lesson.content?.length || 0,
      contentBlocks: lesson.content?.map((block, idx) => ({
        index: idx,
        type: block.type,
        hasData: {
          question: !!block.question,
          questionLength: block.question?.length || 0,
          options: block.options?.length || 0,
          code: !!block.code,
          codeLength: block.code?.length || 0,
          text: !!block.text,
          textLength: block.text?.length || 0,
        },
        preview:
          block.question?.substring(0, 50) ||
          block.code?.substring(0, 50) ||
          block.text?.substring(0, 50) ||
          "(empty)",
      })),
    };

    res.json(analysis);
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/debug/course/:courseId
 * Check course structure
 */
router.get("/course/:courseId", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate({
      path: "modules",
      populate: { path: "lessons" },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const analysis = {
      courseTitle: course.title,
      modules: course.modules.map((mod) => ({
        title: mod.title,
        lessons: mod.lessons.map((lesson) => ({
          title: lesson.title,
          contentBlocks: lesson.content?.length || 0,
          mcqs: lesson.content?.filter((b) => b.type === "mcq").length || 0,
          codes: lesson.content?.filter((b) => b.type === "code").length || 0,
          firstBlockType: lesson.content?.[0]?.type || "none",
        })),
      })),
    };

    res.json(analysis);
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/debug/lesson/:lessonId/raw
 * Get raw JSON for debugging
 */
router.get("/lesson/:lessonId/raw", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    // Return the full content as-is
    res.json({
      title: lesson.title,
      objectives: lesson.objectives,
      content: lesson.content,
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// 📌 IN YOUR MAIN SERVER FILE (e.g., server.js or app.js), ADD THIS:
// const debugRoutes = require("./routes/debugRoutes");
// app.use("/api/debug", debugRoutes);
