// backend/services/validator.js

const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });

/**
 * Safely parse JSON from LLM response
 * Handles markdown code fences, extra whitespace, and malformed JSON
 * @param {string} text Raw text from LLM
 * @returns {Object} Parsed JSON object
 */
function safeJsonParse(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Invalid input: expected non-empty string");
  }

  try {
    // Try direct parsing first
    return JSON.parse(text);
  } catch (err) {
    console.warn("⚠️  Direct JSON parse failed, attempting recovery...");
  }

  // Remove markdown code fences
  let cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .replace(/^```/gm, "");

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn("⚠️  Cleaned JSON parse failed, extracting JSON object...");
  }

  // Try to extract JSON object from text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("❌ Failed to parse extracted JSON");
    }
  }

  // Try to extract JSON array
  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]);
    } catch (err) {
      console.error("❌ Failed to parse extracted JSON array");
    }
  }

  throw new Error(
    "Failed to parse JSON from LLM response: " + text.slice(0, 100)
  );
}

// ==================== JSON SCHEMAS ====================

/**
 * Course schema - defines structure for course generation
 */
const courseSchema = {
  type: "object",
  required: ["title", "description", "modules"],
  properties: {
    title: { type: "string", minLength: 1 },
    description: { type: "string", minLength: 10 },
    tags: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      maxItems: 10,
    },
    modules: {
      type: "array",
      items: {
        type: "object",
        required: ["title", "lessons"],
        properties: {
          title: { type: "string", minLength: 1 },
          lessons: {
            type: "array",
            items: { type: "string", minLength: 1 },
            minItems: 3,
            maxItems: 6,
          },
        },
      },
      minItems: 3,
      maxItems: 6,
    },
  },
};

/**
 * Lesson schema - defines structure for lesson content
 */
const lessonSchema = {
  type: "object",
  required: ["title", "objectives", "content"],
  properties: {
    title: { type: "string", minLength: 1 },
    objectives: {
      type: "array",
      items: { type: "string", minLength: 10 },
      minItems: 3,
      maxItems: 6,
    },
    content: {
      type: "array",
      items: {
        type: "object",
        required: ["type"],
        properties: {
          type: {
            type: "string",
            enum: ["heading", "paragraph", "code", "video", "mcq"],
          },
          text: { type: ["string", "null"] },
          level: { type: ["number", "null"] },
          language: { type: ["string", "null"] },
          code: { type: ["string", "null"] },
          query: { type: ["string", "null"] },
          question: { type: ["string", "null"] },
          options: {
            type: ["array", "null"],
            items: { type: "string" },
          },
          answer: { type: ["number", "null"] },
          explanation: { type: ["string", "null"] },
        },
      },
      minItems: 10,
      maxItems: 20,
    },
  },
};

/**
 * Compile validators
 */
const validateCourse = ajv.compile(courseSchema);
const validateLesson = ajv.compile(lessonSchema);

/**
 * Validate course structure
 * @param {Object} course Course object to validate
 * @returns {Object} { valid: boolean, errors: Array }
 */
function validateCourseStructure(course) {
  const valid = validateCourse(course);
  return {
    valid,
    errors: valid ? [] : validateCourse.errors,
  };
}

/**
 * Validate lesson structure
 * @param {Object} lesson Lesson object to validate
 * @returns {Object} { valid: boolean, errors: Array }
 */
function validateLessonStructure(lesson) {
  const valid = validateLesson(lesson);

  // Additional checks for MCQ blocks
  if (valid && Array.isArray(lesson.content)) {
    const mcqBlocks = lesson.content.filter((b) => b.type === "mcq");
    for (const mcq of mcqBlocks) {
      if (!mcq.question || mcq.question.trim() === "") {
        return {
          valid: false,
          errors: [
            {
              message: "MCQ block missing question field or question is empty",
            },
          ],
        };
      }
      if (!Array.isArray(mcq.options) || mcq.options.length !== 4) {
        return {
          valid: false,
          errors: [{ message: "MCQ block must have exactly 4 options" }],
        };
      }
      if (typeof mcq.answer !== "number" || mcq.answer < 0 || mcq.answer > 3) {
        return {
          valid: false,
          errors: [{ message: "MCQ answer must be a number between 0-3" }],
        };
      }
      if (!mcq.explanation || mcq.explanation.trim() === "") {
        return {
          valid: false,
          errors: [{ message: "MCQ block missing explanation" }],
        };
      }
    }
  }

  return {
    valid,
    errors: valid ? [] : validateLesson.errors,
  };
}

/**
 * Log validation errors
 * @param {Array} errors AJV errors array
 */
function logValidationErrors(errors) {
  if (!Array.isArray(errors) || errors.length === 0) return;

  console.error("❌ Validation Errors:");
  errors.forEach((err) => {
    console.error(`   - ${err.instancePath || "root"}: ${err.message}`);
  });
}

module.exports = {
  safeJsonParse,
  validateCourse: validateCourseStructure,
  validateLesson: validateLessonStructure,
  logValidationErrors,
  // Export raw validators for advanced usage
  validateCourseRaw: validateCourse,
  validateLessonRaw: validateLesson,
};
