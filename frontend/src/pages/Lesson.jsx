import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import LessonRenderer from "../components/LessonRenderer";
import { getLessonById } from "../utils/api";
import "./Lesson.css";

const LessonPage = ({ 
  lesson = null, 
  module = null, 
  course = null,
  moduleIdx = 0,
  lessonIdx = 0,
  onBack,
  onNext,
  onPrevious 
}) => {
  const [lessonData, setLessonData] = useState(lesson);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debug: Log what we receive
  useEffect(() => {
    console.group("LessonPage - Props Received");
    console.log("Lesson prop:", lesson);
    console.log("Lesson has content:", !!lesson?.content);
    console.log("Lesson content length:", lesson?.content?.length || 0);
    console.log("Module:", module);
    console.log("Course:", course);
    console.groupEnd();
  }, [lesson, module, course]);

  // Lesson ID from props
  const lessonId = lesson?._id;

  // Fetch lesson data if not passed as prop or if content is missing
  useEffect(() => {
    // Always fetch if we have a lesson ID to ensure we get complete data
    if (lessonId) {
      const fetchLesson = async () => {
        setLoading(true);
        setError(null);
        try {
          console.log("Fetching lesson from API:", lessonId);
          const data = await getLessonById(lessonId);
          
          console.group("LessonPage - Fetched Data");
          console.log("Fetched lesson:", data);
          console.log("Fetched content:", data.content);
          console.log("Fetched objectives:", data.objectives);
          console.groupEnd();
          
          setLessonData(data);
        } catch (err) {
          console.error("Error fetching lesson:", err);
          setError(err.message || "Failed to load lesson");
          
          // Fallback: Use the lesson prop if fetch fails
          // This ensures we at least display something
          if (lesson) {
            console.warn("Using fallback lesson prop due to fetch error");
            setLessonData(lesson);
            setError(null); // Clear error if we have fallback data
          }
        } finally {
          setLoading(false);
        }
      };
      
      fetchLesson();
    } else if (lesson) {
      // No ID, but we have lesson data - use it
      console.log("Using lesson prop directly (no ID)");
      setLessonData(lesson);
      setLoading(false);
    }
  }, [lessonId, lesson]);

  // Loading state
  if (loading && !lessonData) {
    return (
      <div className="lesson-page-container">
        <div className="lesson-page-header">
          <button onClick={onBack} className="lesson-back-btn" title="Go back">
            ←
          </button>
        </div>
        <div className="lesson-page-loading">
          <div className="spinner"></div>
          <p>Loading lesson...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !lessonData) {
    return (
      <div className="lesson-page-container">
        <div className="lesson-page-header">
          <button onClick={onBack} className="lesson-back-btn" title="Go back">
            ←
          </button>
        </div>
        <div className="lesson-page-error">
          <AlertCircle size={48} />
          <h2>Error Loading Lesson</h2>
          <p>{error}</p>
          <button onClick={onBack} className="error-back-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Lesson not found
  if (!lessonData) {
    return (
      <div className="lesson-page-container">
        <div className="lesson-page-header">
          <button onClick={onBack} className="lesson-back-btn" title="Go back">
            ←
          </button>
        </div>
        <div className="lesson-page-error">
          <AlertCircle size={48} />
          <h2>Lesson Not Found</h2>
          <p>The lesson you're looking for doesn't exist.</p>
          <button onClick={onBack} className="error-back-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Success: Render lesson with fetched/provided data
  return (
    <div className="lesson-page-container">
      <div className="lesson-page-header">
        <button onClick={onBack} className="lesson-back-btn" title="Go back">
          ←
        </button>
      </div>

      <LessonRenderer
        lesson={lessonData}
        module={module}
        course={course}
        moduleIdx={moduleIdx}
        lessonIdx={lessonIdx}
        onPrevious={onPrevious}
        onNext={onNext}
        objectives={lessonData.objectives || []}
        content={lessonData.content || []}
      />
    </div>
  );
};

export default LessonPage;

