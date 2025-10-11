// src/pages/Lesson.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLessonById } from "../utils/api";
import LessonRenderer from "../components/LessonRenderer";

const LessonPage = () => {
  const { id } = useParams(); // lessonId
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const data = await getLessonById(id);
        setLesson(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadLesson();
  }, [id]);

  if (!lesson) return <div className="p-6">Loading lesson...</div>;

  return (
    <div className="p-6">
      <Link to="/" className="text-sm text-blue-600">← Back</Link>
      <h1 className="text-2xl font-bold mt-2">{lesson.title}</h1>
      <div className="mt-4">
        <LessonRenderer content={lesson.content || []} />
      </div>
    </div>
  );
};

export default LessonPage;

