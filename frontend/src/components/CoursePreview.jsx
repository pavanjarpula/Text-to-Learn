// src/components/CoursePreview.jsx
import React from "react";
import { Link } from "react-router-dom"; // 👈 Import Link

const CoursePreview = ({ course }) => {
  if (!course) return null;

  return (
    <div className="course-card">
      <h2>{course.title}</h2>
      <p>{course.description}</p>

      {course.modules && course.modules.length > 0 && (
        <div className="module-list">
          {course.modules.map((mod, idx) => (
            <div key={mod._id} className="module-item">
              <div className="module-index">{idx + 1}</div>
              <div>
                <div className="module-name">{mod.title}</div>
                {mod.lessons && mod.lessons.length > 0 && (
                  <ul className="module-topic">
                    {mod.lessons.map((lesson) => (
                      <li key={lesson._id}>
                        {/* 👈 Change this line to be a clickable link */}
                        <Link 
                            to={`/lesson/${lesson._id}`} 
                            className="lesson-link" 
                            // This link will take the user to the LessonPage
                        >
                            {lesson.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursePreview;


