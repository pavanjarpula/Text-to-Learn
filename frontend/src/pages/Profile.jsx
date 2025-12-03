// src/pages/Profile.jsx - COMPLETE UPDATE

import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  getUserCourses,
  deleteCourseById,
  getUserSavedLessons,
  deleteLessonById,
} from "../utils/api";
import {
  Trash2,
  Eye,
  LogOut,
  Settings,
  BookOpen,
  Clock,
  Zap,
  AlertCircle,
  BookmarkCheck,
} from "lucide-react";
import "./Profile.css";

const ProfilePage = ({ onSelectCourse, onSelectLesson }) => {
  const { user, isAuthenticated, logout, getAccessTokenSilently } = useAuth0();

  const [courses, setCourses] = useState([]);
  const [savedLessons, setSavedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [showSavedLessons, setShowSavedLessons] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = await getAccessTokenSilently();

        // Fetch saved courses
        console.log("📚 Profile - Fetching saved courses...");
        const coursesData = await getUserCourses(token);
        setCourses(coursesData || []);

        // Fetch saved lessons
        console.log("📖 Profile - Fetching saved lessons...");
        const lessonsData = await getUserSavedLessons(token);
        setSavedLessons(lessonsData || []);

        console.log("✅ Profile - User data loaded:", {
          courses: coursesData?.length,
          lessons: lessonsData?.length,
        });
      } catch (err) {
        console.error("❌ Profile - Error loading user data:", err);
        setError(err.message || "Failed to load your data");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, getAccessTokenSilently]);

  // Handle delete course
  const handleDeleteCourse = async (courseId) => {
    setDeleting(courseId);
    try {
      const token = await getAccessTokenSilently();
      await deleteCourseById(courseId, token);
      setCourses(courses.filter((c) => c._id !== courseId));
      setDeleteConfirm(null);
      console.log("✅ Course deleted");
    } catch (err) {
      console.error("❌ Error deleting course:", err);
      setError("Failed to delete course");
    } finally {
      setDeleting(null);
    }
  };

  // Handle delete lesson
  const handleDeleteLesson = async (lessonId) => {
    setDeleting(lessonId);
    try {
      const token = await getAccessTokenSilently();
      await deleteLessonById(lessonId, token);
      setSavedLessons(savedLessons.filter((l) => l._id !== lessonId));
      setDeleteConfirm(null);
      console.log("✅ Lesson deleted");
    } catch (err) {
      console.error("❌ Error deleting lesson:", err);
      setError("Failed to delete lesson");
    } finally {
      setDeleting(null);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  // Handle view saved course
  const handleViewCourse = (course) => {
    console.log("👁️ Viewing course:", course.title);
    if (onSelectCourse && typeof onSelectCourse === "function") {
      onSelectCourse(course);
    }
  };

  // Handle view saved lesson
  const handleViewLesson = (lesson) => {
    console.log("👁️ Viewing lesson:", lesson.title);

    if (onSelectLesson && typeof onSelectLesson === "function") {
      onSelectLesson({
        lesson,
        module: {
          _id: "virtual",
          title: lesson.moduleName || "Module",
          lessons: [lesson],
        },
        course: {
          _id: "virtual",
          title: lesson.courseTitle || "Course",
        },
        moduleIdx: 0,
        lessonIdx: 0,
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="profile-page-auth-required">
        <AlertCircle size={48} />
        <h2>Authentication Required</h2>
        <p>Please log in to view and manage your profile</p>
      </div>
    );
  }

  const totalLessons = courses.reduce(
    (sum, course) =>
      sum +
      (course.modules?.reduce(
        (mSum, m) => mSum + (m.lessons?.length || 0),
        0
      ) || 0),
    0
  );

  return (
    <div className="profile-page-container">
      {/* Error Banner */}
      {error && (
        <div className="profile-error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="error-close">
            ✕
          </button>
        </div>
      )}

      {/* Profile Header */}
      <header className="profile-header">
        <div className="profile-header-content">
          {/* Avatar Section */}
          <div className="profile-avatar-section">
            <img
              src={
                user?.picture || "https://api.dicebear.com/7.x/avataaars/svg"
              }
              alt={user?.name || "User"}
              className="profile-avatar"
              onError={(e) => {
                e.target.src =
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=default";
              }}
            />
            <div className="profile-user-info">
              <h1 className="profile-user-name">
                {user?.name || user?.nickname || "User"}
              </h1>
              <p className="profile-user-email">{user?.email}</p>
              <p className="profile-user-id">
                ID: {user?.sub?.substring(0, 12)}...
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="profile-header-actions">
            {/* Saved Lessons Toggle Button */}
            <button
              onClick={() => setShowSavedLessons(!showSavedLessons)}
              className={`action-btn saved-lessons-btn ${
                showSavedLessons ? "active" : ""
              }`}
              title="View saved lessons"
            >
              <BookmarkCheck size={18} />
              <span>Saved Lessons ({savedLessons.length})</span>
            </button>

            <button
              onClick={() => {}}
              className="action-btn settings-btn"
              title="Settings (coming soon)"
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>

            <button
              onClick={handleLogout}
              className="action-btn logout-btn"
              title="Logout"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="profile-stats">
          <div className="stat-card">
            <BookOpen size={20} />
            <div>
              <p className="stat-label">Courses</p>
              <p className="stat-value">{courses.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <Clock size={20} />
            <div>
              <p className="stat-label">Lessons</p>
              <p className="stat-value">{totalLessons}</p>
            </div>
          </div>
          <div className="stat-card">
            <Zap size={20} />
            <div>
              <p className="stat-label">Saved</p>
              <p className="stat-value">{savedLessons.length}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="profile-main">
        {/* Saved Lessons Section */}
        {showSavedLessons && (
          <section className="profile-saved-lessons-section">
            <div className="section-header">
              <h2>
                <BookmarkCheck size={20} />
                Your Saved Lessons
              </h2>
              <span className="lesson-count">{savedLessons.length}</span>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading saved lessons...</p>
              </div>
            ) : savedLessons.length === 0 ? (
              <div className="empty-state">
                <BookmarkCheck size={48} />
                <h3>No Saved Lessons Yet</h3>
                <p>Save lessons from courses to access them here</p>
              </div>
            ) : (
              <div className="saved-lessons-grid">
                {savedLessons.map((lesson) => (
                  <SavedLessonCard
                    key={lesson._id}
                    lesson={lesson}
                    onView={() => handleViewLesson(lesson)}
                    onDelete={() => {
                      setDeleteConfirm(lesson._id);
                      setDeleteType("lesson");
                    }}
                    isDeleting={deleting === lesson._id}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Saved Courses Section */}
        <section className="profile-courses-section">
          <div className="section-header">
            <h2>
              <BookOpen size={20} />
              Your Courses
            </h2>
            <span className="course-count">{courses.length}</span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={48} />
              <h3>No Courses Yet</h3>
              <p>Generate your first AI-powered course to get started</p>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onView={() => handleViewCourse(course)}
                  onDelete={() => {
                    setDeleteConfirm(course._id);
                    setDeleteType("course");
                  }}
                  isDeleting={deleting === course._id}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>
              Delete {deleteType === "course" ? "Course" : "Lesson"}?
            </h3>
            <p>
              Are you sure you want to delete this{" "}
              {deleteType === "course" ? "course" : "lesson"}? This action
              cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => {
                  setDeleteConfirm(null);
                  setDeleteType(null);
                }}
                className="modal-btn cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteType === "course") {
                    handleDeleteCourse(deleteConfirm);
                  } else {
                    handleDeleteLesson(deleteConfirm);
                  }
                }}
                disabled={deleting === deleteConfirm}
                className="modal-btn delete-btn"
              >
                {deleting === deleteConfirm
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Course Card Component
 */
const CourseCard = ({ course, onView, onDelete, isDeleting }) => {
  const moduleCount = course.modules?.length || 0;
  const lessonCount =
    course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;

  return (
    <div className="course-card">
      <div className="course-card-header">
        <h3 className="course-card-title">{course.title}</h3>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="card-delete-btn"
          title="Delete course"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <p className="course-card-description">{course.description}</p>

      <div className="course-card-tags">
        {course.tags && course.tags.length > 0 ? (
          course.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))
        ) : (
          <span className="tag default-tag">AI-Generated</span>
        )}
        {course.tags && course.tags.length > 3 && (
          <span className="tag more-tag">+{course.tags.length - 3}</span>
        )}
      </div>

      <div className="course-card-stats">
        <div className="card-stat">
          <BookOpen size={14} />
          <span>{moduleCount} Modules</span>
        </div>
        <div className="card-stat">
          <Clock size={14} />
          <span>{lessonCount} Lessons</span>
        </div>
      </div>

      <button onClick={onView} className="course-card-btn">
        <Eye size={16} />
        <span>View Course</span>
      </button>
    </div>
  );
};

/**
 * Saved Lesson Card Component
 */
const SavedLessonCard = ({ lesson, onView, onDelete, isDeleting }) => {
  return (
    <div className="saved-lesson-card">
      <div className="saved-lesson-header">
        <div className="saved-lesson-info">
          <h3 className="saved-lesson-title">{lesson.title}</h3>
          <p className="saved-lesson-course">{lesson.courseTitle}</p>
          {lesson.moduleName && (
            <p className="saved-lesson-module">📖 {lesson.moduleName}</p>
          )}
        </div>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="lesson-delete-btn"
          title="Delete lesson"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {lesson.objectives && lesson.objectives.length > 0 && (
        <div className="saved-lesson-objectives">
          <strong>Learning Goals:</strong>
          <ul>
            {lesson.objectives.slice(0, 2).map((obj, idx) => (
              <li key={idx}>{obj}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="saved-lesson-stats">
        <span className="stat">📝 {lesson.content?.length || 0} blocks</span>
        <span className="stat">
          ⏰ {new Date(lesson.createdAt).toLocaleDateString()}
        </span>
      </div>

      <button onClick={onView} className="saved-lesson-btn">
        <Eye size={16} />
        <span>View Lesson</span>
      </button>
    </div>
  );
};

export default ProfilePage;