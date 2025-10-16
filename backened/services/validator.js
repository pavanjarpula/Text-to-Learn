// backend/services/validator.js
const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    const match = text.match(/({[\s\S]*}|\[[\s\S]*\])/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Failed to parse JSON from LLM response");
  }
}

// --- JSON Schemas ---
const courseSchema = {
  type: "object",
  required: ["title", "description", "modules"],
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    modules: {
      type: "array",
      items: {
        type: "object",
        required: ["title", "lessons"],
        properties: {
          title: { type: "string" },
          lessons: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
};

const lessonSchema = {
  type: "object",
  required: ["title", "objectives", "content"],
  properties: {
    title: { type: "string" },
    objectives: { type: "array", items: { type: "string" } },
    content: {
      type: "array",
      items: {
        type: "object",
        required: ["type"],
        properties: {
          type: { type: "string" },
          text: { type: "string" },
          language: { type: "string" },
          query: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          answer: {},
          explanation: { type: "string" },
        },
      },
    },
  },
};

const validateCourse = ajv.compile(courseSchema);
const validateLesson = ajv.compile(lessonSchema);

module.exports = { safeJsonParse, validateCourse, validateLesson };
