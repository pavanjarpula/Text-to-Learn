require("dotenv").config();
const { OpenAI } = require("openai"); // 👈 Updated library import
const {
  generateCoursePrompt,
  generateLessonPrompt,
} = require("./promptTemplates");
const { safeJsonParse } = require("./validator");

if (!process.env.OPENAI_API_KEY) {
  // 👈 Check for the new variable
  throw new Error("❌ OPENAI_API_KEY missing in .env");
}

// Initialize OpenAI client
// The client will automatically pick up the OPENAI_API_KEY environment variable.
const openai = new OpenAI();

// Using gpt-4o-mini, which is fast and supports JSON mode
const MODEL = "gpt-4o-mini";
const SYSTEM_INSTRUCTION =
  "You are a specialized course generator. Your responses MUST be valid, unadorned JSON that strictly adheres to the requested schema. Do not include any surrounding text or markdown (like ```json).";

/**
 * Calls the OpenAI API with a single prompt.
 * @param {string} prompt The text prompt to send to the model.
 * @returns {Promise<string>} The generated text response (pure JSON).
 */
async function callLLM(prompt) {
  console.log("🧠 Calling OpenAI API...");
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: SYSTEM_INSTRUCTION, // Use a strong system prompt for reliability
        },
        {
          role: "user",
          content: prompt,
        },
      ], // CRITICAL FIX: Force JSON output
      response_format: { type: "json_object" },
    }); // The response text is now accessed via response.choices[0].message.content

    const text = response.choices[0].message.content;

    console.log(
      "✅ OpenAI response received (starting with):",
      text ? text.slice(0, 100).replace(/\n/g, " ") : "[Empty Response]"
    );
    return text;
  } catch (error) {
    console.error("🔥 [AIController] OpenAI Error:", error);
    throw error;
  }
}

exports.generateCourse = async (topic) => {
  const prompt = generateCoursePrompt(topic);
  const raw = await callLLM(prompt);
  return safeJsonParse(raw);
};

exports.generateLesson = async (courseTitle, moduleTitle, lessonTitle) => {
  const prompt = generateLessonPrompt(courseTitle, moduleTitle, lessonTitle);
  const raw = await callLLM(prompt);
  return safeJsonParse(raw);
};
