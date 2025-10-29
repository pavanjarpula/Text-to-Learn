// backend/services/promptTemplates.js - FIXED VERSION (Working)

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
 * FIXED: Lesson prompt - proper JSON generation without template escaping issues
 */
exports.generateLessonPrompt = (courseTitle, moduleTitle, lessonTitle) => {
  const prompt = `CRITICAL: Generate comprehensive lesson for: "${lessonTitle}"
In module: "${moduleTitle}"
For course: "${courseTitle}"

You MUST respond with ONLY valid JSON. NO MARKDOWN, NO CODE FENCES, NO EXPLANATIONS.

{
  "title": "${lessonTitle}",
  "objectives": [
    "Understand the fundamentals of ${lessonTitle}",
    "Apply ${lessonTitle} in practical scenarios",
    "Evaluate different approaches to ${lessonTitle}"
  ],
  "content": [
    {
      "type": "heading",
      "text": "Introduction to ${lessonTitle}",
      "level": 1
    },
    {
      "type": "paragraph",
      "text": "Comprehensive explanation of ${lessonTitle}. This is detailed educational content explaining the core concepts of ${lessonTitle}, why it's important, and how it's used in practice. ${lessonTitle} forms a foundational concept in modern development and understanding it will significantly enhance your skills. Provide at least 200 words of substantive educational material that thoroughly explains what ${lessonTitle} is, why developers and organizations use it, and what problems it solves."
    },
    {
      "type": "heading",
      "text": "Key Concepts and Principles",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Detailed discussion of the key concepts in ${lessonTitle}. Explain the important principles, methodologies, and best practices related to ${lessonTitle}. This section should cover: (1) The fundamental theory behind ${lessonTitle}, (2) Core principles and rules, (3) Different methodologies and approaches, (4) Best practices used by professionals. Provide at least 200 words covering the main ideas and theories related to ${lessonTitle}."
    },
    {
      "type": "heading",
      "text": "Practical Application",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Real-world applications and examples of ${lessonTitle}. Show how these concepts are used in practice with concrete examples. Discuss specific use cases and scenarios where ${lessonTitle} is applied. Include information about: (1) Industry examples, (2) Common use cases, (3) Real-world scenarios, (4) How companies use ${lessonTitle}. Provide at least 200 words with practical examples and detailed use cases."
    },
    {
      "type": "code",
      "language": "python",
      "code": "# Working example of ${lessonTitle}\\ndef example_function():\\n    \\\"\\\"\\\"Demonstrates ${lessonTitle} in action\\\"\\\"\\\"\\n    print('Understanding ${lessonTitle}')\\n    result = True\\n    return result\\n\\n# Execute the example\\nif __name__ == '__main__':\\n    output = example_function()\\n    print(f'Result: {output}')"
    },
    {
      "type": "video",
      "query": "Tutorial on ${lessonTitle} for beginners complete guide"
    },
    {
      "type": "mcq",
      "question": "What is the primary purpose of ${lessonTitle}?",
      "options": [
        "To determine the format of data in a program",
        "To enable efficient data storage and manipulation",
        "To create user interfaces",
        "To handle network communications"
      ],
      "answer": 1,
      "explanation": "This is correct because ${lessonTitle} is fundamentally designed to enable efficient data storage and manipulation, which is its primary purpose and benefit."
    },
    {
      "type": "mcq",
      "question": "Which of the following is a key concept in ${lessonTitle}?",
      "options": [
        "Data persistence",
        "Proper structure and organization",
        "Data encapsulation",
        "Data aggregation"
      ],
      "answer": 1,
      "explanation": "Understanding proper structure and organization is a fundamental principle of ${lessonTitle} that demonstrates core understanding of the concept."
    },
    {
      "type": "mcq",
      "question": "How would you practically apply ${lessonTitle} in a real-world scenario?",
      "options": [
        "Using strings for numerical calculations",
        "Organizing user data in a structured format for quick access",
        "Storing all data in a single variable",
        "Using random data organization methods"
      ],
      "answer": 1,
      "explanation": "This demonstrates the correct practical application of ${lessonTitle} by organizing data in a structured and efficient manner in real-world situations."
    }
  ]
}

CRITICAL VALIDATION RULES - CHECK EVERY FIELD BEFORE RESPONDING:

1. CODE BLOCK - MUST HAVE ACTUAL CODE:
   ✓ "code" field must have real Python code with newlines as \\n
   ✓ Example: "code": "def test():\\n    pass"
   ✓ NEVER: "code": "" or "code": "..." or "code": "TODO"

2. MCQ BLOCKS - EACH MUST HAVE:
   ✓ "question" field - NEVER EMPTY, NEVER WHITESPACE ONLY
   ✓ "options" field - EXACTLY 4 string options
   ✓ "answer" field - Must be 0, 1, 2, or 3
   ✓ "explanation" field - NEVER EMPTY
   
3. BEFORE RESPONDING:
   □ Count blocks: should have 11 total (3 headings, 3 paragraphs, 1 code, 1 video, 3 mcq)
   □ Scan all "question" fields - verify NONE are empty strings
   □ Scan all "code" fields - verify NOT empty
   □ Scan all "explanation" fields - verify NOT empty
   □ Check all "answer" values are 0-3
   □ Check all "options" arrays have exactly 4 items

IF ANY VALIDATION FAILS, RESPOND WITH ERROR:
{"error": "validation failed"}

OUTPUT ONLY THE RAW JSON OBJECT. NO MARKDOWN. NO EXPLANATIONS.
START IMMEDIATELY WITH { AND END WITH }`;

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
    codeWithContent: lesson.content.filter(
      (b) => b.type === "code" && b.code && b.code.trim().length > 0
    ).length,
    mcqWithQuestions: lesson.content.filter(
      (b) => b.type === "mcq" && b.question && b.question.trim().length > 0
    ).length,
  };
};
