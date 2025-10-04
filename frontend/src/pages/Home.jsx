// src/pages/Home.jsx
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react'; // ✅ import Auth0 hook
import PromptForm from '../components/PromptForm';
import CoursePreview from '../components/CoursePreview';
import { useFetch } from '../hooks/useFetch';
import './Home.css';

export default function Home() {
  const [course, setCourse] = useState(null);
  const { isAuthenticated } = useAuth0(); // ✅ use Auth0 hook

  // useFetch hook for saving courses, disabled auto-fetch (false)
  const { refetch: saveCourse } = useFetch("/api/courses", {}, false);

  const handleCourseGenerated = async (generatedCourse) => {
    setCourse(generatedCourse);

    // Save course to backend if user is logged in
    if (isAuthenticated) {
      try {
        await saveCourse({
          method: "POST",
          body: JSON.stringify({ prompt: generatedCourse.prompt }),
        });
        console.log("Course saved!");
      } catch (err) {
        console.error("Error saving course:", err);
      }
    }
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <h1>Welcome to Pavan's Text-to-Learn App</h1>
        <p>Simplify self-learning with instantly generated structured courses.</p>
      </header>

      {/* PROMPT BAR SECTION */}
      <div className="prompt-bar-center">
        <PromptForm onResult={handleCourseGenerated} />
      </div>

      {/* Course Preview - Now below the Prompt Bar */}
      <main className="course-preview-main">
        {course ? (
          <CoursePreview course={course} />
        ) : (
          <div className="placeholder-container">
            <p className="placeholder-text">Enter a topic below to generate a course...</p>
            <div className="placeholder-divider"></div>
          </div>
        )}
      </main>
    </div>
  );
}
