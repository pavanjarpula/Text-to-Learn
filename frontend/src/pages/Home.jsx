import React, { useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useOutletContext } from "react-router-dom";
import { Sparkles, Loader } from "lucide-react";
import ChatPrompt from "../components/ChatPrompt";
import CoursePreview from "../components/CoursePreview";
import "./Home.css";

const Home = () => {
  const [course, setCourse] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  
  // Get context from Layout if needed
  const outletContext = useOutletContext();

  const handleAIResponse = (generatedCourse) => {
    console.log("========== HOME: Course Received ==========");
    console.log("Full course object:", generatedCourse);
    console.log("Title:", generatedCourse?.title);
    console.log("Description:", generatedCourse?.description);
    console.log("Modules count:", generatedCourse?.modules?.length);
    
    if (generatedCourse?.modules?.length > 0) {
      console.log("First module:", generatedCourse.modules[0]);
      console.log("First module lessons:", generatedCourse.modules[0].lessons?.length);
      if (generatedCourse.modules[0].lessons?.length > 0) {
        console.log("First lesson:", generatedCourse.modules[0].lessons[0]);
      }
    }
    console.log("=========================================");

    setCourse(generatedCourse);
    setIsGenerating(false);
    setError(null);
    
    // Smooth scroll to content
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  const handleGenerationStart = () => {
    console.log("Generation started");
    setIsGenerating(true);
    setError(null);
  };

  const handleGenerationError = (errorMsg) => {
    console.error("Generation error in Home:", errorMsg);
    setError(errorMsg);
    setIsGenerating(false);
  };

  const handleClearCourse = () => {
    setCourse(null);
    setError(null);
  };

  return (
    <div className="home-container">
      {/* Hero Header Section */}
      <header className="home-header">
        <div className="header-content">
          <div className="header-badge">
            <Sparkles size={16} />
            <span>AI-Powered Learning</span>
          </div>
          <h1 className="home-title">
            Generate Your Perfect Course in Seconds
          </h1>
          <p className="home-subtitle">
            Simply describe what you want to learn. Our AI creates a structured, 
            personalized course with modules, lessons, and resources—instantly.
          </p>
        </div>
      </header>

      {/* Prompt Input Section - Fixed Position */}
      <section className="prompt-section">
        <div className="prompt-wrapper">
          <ChatPrompt 
            onResponse={handleAIResponse}
            onGenerationStart={handleGenerationStart}
            onError={handleGenerationError}
            isGenerating={isGenerating}
          />
        </div>
      </section>

      {/* Main Content Area */}
      <main className="main-content" ref={contentRef}>
        {/* Error Display */}
        {error && (
          <div className="error-banner">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <div>
                <p className="error-title">Generation Failed</p>
                <p className="error-message">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="error-close"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="loading-container">
            <div className="loading-spinner">
              <Loader size={48} className="spinner-icon" />
            </div>
            <h3 className="loading-title">Creating Your Course</h3>
            <p className="loading-text">
              Our AI is generating modules, lessons, and resources...
            </p>
            <div className="loading-progress">
              <div className="progress-bar"></div>
            </div>
          </div>
        )}

        {/* Course Preview */}
        {!isGenerating && course && (
          <div className="course-container">
            <div className="course-header-action">
              <button 
                onClick={handleClearCourse}
                className="new-course-btn"
              >
                ✕ Create New Course
              </button>
            </div>
            <CoursePreview course={course} />
          </div>
        )}

        {/* Empty State / Placeholder */}
        {!isGenerating && !course && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Sparkles size={64} />
            </div>
            <h2 className="empty-state-title">Ready to Learn Something New?</h2>
            <p className="empty-state-text">
              Enter a topic above to generate a complete, AI-powered course tailored to you.
            </p>
            <div className="empty-state-divider"></div>
            <div className="empty-state-hints">
              <div className="hint">
                <span className="hint-icon">📚</span>
                <span>Try: "Introduction to React Hooks"</span>
              </div>
              <div className="hint">
                <span className="hint-icon">🔬</span>
                <span>Try: "Basics of Machine Learning"</span>
              </div>
              <div className="hint">
                <span className="hint-icon">💡</span>
                <span>Try: "Web3 and Blockchain Essentials"</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Unauthenticated User Banner */}
      {!isAuthenticated && !isGenerating && (
        <div className="auth-banner">
          <div className="auth-banner-content">
            <span className="auth-banner-icon">🔐</span>
            <div className="auth-banner-text">
              <p className="auth-banner-title">Save Your Progress</p>
              <p className="auth-banner-description">
                Sign in to save courses and track your learning journey
              </p>
            </div>
            <button 
              onClick={() => loginWithRedirect()}
              className="auth-banner-btn"
            >
              Sign In Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;


