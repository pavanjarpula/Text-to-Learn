import React, { useState } from "react";
import { ArrowLeft, BookOpen, Clock, Zap } from "lucide-react";
import CoursePreview from "../components/CoursePreview";
import LessonRenderer from "../components/LessonRenderer";
import "./Course.css";

const CoursePage = ({ course = null, onBack }) => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  if (!course) {
    return (
      <div className="course-page-empty">
        <div className="empty-state">
          <BookOpen size={64} />
          <h2>No Course Selected</h2>
          <p>Select a course from the sidebar or generate a new one</p>
          <button onClick={onBack} className="back-to-home-btn">
            <ArrowLeft size={18} />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleLessonSelect = (data) => {
    setSelectedLesson(data.lesson);
    setSelectedModule(data.module);
  };

  const handleBackToCourse = () => {
    setSelectedLesson(null);
    setSelectedModule(null);
  };

  const handleNextLesson = () => {
    if (!selectedModule || !selectedLesson) return;
    
    const currentLessonIndex = selectedModule.lessons?.findIndex(
      (l) => l._id === selectedLesson._id
    );
    
    if (currentLessonIndex !== undefined && currentLessonIndex < selectedModule.lessons.length - 1) {
      const nextLesson = selectedModule.lessons[currentLessonIndex + 1];
      setSelectedLesson(nextLesson);
    }
  };

  const handlePreviousLesson = () => {
    if (!selectedModule || !selectedLesson) return;
    
    const currentLessonIndex = selectedModule.lessons?.findIndex(
      (l) => l._id === selectedLesson._id
    );
    
    if (currentLessonIndex !== undefined && currentLessonIndex > 0) {
      const prevLesson = selectedModule.lessons[currentLessonIndex - 1];
      setSelectedLesson(prevLesson);
    }
  };

  // If lesson is selected, show lesson renderer
  if (selectedLesson) {
    return (
      <div className="course-page-container">
        <button onClick={handleBackToCourse} className="back-to-course-btn">
          <ArrowLeft size={18} />
          <span>Back to Course Overview</span>
        </button>

        <LessonRenderer
          lesson={selectedLesson}
          module={selectedModule}
          course={course}
          moduleIdx={course.modules?.findIndex(m => m._id === selectedModule._id) || 0}
          lessonIdx={selectedModule.lessons?.findIndex(l => l._id === selectedLesson._id) || 0}
          onPrevious={handlePreviousLesson}
          onNext={handleNextLesson}
          objectives={selectedLesson.objectives || []}
          content={selectedLesson.content || []}
        />
      </div>
    );
  }

  // Otherwise show course preview
  return (
    <div className="course-page-container">
      <div className="course-page-header-bar">
        <button onClick={onBack} className="back-to-home-btn-small">
          <ArrowLeft size={18} />
          <span>Home</span>
        </button>
        
        <div className="course-page-stats">
          <div className="stat">
            <BookOpen size={16} />
            <span>{course.modules?.length || 0} Modules</span>
          </div>
          <div className="stat">
            <Clock size={16} />
            <span>
              {course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0} Lessons
            </span>
          </div>
          <div className="stat">
            <Zap size={16} />
            <span>AI Generated</span>
          </div>
        </div>
      </div>

      <CoursePreview 
        course={course} 
        onLessonSelect={handleLessonSelect}
      />
    </div>
  );
};

export default CoursePage;








