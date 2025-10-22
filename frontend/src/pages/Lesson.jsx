import React, { useState, useEffect } from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
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
  const [loading, setLoading] = useState(!lesson);
  const [error, setError] = useState(null);

  // If lesson ID is passed via params (for direct URL navigation)
  const lessonId = lesson?._id;

  useEffect(() => {
    if (lessonId && !lesson) {
      const fetchLesson = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getLessonById(lessonId);
          setLessonData(data);
        } catch (err) {
          setError(err.message || "Failed to load lesson");
          console.error("Error fetching lesson:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchLesson();
    }
  }, [lessonId, lesson]);

  if (loading) {
    return (
      <div className="lesson-page-loading">
        <div className="spinner"></div>
        <p>Loading lesson...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lesson-page-error">
        <AlertCircle size={48} />
        <h2>Error Loading Lesson</h2>
        <p>{error}</p>
        <button onClick={onBack} className="error-back-btn">
          Go Back
        </button>
      </div>
    );
  }

  if (!lessonData) {
    return (
      <div className="lesson-page-error">
        <AlertCircle size={48} />
        <h2>Lesson Not Found</h2>
        <p>The lesson you're looking for doesn't exist.</p>
        <button onClick={onBack} className="error-back-btn">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="lesson-page-container">
      <div className="lesson-page-header">
        <button onClick={onBack} className="lesson-back-btn">
          <ArrowLeft size={18} />
          <span>Back</span>
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


