import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Download, BookmarkPlus, Share2, ArrowUp } from "lucide-react";
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
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Use lesson prop first, fallback to component props
  const lessonData = lesson || {};
  const lessonObjectives = lessonData.objectives || objectives;
  const lessonContent = lessonData.content || content;

  // Detect scroll for scroll-to-top button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              onClick={() => setIsSaved(!isSaved)}
              className={`action-btn ${isSaved ? "saved" : ""}`}
              title="Save lesson"
            >
              <BookmarkPlus size={18} />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>
            <button className="action-btn" title="Download as PDF">
              <Download size={18} />
              <span>Download</span>
            </button>
            <button className="action-btn" title="Share lesson">
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="lesson-main-content">
        {/* Objectives Section */}
        {lessonObjectives.length > 0 && (
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
          {lessonContent.length > 0 ? (
            <div className="lesson-content">
              {lessonContent.map((block, idx) => {
                const BlockComponent = blockMap[block.type] || (() => (
                  <div className="invalid-block">
                    <p>Invalid Block Type: {block.type}</p>
                    <pre>{JSON.stringify(block, null, 2)}</pre>
                  </div>
                ));
                return <BlockComponent key={idx} {...block} />;
              })}
            </div>
          ) : (
            <div className="empty-content">
              <p>No content available for this lesson</p>
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
