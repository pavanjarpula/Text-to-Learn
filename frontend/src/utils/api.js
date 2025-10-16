// src/utils/api.js
const BASE_URL = "http://localhost:5000/api";

/**
 * Generic API request helper
 */
export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  token = null
) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API ${method} ${endpoint} failed: ${errorText}`);
  }
  return res.json();
};

/**
 * 🧠 Generate structured course content using AI
 */
export const generateCourseAI = async (prompt) => {
  try {
    const res = await fetch(`${BASE_URL}/ai/generate-course`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: prompt }),
    });
    if (!res.ok) throw new Error("Failed to generate course");
    return await res.json();
  } catch (err) {
    console.error("AI generation error:", err);
    return null;
  }
};

// --- COURSE ROUTES ---
export const getAllCourses = () => apiRequest("/courses");
export const getCourseById = (id) => apiRequest(`/courses/${id}`);
export const getMyCourses = (token) =>
  apiRequest("/courses/my", "GET", null, token);
export const deleteCourseById = (id, token) =>
  apiRequest(`/courses/${id}`, "DELETE", null, token);

// --- MODULE ROUTES ---
export const getModulesByCourse = (courseId) =>
  apiRequest(`/modules/${courseId}/modules`);
export const addModuleToCourse = (courseId, body, token) =>
  apiRequest(`/modules/${courseId}/modules`, "POST", body, token);
export const deleteModuleById = (moduleId, token) =>
  apiRequest(`/modules/${moduleId}`, "DELETE", null, token);

// --- LESSON ROUTES ---
export const getLessonsByModule = (moduleId) =>
  apiRequest(`/modules/${moduleId}/lessons`);
export const getLessonById = (lessonId) => apiRequest(`/lessons/${lessonId}`);
export const addLessonToModule = (moduleId, body, token) =>
  apiRequest(`/lessons/${moduleId}`, "POST", body, token);
export const deleteLessonById = (lessonId, token) =>
  apiRequest(`/lessons/${lessonId}`, "DELETE", null, token);
