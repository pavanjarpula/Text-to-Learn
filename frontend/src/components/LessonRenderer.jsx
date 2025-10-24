import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Download, BookmarkPlus, Share2, ArrowUp, Check } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { saveLesson, markLessonComplete } from "../utils/api";
import HeadingBlock from "./blocks/HeadingBlock";
import ParagraphBlock from "./blocks/ParagraphBlock";
import CodeBlock from "./blocks/CodeBlock";
import VideoBlock from "./blocks/VideoBlock";
import MCQBlock from "./blocks/MCQBlock";
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
  moduleIdx,
  lessonIdx,
  onPrevious,
  onNext,
  objectives = [],
  content = [],
  onLessonSaved = () => {}, // Callback when lesson is saved
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

  // Debug logging
  useEffect(() => {
    console.group("LessonRenderer Debug Info");
    console.log("Lesson Data:", lessonData);
    console.log("Module:", module);
    console.log("Course:", course);
    console.log("Objectives:", lessonObjectives);
    console.log("Content Array:", lessonContent);
    console.log("Content Length:", lessonContent?.length || 0);
    console.groupEnd();
  }, [lessonData, module, course, lessonObjectives, lessonContent]);

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

  // Handle save lesson
  const handleSaveLesson = async () => {
    if (!isAuthenticated) {
      alert("Please login to save lessons");
      return;
    }

    if (!lessonData._id) {
      alert("Lesson ID not found");
      return;
    }

    if (!module?._id) {
      alert("Module ID not found");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const token = await getAccessTokenSilently();
      
      console.log("Saving lesson:", {
        lessonId: lessonData._id,
        lessonTitle: lessonData.title,
        moduleId: module._id,
        moduleName: module.title,
      });

      // Save the lesson
      const result = await saveLesson(module._id, lessonData, token);
      
      console.log("Lesson saved successfully:", result);
      setIsSaved(true);
      
      // Also mark as complete (progress tracking)
      try {
        await markLessonComplete(lessonData._id, token);
      } catch (progressErr) {
        console.warn("Could not mark lesson as complete:", progressErr);
        // Don't fail the save if progress tracking fails
      }

      // Call parent callback
      onLessonSaved(lessonData);

      // Reset saved state after 2 seconds
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      console.error("Error saving lesson:", err);
      setSaveError(err.message || "Failed to save lesson");
      alert("Failed to save lesson: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle download (placeholder)
  const handleDownload = () => {
    alert("Download feature coming soon!");
  };

  // Handle share (placeholder)
  const handleShare = () => {
    alert("Share feature coming soon!");
  };

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
            <span className="breadcrumb-current">{lessonData.title || "Lesson"}</span>
          </div>

          <h1 className="lesson-title">{lessonData.title}</h1>

          {/* Lesson Actions */}
          <div className="lesson-header-actions">
            <button
              onClick={handleSaveLesson}
              disabled={isSaving || isSaved}
              className={`action-btn ${isSaved ? "saved" : ""} ${isSaving ? "loading" : ""}`}
              title={isSaving ? "Saving..." : isSaved ? "Saved!" : "Save lesson"}
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

            <button
              onClick={handleDownload}
              className="action-btn"
              title="Download as PDF"
            >
              <Download size={18} />
              <span>Download</span>
            </button>

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
            <div className="save-error-message">
              Error: {saveError}
            </div>
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

        {/* Content Blocks */}
        <section className="content-section">
          {lessonContent && lessonContent.length > 0 ? (
            <div className="lesson-content">
              {lessonContent.map((block, idx) => {
                const BlockComponent = blockMap[block.type] || (() => (
                  <div className="invalid-block">
                    <p>Block Type: {block.type}</p>
                    {process.env.NODE_ENV === "development" && (
                      <pre>{JSON.stringify(block, null, 2)}</pre>
                    )}
                  </div>
                ));
                return <BlockComponent key={idx} {...block} />;
              })}
            </div>
          ) : (
            <div className="empty-content">
              <p>📝 No content available for this lesson yet.</p>
              <p className="empty-hint">Check back soon as content is being generated.</p>
            </div>
          )}
        </section>
      </main>

      {/* Navigation Footer */}
      <footer className="lesson-footer">
        <div className="lesson-navigation">
          <button
            onClick={onPrevious}
            disabled={!onPrevious}
            className="nav-btn prev-btn"
            title="Previous lesson"
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>

          <div className="lesson-progress">
            <span className="progress-text">
              Lesson {(lessonIdx || 0) + 1}
            </span>
            <div className="progress-dots">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`dot ${i === (lessonIdx || 0) ? "active" : ""}`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={onNext}
            disabled={!onNext}
            className="nav-btn next-btn"
            title="Next lesson"
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