import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseById } from "../utils/api";
import LessonRenderer from "../components/LessonRenderer";

const CoursePage = () => {
  const { id } = useParams(); // courseId
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(id);
        setCourse(data);
      } catch (err) {
        console.error("❌ Error fetching course:", err);
      }
    };
    fetchCourse();
  }, [id]);

  if (!course) return <div className="p-6">Loading course...</div>;

  return (
    <div className="p-6 space-y-6">
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        ← Back to Courses
      </Link>

      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p className="text-gray-700">{course.description}</p>

      {course.modules?.length > 0 ? (
        <div className="space-y-8">
          {course.modules.map((mod, idx) => (
            <div
              key={mod._id}
              className="p-4 border rounded-lg shadow-md bg-white"
            >
              <h2 className="text-xl font-semibold mb-2">
                {idx + 1}. {mod.title}
              </h2>

              {mod.lessons?.length > 0 ? (
                <div className="ml-6 space-y-6">
                  {mod.lessons.map((lesson) => (
                    <div key={lesson._id} className="p-3 border rounded-md bg-gray-50">
                      <h3 className="text-lg font-medium mb-2">{lesson.title}</h3>
                      {lesson.content?.length > 0 ? (
                        <LessonRenderer content={lesson.content} />
                      ) : (
                        <p className="text-gray-500">No content available.</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="ml-6 text-gray-500">No lessons found.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No modules found.</p>
      )}
    </div>
  );
};

export default CoursePage;




