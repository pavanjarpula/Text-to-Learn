// src/components/CoursePreview.jsx
import React from "react";

const CoursePreview = ({ course }) => {
  if (!course) return null;

  return (
    <div className="course-card">
      <h2>{course.title}</h2>
      <p>{course.description}</p>

      {course.modules && course.modules.length > 0 && (
        <div className="module-list">
          {course.modules.map((mod, idx) => (
            <div key={idx} className="module-item">
              <div className="module-index">{idx + 1}</div>
              <div>
                <div className="module-name">{mod.title}</div>
                {mod.lessons && mod.lessons.length > 0 && (
                  <ul className="module-topic">
                    {mod.lessons.map((lesson, i) => (
                      <li key={i}>{lesson}</li>
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


