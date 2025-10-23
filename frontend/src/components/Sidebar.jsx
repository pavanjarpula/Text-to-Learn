
import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, Plus, MessageCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({
  courses,
  activeCourse,
  activeLesson,
  onSelectCourse,
  onSelectLesson,
  onDeleteCourse,
}) => {
  const [expandedCourse, setExpandedCourse] = useState(activeCourse?._id);
  const [expandedModules, setExpandedModules] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleCourse = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNewCourse = () => {
    navigate('/');
    onSelectCourse(null);
  };

  return (
    <div className="sidebar-wrapper">
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* New Course Button */}
        <div className="sidebar-header">
          <button onClick={handleNewCourse} className="new-course-btn" title="New Course">
            <Plus size={20} />
            <span>New Course</span>
          </button>
        </div>

        {/* Courses List */}
        <div className="sidebar-content">
          {courses.length === 0 ? (
            <div className="sidebar-empty">
              <MessageCircle size={32} />
              <p>No courses yet</p>
              <span>Generate your first course!</span>
            </div>
          ) : (
            <div className="sidebar-courses">
              {courses.map((course) => (
                <CourseItem
                  key={course._id}
                  course={course}
                  isActive={activeCourse?._id === course._id}
                  isExpanded={expandedCourse === course._id}
                  expandedModules={expandedModules}
                  activeLesson={activeLesson}
                  onToggleCourse={() => toggleCourse(course._id)}
                  onToggleModule={toggleModule}
                  onSelectCourse={() => onSelectCourse(course)}
                  onSelectLesson={onSelectLesson}
                  onDelete={() => onDeleteCourse(course._id)}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Sidebar Toggle Button */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        title={isCollapsed ? 'Expand' : 'Collapse'}
      >
        <ChevronLeft size={16} style={{
          transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }} />
      </button>
    </div>
  );
};

const CourseItem = ({
  course,
  isActive,
  isExpanded,
  expandedModules,
  activeLesson,
  onToggleCourse,
  onToggleModule,
  onSelectCourse,
  onSelectLesson,
  onDelete,
}) => {
  return (
    <div className={`course-item ${isActive ? 'active' : ''}`}>
      <div className="course-header">
        <button onClick={onToggleCourse} className="course-expand-btn" title="Toggle modules">
          <ChevronDown
            size={16}
            className={isExpanded ? 'rotated' : ''}
          />
        </button>
        <button onClick={onSelectCourse} className="course-title" title={course.title}>
          {course.title}
        </button>
        <button onClick={onDelete} className="course-delete-btn" title="Delete course">
          <X size={16} />
        </button>
      </div>

      {isExpanded && course.modules && (
        <div className="modules-list">
          {course.modules.map((module, idx) => (
            <ModuleItem
              key={module._id}
              module={module}
              moduleIndex={idx}
              isExpanded={expandedModules[module._id]}
              activeLesson={activeLesson}
              onToggle={() => onToggleModule(module._id)}
              onSelectLesson={onSelectLesson}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ModuleItem = ({
  module,
  moduleIndex,
  isExpanded,
  activeLesson,
  onToggle,
  onSelectLesson,
}) => {
  return (
    <div className="module-item">
      <button onClick={onToggle} className="module-header" title={module.title}>
        <ChevronDown
          size={14}
          className={isExpanded ? 'rotated' : ''}
        />
        <span className="module-number">{String(moduleIndex + 1).padStart(2, '0')}</span>
        <span className="module-title">{module.title}</span>
      </button>

      {isExpanded && module.lessons && (
        <div className="lessons-list">
          {module.lessons.map((lesson, idx) => (
            <button
              key={lesson._id}
              onClick={() => onSelectLesson(lesson)}
              className={`lesson-item ${
                activeLesson?._id === lesson._id ? 'active' : ''
              }`}
              title={lesson.title}
            >
              <span className="lesson-number">{idx + 1}</span>
              <span className="lesson-title">{lesson.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
