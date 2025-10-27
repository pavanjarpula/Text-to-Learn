// backend/services/promptTemplates.js

/**
 * Generate a comprehensive prompt for course creation
 * @param {string} topic The course topic
 * @returns {string} Formatted prompt for LLM
 */
exports.generateCoursePrompt = (
  topic
) => `You are a professional curriculum designer. Generate a comprehensive course outline for: "${topic}"

RESPOND WITH ONLY A VALID JSON OBJECT. NO OTHER TEXT.

Required JSON structure:
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
 * Generate a comprehensive prompt for detailed lesson content
 * @param {string} courseTitle The parent course title
 * @param {string} moduleTitle The parent module title
 * @param {string} lessonTitle The lesson to generate content for
 * @returns {string} Formatted prompt for LLM
 */
exports.generateLessonPrompt = (
  courseTitle,
  moduleTitle,
  lessonTitle
) => `Create a comprehensive lesson for:
Course: "${courseTitle}"
Module: "${moduleTitle}"
Lesson: "${lessonTitle}"

RESPOND WITH ONLY VALID JSON. NO MARKDOWN, NO EXPLANATIONS, NO CODE FENCES.

Required JSON structure with these EXACT fields:
{
  "title": "${lessonTitle}",
  "objectives": [
    "Specific learning outcome 1",
    "Specific learning outcome 2",
    "Specific learning outcome 3"
  ],
  "content": [
    {
      "type": "heading",
      "text": "Main Topic Introduction",
      "level": 1
    },
    {
      "type": "paragraph",
      "text": "Detailed explanation here... (200-300 words of substantive content)"
    },
    {
      "type": "heading",
      "text": "Key Concept Section",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "More detailed explanation... (200-300 words)"
    },
    {
      "type": "code",
      "language": "javascript",
      "code": "// Real working code example\\nconst example = 'value';\\nconsole.log(example);"
    },
    {
      "type": "video",
      "query": "Tutorial on the specific topic"
    },
    {
      "type": "mcq",
      "question": "What is the key concept explained above?",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "answer": 1,
      "explanation": "Option B is correct because... (detailed explanation)"
    }
  ]
}

CRITICAL VALIDATION RULES:
1. OBJECTIVES: Exactly 3-4 items. Each must be specific and actionable.

2. CONTENT BLOCKS: Total 15-18 blocks. Include:
   - Headings: 3-5 total (mix of level 1 and 2)
   - Paragraphs: 6-8 total (each 200-300 words, substantive)
   - Code: 1-2 total (only if relevant to topic, always with real working code)
   - Video: Exactly 1 (query must be specific)
   - MCQ: Exactly 3-4 (see rules below)

3. MCQ VALIDATION - CRITICAL FOR ALL MCQ BLOCKS:
   ✓ "question": MUST NOT BE EMPTY, MUST NOT BE NULL. MUST BE A CLEAR QUESTION.
   ✓ "options": MUST be an array with EXACTLY 4 string options
   ✓ "answer": MUST be a number: 0, 1, 2, or 3
   ✓ "explanation": MUST NOT BE EMPTY. MUST EXPLAIN WHY THE ANSWER IS CORRECT.

4. CODE BLOCK VALIDATION:
   ✓ "code": MUST NOT BE EMPTY
   ✓ MUST use proper escape sequences (\\n for newlines)
   ✓ MUST be real, working code
   ✓ MUST have language specified

5. PARAGRAPH VALIDATION:
   ✓ MUST be 200-300 words
   ✓ MUST be substantive and educational
   ✓ MUST NOT be empty

6. BLOCK ORDER PATTERN:
   - Start: Heading (level 1)
   - Follow: 1-2 paragraphs explaining basics
   - Continue: Heading (level 2) + paragraphs for each major section
   - Middle: Code block (if applicable)
   - Later: Video query
   - End: 3-4 MCQ blocks to test understanding

BEFORE OUTPUTTING: Double-check that:
□ Every MCQ has a non-empty question field
□ Every MCQ has exactly 4 options
□ Every MCQ has answer as 0, 1, 2, or 3
□ Every MCQ has a non-empty explanation
□ Every code block has non-empty code (if included)
□ Total content blocks between 15-18

OUTPUT ONLY THE RAW JSON OBJECT. START WITH { AND END WITH }. NO OTHER TEXT ALLOWED.`;

/**
 * Get statistics about lesson content structure
 * @param {Object} lesson The lesson object
 * @returns {Object} Statistics about content blocks
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
  };
};
