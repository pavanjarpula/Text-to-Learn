import React, { useState } from "react";
import { ChevronDown, BookOpen, Clock, Zap } from "lucide-react";
import "./CoursePreview.css";

const CoursePreview = ({ course, onLessonSelect }) => {
  const [expandedModules, setExpandedModules] = useState({});
  const [selectedLesson, setSelectedLesson] = useState(null); // ✅ Track selected lesson

  if (!course) {
    console.warn("CoursePreview: No course prop received");
    return null;
  }

  const modules = Array.isArray(course.modules) ? course.modules : [];

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const totalLessons = modules.reduce(
    (sum, mod) => sum + (Array.isArray(mod.lessons) ? mod.lessons.length : 0),
    0
  );

  return (
    <div className="course-preview-container">
      {/* Course Header */}
      <div className="course-preview-header">
        <div className="course-header-content">
          <div className="course-badge">
            <Zap size={16} />
            AI-Generated Course
          </div>
          <h1 className="course-preview-title">{course.title}</h1>
          <p className="course-preview-description">{course.description}</p>

          {/* Course Stats */}
          <div className="course-stats">
            <div className="stat-item">
              <BookOpen size={18} />
              <span>{modules.length} Modules</span>
            </div>
            <div className="stat-item">
              <Clock size={18} />
              <span>{totalLessons} Lessons</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="course-modules-container">
        {modules && modules.length > 0 ? (
          <div className="modules-list">
            {modules.map((module, moduleIdx) => {
              const moduleId = module._id || `module-${moduleIdx}`;
              const lessons = Array.isArray(module.lessons) ? module.lessons : [];

              return (
                <div key={moduleId} className="module-card">
                  {/* Module Header */}
                  <button
                    onClick={() => toggleModule(moduleId)}
                    className="module-header-btn"
                  >
                    <div className="module-header-left">
                      <span className="module-number">
                        {String(moduleIdx + 1).padStart(2, "0")}
                      </span>
                      <div className="module-header-text">
                        <h3 className="module-title">{module.title}</h3>
                        <span className="module-lesson-count">
                          {lessons.length} lessons
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`module-chevron ${
                        expandedModules[moduleId] ? "expanded" : ""
                      }`}
                    />
                  </button>

                  {/* Lessons - Expandable */}
                  {expandedModules[moduleId] && (
                    <div className="lessons-container">
                      {lessons && lessons.length > 0 ? (
                        <ul className="lessons-list">
                          {lessons.map((lesson, lessonIdx) => (
                            <li
                              key={lesson._id || `lesson-${lessonIdx}`}
                              className="lesson-item"
                            >
                              <button
                                onClick={() => {
                                  onLessonSelect?.({
                                    lesson,
                                    module,
                                    lessonIdx,
                                    moduleIdx,
                                  });
                                  setSelectedLesson(lesson); // ✅ show locally
                                }}
                                className="lesson-button"
                              >
                                <span className="lesson-index">
                                  {lessonIdx + 1}
                                </span>
                                <span className="lesson-title">
                                  {lesson.title}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="no-lessons">No lessons in this module</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-modules">
            <BookOpen size={40} />
            <p>No modules in this course</p>
          </div>
        )}
      </div>

      {/* ✅ Selected Lesson Display (safe render) */}
      {selectedLesson && (
        <div className="selected-lesson-view">
          <h2 className="selected-lesson-title">{selectedLesson.title}</h2>
          <p className="selected-lesson-content">
            {typeof selectedLesson.content === "string"
              ? selectedLesson.content
              : selectedLesson.content?.text || "No content available."}
          </p>
        </div>
      )}
    </div>
  );
};

export default CoursePreview;




