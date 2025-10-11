// src/components/PromptForm.jsx
import React, { useState } from "react";
import { fetchResponse } from "../utils/api";

const PromptForm = ({ onResult }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchResponse(prompt);

      if (!result) {
        setError("No course returned. Please try again.");
        return;
      }

      if (onResult) onResult(result); // send full course object to Home
      setPrompt(""); // clear input after submission
    } catch (err) {
      console.error(err);
      setError("Error fetching response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Enter submits, Shift+Enter inserts newline
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="prompt-form-container">
      <form className="prompt-form" onSubmit={handleSubmit}>
        <textarea
          className="prompt-input"
          placeholder="Type a topic and press Enter..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={loading}
        />
        <button
          type="submit"
          className="prompt-submit-btn"
          disabled={loading}
        >
          {loading ? <span className="spinner">⏳</span> : "Generate"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
};

export default PromptForm;



