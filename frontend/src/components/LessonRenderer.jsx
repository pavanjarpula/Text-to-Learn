import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  BookmarkPlus,
  Share2,
  ArrowUp,
  Check,
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  saveLessonWithContext,
  markLessonComplete,
} from "../utils/api";

// Import all block components
import HeadingBlock from "./blocks/HeadingBlock";
import ParagraphBlock from "./blocks/ParagraphBlock";
import CodeBlock from "./blocks/CodeBlock";
import VideoBlock from "./blocks/VideoBlock";
import MCQBlock from "./blocks/MCQBlock";

import HinglishTranslator from "./HinglishTranslator";
import PDFExporter from "./PDFExporter";

import "./LessonRenderer.css";

const blockMap = {
  heading: HeadingBlock,
  paragraph: ParagraphBlock,
  code: CodeBlock,
  video: VideoBlock,
  mcq: MCQBlock,
};

const LessonRenderer = ({
  lesson,
  module,
  course,
  moduleIdx = 0,
  lessonIdx = 0,
  totalLessons = 1,
  onPrevious,
  onNext,
  objectives = [],
  content = [],
  onLessonSaved = () => {},
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  // Use lesson prop first, fallback to component props
  const lessonData = useMemo(() => lesson || {}, [lesson]);
  const lessonObjectives = useMemo(
    () => lessonData.objectives || objectives,
    [lessonData.objectives, objectives]
  );
  const lessonContent = useMemo(
    () => lessonData.content || content,
    [lessonData.content, content]
  );

  // Detect scroll for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔧 FIXED: Handle save lesson with correct endpoint
  const handleSaveLesson = async () => {
    if (!isAuthenticated) {
      alert("Please login to save lessons");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const token = await getAccessTokenSilently();

      console.log("💾 Saving lesson:", {
        title: lessonData.title,
        course: course?.title,
        module: module?.title,
      });

      // Save lesson with course and module context
      const result = await saveLessonWithContext(
        lessonData,
        course?.title || "Unknown Course",
        module?.title || "Unknown Module",
        token
      );

      console.log("✅ Lesson saved successfully:", result._id);
      setIsSaved(true);

      // Try to mark as complete
      try {
        if (lessonData._id) {
          await markLessonComplete(lessonData._id, token);
          console.log("✅ Lesson marked as complete");
        }
      } catch (progressErr) {
        console.warn("Could not mark lesson as complete:", progressErr);
      }

      onLessonSaved(lessonData);

      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      console.error("❌ Error saving lesson:", err);
      setSaveError(err.message || "Failed to save lesson");
      alert("Failed to save lesson: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle share
  const handleShare = () => {
    alert("Share feature coming soon!");
  };

  // 🔧 FIXED: Navigation handlers that properly call parent callbacks
  const handlePreviousClick = () => {
    console.log("⬅️ Previous button clicked");
    console.log("Can go previous:", lessonIdx > 0);
    if (onPrevious && typeof onPrevious === "function") {
      onPrevious();
    }
  };

  const handleNextClick = () => {
    console.log("➡️ Next button clicked");
    console.log("Can go next:", lessonIdx < totalLessons - 1);
    if (onNext && typeof onNext === "function") {
      onNext();
    }
  };

  // Check if we can navigate
  const canGoPrevious = lessonIdx > 0;
  const canGoNext = lessonIdx < totalLessons - 1;

  console.log("🔍 LessonRenderer state:", {
    lessonIdx,
    totalLessons,
    canGoPrevious,
    canGoNext,
    hasOnPrevious: !!onPrevious,
    hasOnNext: !!onNext,
  });

  return (
    <div className="lesson-renderer-container">
      {/* Lesson Header */}
      <header className="lesson-header">
        <div className="lesson-header-content">
          <div className="lesson-breadcrumb">
            {course && (
              <>
                <span className="breadcrumb-item">{course.title}</span>
                <span className="breadcrumb-separator">/</span>
              </>
            )}
            {module && (
              <>
                <span className="breadcrumb-item">{module.title}</span>
                <span className="breadcrumb-separator">/</span>
              </>
            )}
            <span className="breadcrumb-current">
              {lessonData.title || "Lesson"}
            </span>
          </div>

          <h1 className="lesson-title">{lessonData.title}</h1>

          {/* Lesson Actions */}
          <div className="lesson-header-actions">
            <button
              onClick={handleSaveLesson}
              disabled={isSaving || isSaved}
              className={`action-btn ${isSaved ? "saved" : ""} ${
                isSaving ? "loading" : ""
              }`}
              title={
                isSaving
                  ? "Saving..."
                  : isSaved
                  ? "Saved!"
                  : "Save this lesson"
              }
            >
              {isSaved ? (
                <>
                  <Check size={18} />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <BookmarkPlus size={18} />
                  <span>{isSaving ? "Saving..." : "Save"}</span>
                </>
              )}
            </button>

            <PDFExporter
              lesson={lessonData}
              courseInfo={{
                courseName: course?.title || "Course",
                moduleName: module?.title || "Module",
              }}
              lessonId={lessonData._id}
            />

            <button
              onClick={handleShare}
              className="action-btn"
              title="Share lesson"
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div>

          {saveError && (
            <div className="save-error-message">Error: {saveError}</div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="lesson-main-content">
        {/* Objectives Section */}
        {lessonObjectives && lessonObjectives.length > 0 && (
          <section className="objectives-section">
            <h2 className="section-title">📚 What You'll Learn</h2>
            <div className="objectives-grid">
              {lessonObjectives.map((obj, idx) => (
                <div key={idx} className="objective-card">
                  <span className="objective-checkmark">✓</span>
                  <p>{obj}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hinglish Translation Section */}
        <section className="hinglish-section">
          <HinglishTranslator lesson={lessonData} />
        </section>

        {/* Content Blocks */}
        <section className="content-section">
          {lessonContent && lessonContent.length > 0 ? (
            <div className="lesson-content">
              {lessonContent.map((block, idx) => {
                const BlockComponent = blockMap[block.type] || (() => (
                  <div className="invalid-block">
                    <p>Block Type: {block.type}</p>
                  </div>
                ));

                return <BlockComponent key={idx} {...block} />;
              })}
            </div>
          ) : (
            <div className="empty-content">
              <p>📝 No content available for this lesson yet.</p>
            </div>
          )}
        </section>
      </main>

      {/* Navigation Footer */}
      <footer className="lesson-footer">
        <div className="lesson-navigation">
          {/* Previous Button */}
          <button
            onClick={handlePreviousClick}
            disabled={!canGoPrevious}
            className="nav-btn prev-btn"
            title={canGoPrevious ? "Previous lesson" : "First lesson"}
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>

          {/* Progress Indicator */}
          <div className="lesson-progress">
            <span className="progress-text">
              Lesson {lessonIdx + 1} of {totalLessons}
            </span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((lessonIdx + 1) / totalLessons) * 100}%` }}
              />
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextClick}
            disabled={!canGoNext}
            className="nav-btn next-btn"
            title={canGoNext ? "Next lesson" : "Last lesson"}
          >
            <span>Next</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top-btn"
          title="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default LessonRenderer;