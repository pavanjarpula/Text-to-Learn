// backend/routes/debugRoutes.js - Debug endpoints for course and lesson management

const express = require("express");
const router = express.Router();
const Lesson = require("../models/Lesson");
const Course = require("../models/course");
const Module = require("../models/Module");

// ==================== EXISTING ENDPOINTS ====================

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
 * Check course structure with all modules and lessons
 */
router.get("/course/:courseId", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const analysis = {
      courseTitle: course.title,
      courseId: course._id,
      description: course.description,
      tags: course.tags,
      creator: course.creator,
      modulesCount: course.modules?.length || 0,
      modules:
        course.modules?.map((mod) => ({
          title: mod.title,
          description: mod.description,
          lessonsCount: mod.lessons?.length || 0,
          lessons:
            mod.lessons?.map((lesson) => ({
              title: lesson.title,
              objectivesCount: lesson.objectives?.length || 0,
              contentBlocks: lesson.content?.length || 0,
              mcqs: lesson.content?.filter((b) => b.type === "mcq").length || 0,
              codes:
                lesson.content?.filter((b) => b.type === "code").length || 0,
              firstBlockType: lesson.content?.[0]?.type || "none",
            })) || [],
        })) || [],
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
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

// ==================== NEW: COURSE DEBUGGING ====================

/**
 * 🔧 NEW: GET /api/debug/courses
 * List all courses in database (admin/debug only)
 */
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find().limit(10);

    const analysis = {
      totalCount: await Course.countDocuments(),
      sampleSize: courses.length,
      samples: courses.map((course) => ({
        _id: course._id,
        title: course.title,
        creator: course.creator,
        modulesCount: course.modules?.length || 0,
        totalLessons:
          course.modules?.reduce(
            (sum, m) => sum + (m.lessons?.length || 0),
            0
          ) || 0,
        tags: course.tags || [],
        createdAt: course.createdAt,
      })),
    };

    res.json(analysis);
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🔧 NEW: GET /api/debug/course/:courseId/full
 * Get complete course structure with all nested data
 */
router.get("/course/:courseId/full", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({
      _id: course._id,
      title: course.title,
      description: course.description,
      creator: course.creator,
      tags: course.tags,
      modules: course.modules, // Full nested data
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🔧 NEW: POST /api/debug/test-course
 * Test creating a complete course with modules and lessons
 * Used to verify Course schema and data structure
 */
router.post("/test-course", async (req, res) => {
  try {
    const testCourse = new Course({
      title: "Test Course: Web Development Basics",
      description: "A test course to verify the course schema structure",
      creator: "test-user-" + Date.now(),
      tags: ["web", "development", "test"],
      modules: [
        {
          title: "Module 1: HTML Basics",
          description: "Learn the fundamentals of HTML",
          lessons: [
            {
              title: "What is HTML?",
              objectives: ["Understand HTML purpose", "Learn basic tags"],
              content: [
                {
                  type: "heading",
                  text: "What is HTML?",
                },
                {
                  type: "paragraph",
                  text: "HTML is the standard markup language for creating web pages.",
                },
                {
                  type: "code",
                  language: "html",
                  code: "<h1>Hello World</h1>",
                },
                {
                  type: "mcq",
                  question: "What does HTML stand for?",
                  options: [
                    "Hyper Text Markup Language",
                    "High Tech Modern Language",
                    "Home Tool Markup Language",
                  ],
                  answer: 0,
                },
              ],
              isEnriched: false,
            },
            {
              title: "HTML Tags and Elements",
              objectives: ["Know common HTML tags"],
              content: [
                {
                  type: "heading",
                  text: "Common HTML Tags",
                },
                {
                  type: "paragraph",
                  text: "Tags are used to mark elements in HTML.",
                },
              ],
              isEnriched: false,
            },
          ],
        },
        {
          title: "Module 2: CSS Basics",
          description: "Learn styling with CSS",
          lessons: [
            {
              title: "CSS Introduction",
              objectives: ["Understand CSS purpose"],
              content: [
                {
                  type: "heading",
                  text: "What is CSS?",
                },
                {
                  type: "paragraph",
                  text: "CSS is used to style HTML elements.",
                },
              ],
              isEnriched: false,
            },
          ],
        },
      ],
    });

    const saved = await testCourse.save();

    res.status(201).json({
      success: true,
      message: "Test course created successfully",
      course: saved,
      debugUrl: `/api/debug/course/${saved._id}`,
      fullDataUrl: `/api/debug/course/${saved._id}/full`,
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

/**
 * 🔧 NEW: DELETE /api/debug/course/:courseId
 * Delete a test course (for cleanup)
 */
router.delete("/course/:courseId", async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.courseId);

    if (!deleted) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({
      success: true,
      message: "Test course deleted",
      deletedId: req.params.courseId,
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🔧 NEW: GET /api/debug/health
 * Quick health check for debug endpoints and database connection
 */
router.get("/health", async (req, res) => {
  try {
    const coursesCount = await Course.countDocuments();
    const lessonsCount = await Lesson.countDocuments();
    const modulesCount = await Module.countDocuments();

    res.json({
      status: "healthy",
      database: {
        courses: coursesCount,
        lessons: lessonsCount,
        modules: modulesCount,
      },
      endpoints: {
        allCourses: "GET /api/debug/courses",
        courseStructure: "GET /api/debug/course/:courseId",
        courseFullData: "GET /api/debug/course/:courseId/full",
        lessonDetails: "GET /api/debug/lesson/:lessonId",
        lessonRaw: "GET /api/debug/lesson/:lessonId/raw",
        testCourse: "POST /api/debug/test-course",
        deleteCourse: "DELETE /api/debug/course/:courseId",
        health: "GET /api/debug/health",
      },
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

module.exports = router;

// ========================================
// 📌 IN YOUR MAIN SERVER FILE (server.js or app.js):
// ========================================
// const debugRoutes = require("./routes/debugRoutes");
// app.use("/api/debug", debugRoutes);
//
// COURSE STRUCTURE (No SavedLesson needed):
// Course
//   └─ modules[]
//        └─ lessons[]
//             └─ content[]
// ========================================
