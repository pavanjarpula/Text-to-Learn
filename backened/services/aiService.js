// backend/services/aiService.js

require("dotenv").config();
const { OpenAI } = require("openai");
const {
  generateCoursePrompt,
  generateLessonPrompt,
} = require("./promptTemplates");
const { safeJsonParse } = require("./validator");

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
 * @param {string} prompt The text prompt to send to the model
 * @returns {Promise<string>} The generated JSON response
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
      response_format: { type: "json_object" }, // Force JSON output
      temperature: 0.7, // Balanced creativity and consistency
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
 * @param {string} topic The course topic
 * @returns {Promise<Object>} Course structure with modules and lessons
 */
exports.generateCourse = async (topic) => {
  try {
    console.log("📚 Generating course for topic:", topic);
    const prompt = generateCoursePrompt(topic);
    const raw = await callLLM(prompt);
    const parsed = safeJsonParse(raw);

    // Validate course structure
    if (!parsed.title || !parsed.modules) {
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
 * @param {string} courseTitle The course title for context
 * @param {string} moduleTitle The module title for context
 * @param {string} lessonTitle The lesson title to generate content for
 * @returns {Promise<Object>} Lesson with objectives and content blocks
 */
exports.generateLesson = async (courseTitle, moduleTitle, lessonTitle) => {
  try {
    console.log(
      `📝 Generating lesson: "${lessonTitle}" in module: "${moduleTitle}"`
    );
    const prompt = generateLessonPrompt(courseTitle, moduleTitle, lessonTitle);
    const raw = await callLLM(prompt);
    const parsed = safeJsonParse(raw);

    // Validate lesson structure
    if (
      !parsed.title ||
      !Array.isArray(parsed.objectives) ||
      !Array.isArray(parsed.content)
    ) {
      throw new Error("Invalid lesson structure from LLM");
    }

    // Count content blocks by type
    const contentStats = {
      total: parsed.content.length,
      mcq: parsed.content.filter((b) => b.type === "mcq").length,
      code: parsed.content.filter((b) => b.type === "code").length,
      video: parsed.content.filter((b) => b.type === "video").length,
      heading: parsed.content.filter((b) => b.type === "heading").length,
      paragraph: parsed.content.filter((b) => b.type === "paragraph").length,
    };

    console.log("✅ Lesson generated successfully:", {
      title: parsed.title,
      objectivesCount: parsed.objectives.length,
      ...contentStats,
    });

    // Log any blocks without questions for MCQ validation
    const emptyMCQs = parsed.content.filter(
      (b) => b.type === "mcq" && !b.question
    );
    if (emptyMCQs.length > 0) {
      console.warn(
        `⚠️  Warning: ${emptyMCQs.length} MCQ blocks missing questions`
      );
    }

    return parsed;
  } catch (error) {
    console.error("❌ Error generating lesson:", error.message);
    throw error;
  }
};

module.exports.callLLM = callLLM; // Export for testing if needed
