// backend/services/promptTemplates.js

exports.generateCoursePrompt = (topic) => `
SYSTEM: You are a professional course designer. Return RAW JSON ONLY.

USER: Create a course outline for the topic "${topic}" with:
- title (string)
- description (string)
- tags (array of strings)
- modules (array): each { title: string, lessons: [ "Lesson Title 1", ... ] }

Rules:
- 3–6 modules.
- Each module 3–5 lessons.
- concise titles (<=8 words)
Return ONLY JSON.
`;

exports.generateLessonPrompt = (courseTitle, moduleTitle, lessonTitle) => `
SYSTEM: You are an expert educator. Return RAW JSON ONLY.

USER: Generate lesson content for course "${courseTitle}", module "${moduleTitle}", lesson "${lessonTitle}".
Return JSON with:
{
  "title": string,
  "objectives": [string],
  "content": [
    { "type":"heading","text":"..." },
    { "type":"paragraph","text":"..." },
    { "type":"code","language":"javascript","text":"..." },
    { "type":"video","query":"..." },
    { "type":"mcq","question":"...","options":[...],"answer":0,"explanation":"..." }
  ]
}
Rules:
- 6–12 total content blocks
- Include at least 1 heading, 1 paragraph
- Include 3–4 MCQs at the end
- Return JSON ONLY
`;
