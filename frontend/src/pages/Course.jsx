// src/pages/Course.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCourseById,
  getModulesByCourse,
  getLessonsByModule,
} from "../utils/api";

const Course = () => {
  const { id } = useParams(); // courseId
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  // Fetch course and its modules
  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await getCourseById(id);
        setCourse(data);

        const modData = await getModulesByCourse(id);
        setModules(modData);

        if (modData.length > 0) {
          setSelectedModule(modData[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadCourse();
  }, [id]);

  // Fetch lessons of selected module
  useEffect(() => {
    if (!selectedModule) return;
    const loadLessons = async () => {
      try {
        const lesData = await getLessonsByModule(selectedModule);
        setLessons(lesData);
      } catch (err) {
        console.error(err);
      }
    };
    loadLessons();
  }, [selectedModule]);

  if (!course) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="mb-4">{course.description}</p>

      <div className="flex gap-8">
        <aside className="w-1/3 border-r pr-4">
          <h2 className="text-xl font-semibold mb-2">Modules</h2>
          {modules.length === 0 && <p>No modules yet.</p>}
          {modules.map((mod) => (
            <div
              key={mod._id}
              className={`p-2 cursor-pointer rounded ${
                selectedModule === mod._id ? "bg-gray-100" : ""
              }`}
              onClick={() => setSelectedModule(mod._id)}
            >
              {mod.title}
            </div>
          ))}
        </aside>

        <main className="flex-1">
          <h2 className="text-xl font-semibold mb-2">Lessons</h2>
          {lessons.length === 0 && <p>No lessons yet.</p>}
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="border p-3 mb-3 rounded flex justify-between items-center"
            >
              <div>
                <strong>{lesson.title}</strong>
                <div className="text-sm text-gray-600">
                  {(lesson.objectives || []).join(", ")}
                </div>
              </div>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => navigate(`/lesson/${lesson._id}`)}
              >
                Open
              </button>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Course;


