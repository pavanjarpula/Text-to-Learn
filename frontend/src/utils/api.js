// src/utils/api.js
export const fetchResponse = async (prompt) => {
  try {
    const response = await fetch("http://localhost:5000/api/courses/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: prompt }), // backend expects topic
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    return data; // ✅ return full course object
  } catch (error) {
    console.error(error);
    return null; // return null if something fails
  }
};
