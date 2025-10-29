// backend/services/aiService.js - FIXED VERSION

require("dotenv").config();
const { OpenAI } = require("openai");
const {
  generateCoursePrompt,
  generateLessonPrompt,
} = require("./promptTemplates");
const {
  safeJsonParse,
  sanitizeLesson,
  validateCourse,
  validateLesson,
} = require("./validator");

if (!process.env.OPENAI_API_KEY) {
  throw new Error("❌ OPENAI_API_KEY missing in .env");
}

// Initialize OpenAI client
const openai = new OpenAI();

// Using gpt-4o-mini for faster, more reliable JSON output
const MODEL = "gpt-4o-mini";
const SYSTEM_INSTRUCTION =
  "You are a specialized course generator and expert educator. Your responses MUST be valid, unadorned JSON that strictly adheres to the requested schema. Do not include any surrounding text, markdown, code fences, or explanations. Return ONLY the raw JSON object.";

/**
 * Calls the OpenAI API with a single prompt
 */
async function callLLM(prompt) {
  console.log("🧠 Calling OpenAI API...");
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: SYSTEM_INSTRUCTION,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const text = response.choices[0].message.content;

    console.log(
      "✅ OpenAI response received (length: " + (text ? text.length : 0) + ")"
    );
    return text;
  } catch (error) {
    console.error("🔥 OpenAI Error:", error.message);
    throw error;
  }
}

/**
 * Generate a complete course structure
 */
exports.generateCourse = async (topic) => {
  try {
    console.log("📚 Generating course for topic:", topic);
    const prompt = generateCoursePrompt(topic);
    const raw = await callLLM(prompt);
    const parsed = safeJsonParse(raw);

    // Validate course structure
    if (!validateCourse(parsed)) {
      throw new Error("Invalid course structure from LLM");
    }

    console.log("✅ Course generated successfully:", {
      title: parsed.title,
      modulesCount: parsed.modules.length,
    });

    return parsed;
  } catch (error) {
    console.error("❌ Error generating course:", error.message);
    throw error;
  }
};

/**
 * Generate detailed lesson content
 */
exports.generateLesson = async (courseTitle, moduleTitle, lessonTitle) => {
  try {
    console.log(
      `📝 Generating lesson: "${lessonTitle}" in module: "${moduleTitle}"`
    );
    const prompt = generateLessonPrompt(courseTitle, moduleTitle, lessonTitle);
    const raw = await callLLM(prompt);

    console.log(
      "📋 Raw LLM response (first 300 chars):",
      raw.substring(0, 300)
    );

    const parsed = safeJsonParse(raw);

    console.log("✅ JSON parsed successfully");

    // Validate basic structure
    if (!validateLesson(parsed)) {
      throw new Error("Invalid lesson structure from LLM");
    }

    console.log("✅ Basic validation passed");

    // 🔧 CRITICAL: Sanitize and fix the lesson data
    console.log("🧹 Sanitizing lesson content...");
    const sanitized = sanitizeLesson(parsed);

    console.log("✅ Lesson sanitized successfully");

    // Count and report
    const stats = {
      total: sanitized.content.length,
      mcq: sanitized.content.filter((b) => b.type === "mcq").length,
      code: sanitized.content.filter((b) => b.type === "code").length,
      video: sanitized.content.filter((b) => b.type === "video").length,
      heading: sanitized.content.filter((b) => b.type === "heading").length,
      paragraph: sanitized.content.filter((b) => b.type === "paragraph").length,
    };

    console.log("📊 Lesson content stats:", stats);

    // Check for critical content
    if (stats.mcq < 1) {
      console.warn("⚠️  WARNING: Lesson has fewer than 1 MCQ block");
    }
    if (stats.code < 1) {
      console.warn("⚠️  WARNING: Lesson has fewer than 1 code block");
    }

    // Log first MCQ for debugging
    const firstMCQ = sanitized.content.find((b) => b.type === "mcq");
    if (firstMCQ) {
      console.log("✅ First MCQ block:", {
        question: firstMCQ.question.substring(0, 50) + "...",
        optionsCount: firstMCQ.options.length,
        answer: firstMCQ.answer,
      });
    }

    // Log first code block for debugging
    const firstCode = sanitized.content.find((b) => b.type === "code");
    if (firstCode) {
      console.log("✅ First code block:", {
        language: firstCode.language,
        codeLength: firstCode.code.length,
        preview: firstCode.code.substring(0, 50) + "...",
      });
    }

    return sanitized;
  } catch (error) {
    console.error("❌ Error generating lesson:", error.message);
    console.error("Stack:", error.stack);
    throw error;
  }
};

module.exports.callLLM = callLLM;
