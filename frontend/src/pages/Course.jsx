// src/pages/Course.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";


const Course = () => {
  const { id } = useParams(); // course id
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

  if (!course) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="mb-4">{course.description}</p>

      {course.modules && course.modules.length > 0 ? (
        <div className="space-y-6">
          {course.modules.map((mod, mi) => (
            <div key={mod._id} className="border p-4 rounded">
              <h2 className="text-2xl font-semibold">{mod.title}</h2>
              {mod.lessons && mod.lessons.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {mod.lessons.map((lesson, li) => (
                    <li key={lesson._id} className="flex justify-between items-center">
                      <div>
                        <strong>{lesson.title}</strong>
                        <div className="text-sm text-gray-600">{(lesson.objectives || []).join(", ")}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                          onClick={() => navigate(`/courses/${id}/module/${mi}/lesson/${li}`)}
                        >
                          Open
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-600 mt-2">No lessons</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>No modules yet.</div>
      )}
    </div>
  );
};

export default Course;

