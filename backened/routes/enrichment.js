// backend/routes/enrichment.js - LIGHTWEIGHT VERSION

const express = require("express");
const router = express.Router();
const { searchVideos } = require("../services/youtubeService");
const {
  translateToHinglish,
  createMultilingualLesson,
  generateAudio,
} = require("../services/multilingualService");
const {
  exportLessonAsPDF,
  exportModuleAsPDF,
} = require("../services/pdfExportService");
const Lesson = require("../models/Lesson");

// ============ MILESTONE 9: YouTube Video Integration ============

/**
 * GET /api/enrichment/videos/:query
 * Search for educational videos based on lesson content
 */
router.get("/videos/:query", async (req, res, next) => {
  try {
    const { query } = req.params;
    const { maxResults = 3 } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "Query parameter is required",
        error: "EMPTY_QUERY",
      });
    }

    console.log(`🎬 API: Searching videos for "${query}"`);

    const videos = await searchVideos(
      decodeURIComponent(query),
      parseInt(maxResults)
    );

    res.status(200).json({
      success: true,
      message: "Videos retrieved successfully",
      data: videos,
    });
  } catch (error) {
    console.error("❌ Error in /videos endpoint:", error);
    next(error);
  }
});

/**
 * POST /api/enrichment/embed-video
 * Get embed URL for a specific video query
 */
router.post("/embed-video", async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        message: "Query is required",
        error: "MISSING_QUERY",
      });
    }

    const videos = await searchVideos(query, 1);

    if (videos.length === 0) {
      return res.status(404).json({
        message: "No videos found",
        data: null,
      });
    }

    const video = videos[0];
    const embedUrl = `https://www.youtube.com/embed/${video.id}`;

    res.status(200).json({
      success: true,
      message: "Video embedded successfully",
      data: {
        ...video,
        embedUrl,
      },
    });
  } catch (error) {
    console.error("❌ Error in /embed-video endpoint:", error);
    next(error);
  }
});

// ============ MILESTONE 10: Multilingual Support (Hinglish) ============

/**
 * POST /api/enrichment/translate-hinglish
 * Translate lesson text to Hinglish
 */
router.post("/translate-hinglish", async (req, res, next) => {
  try {
    const { text, lessonTitle } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Text is required for translation",
        error: "MISSING_TEXT",
      });
    }

    console.log(`🌐 API: Translating to Hinglish...`);

    const hinglishText = await translateToHinglish(text);

    res.status(200).json({
      success: true,
      message: "Translation completed",
      data: {
        originalText: text,
        hinglishText,
        lessonTitle: lessonTitle || "Lesson",
      },
    });
  } catch (error) {
    console.error("❌ Error in /translate-hinglish endpoint:", error);
    next(error);
  }
});

/**
 * POST /api/enrichment/generate-audio
 * Generate audio from Hinglish text
 */
router.post("/generate-audio", async (req, res, next) => {
  try {
    const { text, language = "hi-IN" } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Text is required for audio generation",
        error: "MISSING_TEXT",
      });
    }

    console.log(`🎙️  API: Generating audio...`);

    const audioBuffer = await generateAudio(text, language);

    if (!audioBuffer) {
      return res.status(503).json({
        message: "TTS service unavailable - try web browser TTS",
        error: "TTS_UNAVAILABLE",
      });
    }

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "attachment; filename=lesson-audio.mp3",
    });

    res.send(audioBuffer);
  } catch (error) {
    console.error("❌ Error in /generate-audio endpoint:", error);
    next(error);
  }
});

/**
 * POST /api/enrichment/multilingual-lesson
 * Create complete multilingual lesson
 */
router.post("/multilingual-lesson", async (req, res, next) => {
  try {
    const {
      lessonId,
      lessonTitle,
      lessonContent,
      generateAudio: generateAudioFlag = false,
    } = req.body;

    if (!lessonTitle || !lessonContent) {
      return res.status(400).json({
        message: "lessonTitle and lessonContent are required",
        error: "MISSING_FIELDS",
      });
    }

    console.log(`📚 API: Creating multilingual lesson...`);

    const result = await createMultilingualLesson(
      lessonTitle,
      lessonContent,
      generateAudioFlag
    );

    if (lessonId) {
      await Lesson.findByIdAndUpdate(
        lessonId,
        {
          hinglishExplanation: result.hinglishText,
          hasAudio: !!result.audioBuffer,
          audioUrl: result.audioUrl,
        },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Multilingual lesson created successfully",
      data: result,
    });
  } catch (error) {
    console.error("❌ Error in /multilingual-lesson endpoint:", error);
    next(error);
  }
});

// ============ MILESTONE 11: PDF Export (LIGHTWEIGHT) ============

/**
 * POST /api/enrichment/export-lesson-data
 * Export lesson with custom data (returns HTML for frontend conversion)
 */
router.post("/export-lesson-data", async (req, res, next) => {
  try {
    const { lesson, courseInfo } = req.body;

    if (!lesson) {
      return res.status(400).json({
        message: "Lesson data is required",
        error: "MISSING_LESSON",
      });
    }

    console.log(`📄 API: Generating lesson HTML for PDF...`);

    const result = await exportLessonAsPDF(lesson, courseInfo || {});

    res.status(200).json({
      success: true,
      message: "Lesson HTML generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("❌ Error in /export-lesson-data endpoint:", error);
    next(error);
  }
});

/**
 * GET /api/enrichment/export-lesson/:lessonId
 * Export a specific lesson from database
 */
router.get("/export-lesson/:lessonId", async (req, res, next) => {
  try {
    const { lessonId } = req.params;

    console.log(`📄 API: Exporting lesson ${lessonId}...`);

    const lesson = await Lesson.findById(lessonId).populate("module").lean();

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
        error: "LESSON_NOT_FOUND",
      });
    }

    const Module = require("../models/Module");
    const Course = require("../models/Course");

    const module = await Module.findById(lesson.module).lean();
    const course = await Course.findById(module.course).lean();

    const courseInfo = {
      courseName: course?.title || "Course",
      moduleName: module?.title || "Module",
    };

    const result = await exportLessonAsPDF(lesson, courseInfo);

    res.status(200).json({
      success: true,
      message: "Lesson HTML generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("❌ Error in /export-lesson endpoint:", error);
    next(error);
  }
});

/**
 * GET /api/enrichment/export-module/:moduleId
 * Export entire module
 */
router.get("/export-module/:moduleId", async (req, res, next) => {
  try {
    const { moduleId } = req.params;

    console.log(`📄 API: Exporting module ${moduleId}...`);

    const Module = require("../models/Module");
    const Course = require("../models/Course");

    const module = await Module.findById(moduleId)
      .populate("lessons")
      .populate("course")
      .lean();

    if (!module) {
      return res.status(404).json({
        message: "Module not found",
        error: "MODULE_NOT_FOUND",
      });
    }

    const courseInfo = {
      courseName: module.course?.title || "Course",
      moduleName: module.title,
    };

    const result = await exportModuleAsPDF(module.lessons, courseInfo);

    res.status(200).json({
      success: true,
      message: "Module HTML generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("❌ Error in /export-module endpoint:", error);
    next(error);
  }
});

module.exports = router;
