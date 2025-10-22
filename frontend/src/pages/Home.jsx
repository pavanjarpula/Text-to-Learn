import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Sparkles, Loader, Save, Check } from 'lucide-react';
import ChatPrompt from '../components/ChatPrompt';
import CoursePreview from '../components/CoursePreview';
import LessonRenderer from '../components/LessonRenderer';
import { saveCourse } from '../utils/api';
import './Home.css';

const Home = ({
  activeCourse,
  activeLesson,
  onCourseGenerated,
  onSaveCourse,
  onSelectLesson,
  onBackToCourse,
  onNewCourse,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const handleAIResponse = (generatedCourse) => {
    console.log('Course generated:', generatedCourse);
    onCourseGenerated(generatedCourse);
    setIsGenerating(false);
    setSaved(false);
  };

  const handleSaveCourse = async () => {
    if (!isAuthenticated) {
      alert('Please login to save courses');
      return;
    }

    if (!activeCourse) return;

    try {
      const token = await getAccessTokenSilently();
      await saveCourse(activeCourse, token);
      onSaveCourse(activeCourse);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save course:', err);
      alert('Failed to save course');
    }
  };

  // Show lesson content when lesson is selected
  if (activeLesson) {
    return (
      <div className="home-lesson-view">
        <LessonRenderer
          lesson={activeLesson}
          course={activeCourse}
          onBack={onBackToCourse}
        />
      </div>
    );
  }

  // Show course preview when course is generated
  if (activeCourse) {
    return (
      <div className="home-course-view">
        <div className="course-actions">
          <button onClick={onNewCourse} className="new-course-action-btn">
            ✕ New Course
          </button>
          {isAuthenticated && (
            <button
              onClick={handleSaveCourse}
              className="save-course-btn"
              disabled={saved}
            >
              {saved ? (
                <>
                  <Check size={18} />
                  Saved!
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Course
                </>
              )}
            </button>
          )}
        </div>
        <CoursePreview
          course={activeCourse}
          onLessonSelect={onSelectLesson}
        />
      </div>
    );
  }

  // Show home page with prompt
  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-badge">
          <Sparkles size={16} />
          <span>AI-Powered Learning</span>
        </div>
        <h1 className="home-title">Generate Your Perfect Course</h1>
        <p className="home-subtitle">
          Describe what you want to learn, and our AI creates a structured course with modules and lessons.
        </p>
      </header>

      {/* Prompt Section */}
      <section className="home-prompt-section">
        <ChatPrompt
          onResponse={handleAIResponse}
          onGenerationStart={() => setIsGenerating(true)}
          onError={(err) => setError(err)}
          isGenerating={isGenerating}
        />
      </section>

      {/* Loading State */}
      {isGenerating && (
        <div className="home-loading">
          <Loader size={48} className="spinner" />
          <h3>Creating Your Course</h3>
          <p>Generating modules, lessons, and content...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="home-error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Empty State */}
      {!isGenerating && !error && (
        <div className="home-empty-state">
          <Sparkles size={64} />
          <h2>Ready to Learn Something New?</h2>
          <p>Enter a topic above to generate your personalized course</p>
        </div>
      )}
    </div>
  );
};

export default Home;



