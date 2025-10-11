// src/pages/Lesson.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiRequest } from "../utils/api";
import LessonRenderer from "../components/LessonRenderer";

const LessonPage = () => {
  const { courseId, moduleIndex, lessonIndex } = useParams();
  const [lesson, setLesson] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/courses/${courseId}`);
        const course = res.data;
        setCourseTitle(course.title || "");
        const mod = course.modules?.[Number(moduleIndex)];
        const l = mod?.lessons?.[Number(lessonIndex)];
        if (!l) {
          setLesson(null);
          return;
        }
        setLesson(l);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [courseId, moduleIndex, lessonIndex]);

  if (!lesson) return <div className="p-6">Loading lesson...</div>;

  return (
    <div className="p-6">
      <Link to={`/courses/${courseId}`} className="text-sm text-blue-600">← Back to course</Link>
      <h1 className="text-2xl font-bold mt-2">{lesson.title}</h1>
      <div className="mt-4">
        <LessonRenderer content={lesson.content || []} />
      </div>
    </div>
  );
};

export default LessonPage;
