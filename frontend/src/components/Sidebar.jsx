import React, { useState } from 'react';
import { ChevronDown, Plus, Home, LogOut, Settings, Trash2, ChevronLeft, ChevronRight, MessageCircle, BookOpen } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import './Sidebar.css';

const Sidebar = ({ onSelectLesson }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);
  const [courses, setCourses] = useState([]);
  const { isAuthenticated, logout } = useAuth0();

  const toggleCourseExpand = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const toggleModuleExpand = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const handleNewChat = () => {
    // Clear state or redirect to home
    setExpandedCourse(null);
    setExpandedModule(null);
  };

  const handleDeleteCourse = (courseId) => {
    setCourses(courses.filter(c => c._id !== courseId));
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sidebar-toggle"
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      {/* Sidebar Container */}
      <aside className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
        
        {/* New Course Button */}
        {isAuthenticated && (
          <div className="sidebar-header">
            <button
              onClick={handleNewChat}
              className="sidebar-new-btn"
            >
              <Plus size={18} />
              <span>New Course</span>
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          <NavItem icon={<Home size={18} />} label="Home" />
          {isAuthenticated && (
            <NavItem icon={<BookOpen size={18} />} label="Saved Courses" />
          )}
        </nav>

        {/* Courses Section */}
        {isAuthenticated && (
          <div className="sidebar-courses-section">
            <div className="sidebar-section-header">
              <MessageCircle size={14} />
              <span>Recent Courses</span>
            </div>

            {/* Courses List */}
            <div className="sidebar-courses-list">
              {courses && courses.length > 0 ? (
                courses.map((course) => (
                  <CourseItem
                    key={course._id}
                    course={course}
                    isExpanded={expandedCourse === course._id}
                    onToggleExpand={() => toggleCourseExpand(course._id)}
                    onDelete={() => handleDeleteCourse(course._id)}
                    expandedModule={expandedModule}
                    onToggleModule={() => toggleModuleExpand(expandedModule === course._id ? null : course._id)}
                    onSelectLesson={onSelectLesson}
                  />
                ))
              ) : (
                <div className="sidebar-empty">
                  <MessageCircle size={24} />
                  <p>No courses yet</p>
                  <p>Create one to get started!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Section */}
        {isAuthenticated && (
          <div className="sidebar-footer">
            <NavItem icon={<Settings size={18} />} label="Settings" />
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="sidebar-logout-btn"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

// Course Item Component
const CourseItem = ({
  course,
  isExpanded,
  onToggleExpand,
  onDelete,
  expandedModule,
  onToggleModule,
  onSelectLesson,
}) => {
  return (
    <div className="sidebar-course-item">
      <div className="sidebar-course-header">
        {course.modules && course.modules.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="sidebar-expand-btn"
          >
            <ChevronDown
              size={14}
              className={isExpanded ? 'expanded' : ''}
            />
          </button>
        )}

        <button className="sidebar-course-title">
          {course.title}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="sidebar-delete-btn"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Modules */}
      {isExpanded && course.modules && course.modules.length > 0 && (
        <div className="sidebar-modules">
          {course.modules.map((module) => (
            <ModuleItem
              key={module._id}
              module={module}
              isExpanded={expandedModule === module._id}
              onToggleExpand={() => onToggleModule()}
              onSelectLesson={onSelectLesson}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Module Item Component
const ModuleItem = ({ module, isExpanded, onToggleExpand, onSelectLesson }) => {
  return (
    <div className="sidebar-module-item">
      <button
        onClick={onToggleExpand}
        className="sidebar-module-header"
      >
        <ChevronDown
          size={12}
          className={isExpanded ? 'expanded' : ''}
        />
        <span>{module.title}</span>
      </button>

      {/* Lessons */}
      {isExpanded && module.lessons && module.lessons.length > 0 && (
        <div className="sidebar-lessons">
          {module.lessons.map((lesson, idx) => (
            <button
              key={lesson._id}
              onClick={() => onSelectLesson(lesson)}
              className="sidebar-lesson-item"
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

// Nav Item Component
const NavItem = ({ icon, label }) => (
  <button className="sidebar-nav-item">
    {icon}
    <span>{label}</span>
  </button>
);

export default Sidebar;
