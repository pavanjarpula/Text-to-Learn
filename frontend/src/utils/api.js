// src/utils/api.js
import { getAccessTokenSilently } from "@auth0/auth0-react";

/**
 * Helper to get full API URL.
 */
const BASE_URL = "http://localhost:5000/api";

/**
 * Generates a course from a text prompt (used in AI generation flow).
 */
export const fetchResponse = async (prompt) => {
  try {
    const response = await fetch(`${BASE_URL}/courses/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: prompt }),
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    return data; // Full course object
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Generic helper for authenticated API requests using Auth0 token.
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
  if (!res.ok) throw new Error(`API ${method} ${endpoint} failed`);
  return res.json();
};

/**
 * Example usage:
 * const token = await getAccessTokenSilently();
 * const courses = await apiRequest("/courses/my", "GET", null, token);
 */
