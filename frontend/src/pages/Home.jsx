// src/pages/Home.jsx
import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ChatPrompt from "../components/ChatPrompt";
import CoursePreview from "../components/CoursePreview";
import "./Home.css";

const Home = () => {
  const [course, setCourse] = useState(null);
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const handleAIResponse = (generatedCourse) => {
    setCourse(generatedCourse);
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <h1>Welcome to Text-to-Learn</h1>
        <p>Type a topic and instantly generate a structured course powered by AI.</p>
      </header>

      {/* Prompt input */}
      <div className="prompt-bar-center">
        <ChatPrompt onResponse={handleAIResponse} />
      </div>

      {/* Show preview */}
      <main className="course-preview-main">
        {course ? (
          <CoursePreview course={course} />
        ) : (
          <div className="placeholder-container">
            <p className="placeholder-text">
              Type a topic below to generate a personalized course...
            </p>
            <div className="placeholder-divider"></div>
          </div>
        )}
      </main>

      {/* Auth hint */}
      {!isAuthenticated && (
        <div className="text-center mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => loginWithRedirect()}
          >
            Log in to save your generated courses
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;


