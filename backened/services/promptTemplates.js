// backend/services/promptTemplates.js - CONCRETE CONTENT GENERATION

/**
 * Determine lesson importance and depth level
 */
function getLessonContext(
  courseTitle,
  moduleTitle,
  lessonTitle,
  moduleIndex,
  lessonIndex,
  totalModules,
  totalLessons
) {
  const isFoundational = moduleIndex === 0 && lessonIndex === 0;
  const isAdvanced = moduleIndex >= totalModules - 2;
  const isIntroductory = moduleIndex === 0;
  const isCulminating = lessonIndex === totalLessons - 1;

  return {
    isFoundational,
    isAdvanced,
    isIntroductory,
    isCulminating,
    depth: isFoundational
      ? "foundational"
      : isAdvanced
      ? "advanced"
      : "intermediate",
    position: `lesson ${lessonIndex + 1} of ${totalLessons}`,
  };
}

/**
 * Generate a comprehensive prompt for course creation
 */
exports.generateCoursePrompt = (
  topic
) => `You are a professional curriculum designer. Generate a comprehensive course outline for: "${topic}"

RESPOND WITH ONLY A VALID JSON OBJECT. NO OTHER TEXT.

{
  "title": "Clear Course Title",
  "description": "2-3 sentence description",
  "tags": ["tag1", "tag2", "tag3"],
  "modules": [
    {
      "title": "Module Title",
      "lessons": ["Lesson 1", "Lesson 2", "Lesson 3", "Lesson 4"]
    }
  ]
}

STRICT REQUIREMENTS:
- 4-6 modules total
- 4-5 lessons per module
- Progression from basics to advanced
- Concise titles (under 10 words each)
- 3-5 relevant tags

OUTPUT ONLY THE JSON OBJECT. START WITH { END WITH }`;

/**
 * FIXED: Generate CONCRETE, SPECIFIC lesson content
 * NO template variables in paragraphs - all actual content
 */
exports.generateLessonPrompt = (
  courseTitle,
  moduleTitle,
  lessonTitle,
  moduleIndex = 0,
  lessonIndex = 0,
  totalModules = 4,
  totalLessons = 16
) => {
  const context = getLessonContext(
    courseTitle,
    moduleTitle,
    lessonTitle,
    moduleIndex,
    lessonIndex,
    totalModules,
    totalLessons
  );

  let depthGuidance = "";
  if (context.isFoundational) {
    depthGuidance = `This is a FOUNDATIONAL lesson (first in the course). 
    - Use beginner-friendly language
    - Explain basic definitions clearly
    - Provide simple, relatable examples
    - Don't assume prior knowledge
    - Build confidence in learners`;
  } else if (context.isAdvanced) {
    depthGuidance = `This is an ADVANCED lesson (in final modules).
    - Assume learners have foundation knowledge
    - Focus on complex scenarios and edge cases
    - Discuss optimization and performance
    - Cover professional best practices
    - Reference earlier concepts as foundation`;
  } else {
    depthGuidance = `This is an INTERMEDIATE lesson.
    - Build on foundational concepts
    - Include practical, real-world scenarios
    - Show common implementation patterns
    - Discuss trade-offs and considerations
    - Connect to broader concepts in ${courseTitle}`;
  }

  const prompt = `You are an expert educator creating a lesson about: "${lessonTitle}"

LESSON METADATA:
- Course: ${courseTitle}
- Module: ${moduleTitle}
- Lesson Title: ${lessonTitle}
- Depth Level: ${context.depth}
- Position: ${context.position}

DEPTH GUIDELINES:
${depthGuidance}

CRITICAL: Create REAL, SPECIFIC content - NOT templates or placeholders.
Each paragraph must contain ACTUAL educational content about ${lessonTitle}.

RESPOND WITH ONLY VALID JSON. NO MARKDOWN, NO CODE FENCES, NO EXPLANATIONS.

{
  "title": "${lessonTitle}",
  "depth": "${context.depth}",
  "objectives": [
    "Students will be able to understand key concepts of ${lessonTitle}",
    "Students will be able to apply ${lessonTitle} in practical contexts",
    "Students will be able to evaluate when and how to use ${lessonTitle}"
  ],
  "content": [
    {
      "type": "heading",
      "text": "Understanding ${lessonTitle}",
      "level": 1
    },
    {
      "type": "paragraph",
      "text": "Write a comprehensive introduction (200+ words) explaining what ${lessonTitle} is in concrete, specific terms. Define the concept clearly with actual details about ${lessonTitle}. Explain why ${lessonTitle} exists and what problem it addresses. This should be detailed and informative, NOT generic or a placeholder. Use specific terminology and concepts relevant to ${lessonTitle}. Make it clear and educational for someone learning ${lessonTitle} for the first time in the context of ${moduleTitle}."
    },
    {
      "type": "heading",
      "text": "Key Components and How ${lessonTitle} Works",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Write a detailed technical explanation (200+ words) of how ${lessonTitle} actually works. Break down the mechanisms, components, or principles that make ${lessonTitle} function. This should be completely different from the introduction - focus on the 'how' rather than the 'what'. Explain the internal processes, key steps, important elements, and technical details that someone needs to understand to work with ${lessonTitle}. Be specific and substantive."
    },
    {
      "type": "heading",
      "text": "Real-World Applications and Practical Use Cases",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Write a practical, concrete explanation (200+ words) of how ${lessonTitle} is used in real situations. Provide specific, actual examples of where ${lessonTitle} is applied in industry, business, or technology. Discuss specific scenarios, use cases, or situations where someone would use ${lessonTitle}. Include real-world problems that ${lessonTitle} solves. Make this practical and grounded in reality, not theoretical or hypothetical."
    },
    {
      "type": "heading",
      "text": "Best Practices, Pitfalls, and Professional Considerations",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Write a comprehensive guide (200+ words) covering best practices when working with ${lessonTitle}. Include common mistakes people make, what professionals do to use ${lessonTitle} effectively, important considerations, and potential pitfalls to avoid. Discuss quality factors, performance considerations, and professional standards related to ${lessonTitle}. This section should provide actionable wisdom that makes learners better at using ${lessonTitle} in professional settings."
    },
    {
      "type": "code",
      "language": "python",
      "code": "# Practical Example of ${lessonTitle}\\n# This shows a real, working implementation\\n\\nclass ${lessonTitle.replace(
    /\\s+/g,
    ""
  )}Example:\\n    def __init__(self):\\n        self.data = []\\n        self.status = 'initialized'\\n    \\n    def process(self, input_value):\\n        \\\"\\\"\\\"Process input using ${lessonTitle} principles\\\"\\\"\\\"\\n        result = self.transform(input_value)\\n        self.data.append(result)\\n        return result\\n    \\n    def transform(self, value):\\n        # Actual transformation logic for ${lessonTitle}\\n        return value\\n    \\n    def get_results(self):\\n        return self.data\\n\\n# Usage example\\nexample = ${lessonTitle.replace(
    /\\s+/g,
    ""
  )}Example()\\nresult = example.process('test_input')\\nprint(f'Processed: {result}')"
    },
    {
      "type": "code",
      "language": "python",
      "code": "# Advanced Pattern: Production-Ready ${lessonTitle} Implementation\\n# Shows a different approach with more sophisticated techniques\\n\\nimport logging\\nfrom typing import Any, Dict\\n\\nlogger = logging.getLogger(__name__)\\n\\nclass Production${lessonTitle.replace(
    /\\s+/g,
    ""
  )}Handler:\\n    def __init__(self, config: Dict[str, Any]):\\n        self.config = config\\n        self.cache = {}\\n        logger.info(f'Initialized ${lessonTitle} handler with config: {config}')\\n    \\n    def execute(self, task: Any) -> Any:\\n        \\\"\\\"\\\"Execute ${lessonTitle} with error handling and caching\\\"\\\"\\\"\\n        task_id = id(task)\\n        if task_id in self.cache:\\n            logger.debug(f'Returning cached result for task {task_id}')\\n            return self.cache[task_id]\\n        \\n        try:\\n            result = self.process_with_error_handling(task)\\n            self.cache[task_id] = result\\n            return result\\n        except Exception as e:\\n            logger.error(f'Error processing task: {str(e)}')\\n            raise\\n    \\n    def process_with_error_handling(self, task: Any) -> Any:\\n        # Complex processing logic\\n        return task"
    },
    {
      "type": "video",
      "query": "${lessonTitle} complete tutorial with examples and practical applications"
    },
    {
      "type": "heading",
      "text": "Check Your Understanding",
      "level": 2
    },
    {
      "type": "mcq",
      "question": "What is the primary definition or core concept of ${lessonTitle}?",
      "options": [
        "An incorrect or oversimplified definition",
        "The correct, specific definition of ${lessonTitle} based on what was taught",
        "A common misconception about what ${lessonTitle} is",
        "A definition of a related but different concept"
      ],
      "answer": 1,
      "explanation": "This correctly identifies the specific definition and core concept of ${lessonTitle} as explained in the lesson."
    },
    {
      "type": "mcq",
      "question": "How does ${lessonTitle} actually function or work internally?",
      "options": [
        "An incorrect description of how ${lessonTitle} works",
        "A correct explanation of the mechanisms and processes of ${lessonTitle}",
        "A misconception about internal workings",
        "An explanation of a similar but different concept"
      ],
      "answer": 1,
      "explanation": "This correctly describes the actual mechanisms, processes, or internal workings of ${lessonTitle}."
    },
    {
      "type": "mcq",
      "question": "In which real-world scenario would you apply ${lessonTitle}?",
      "options": [
        "A scenario where ${lessonTitle} would not be appropriate",
        "A real, practical scenario where ${lessonTitle} solves an actual problem",
        "A scenario requiring a different approach or tool",
        "A hypothetical scenario that doesn't reflect real usage"
      ],
      "answer": 1,
      "explanation": "This identifies a genuine, real-world application where ${lessonTitle} would be the appropriate solution."
    },
    {
      "type": "mcq",
      "question": "What is a best practice or important consideration when using ${lessonTitle}?",
      "options": [
        "A common mistake to avoid",
        "A professional best practice for working with ${lessonTitle}",
        "An approach that works but is not optimal",
        "An outdated method no longer used"
      ],
      "answer": 1,
      "explanation": "This represents professional best practices and important considerations for effectively using ${lessonTitle}."
    }
  ]
}

VALIDATION CHECKLIST - Do NOT respond unless:
✓ All 4 paragraphs contain REAL, SPECIFIC content about ${lessonTitle}
✓ NO paragraph contains template variables or placeholders
✓ Each paragraph is 200+ words of actual educational content
✓ Paragraphs cover different aspects: definition → mechanics → applications → best practices
✓ Code examples are real Python code that would actually run
✓ All 4 MCQ questions are specific to ${lessonTitle}, not generic
✓ MCQ options are realistic and plausible
✓ Explanations reference specific lesson content
✓ Video query is specific to ${lessonTitle}

OUTPUT ONLY RAW JSON. START WITH { END WITH }`;

  return prompt;
};

/**
 * Get statistics about lesson content
 */
exports.getLessonStats = (lesson) => {
  if (!lesson || !Array.isArray(lesson.content)) return null;

  return {
    totalBlocks: lesson.content.length,
    mcqCount: lesson.content.filter((b) => b.type === "mcq").length,
    headingCount: lesson.content.filter((b) => b.type === "heading").length,
    paragraphCount: lesson.content.filter((b) => b.type === "paragraph").length,
    codeCount: lesson.content.filter((b) => b.type === "code").length,
    videoCount: lesson.content.filter((b) => b.type === "video").length,
    depth: lesson.depth || "unknown",
    codeWithContent: lesson.content.filter(
      (b) => b.type === "code" && b.code && b.code.trim().length > 0
    ).length,
    mcqWithQuestions: lesson.content.filter(
      (b) => b.type === "mcq" && b.question && b.question.trim().length > 0
    ).length,
  };
};

module.exports.getLessonContext = getLessonContext;
