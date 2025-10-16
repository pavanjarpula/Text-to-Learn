// src/pages/Lesson.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLessonById } from "../utils/api"; // You need to update this to fetch the course ID
import LessonRenderer from "../components/LessonRenderer";

const LessonPage = () => {
  const { id } = useParams(); // lessonId
  const [lesson, setLesson] = useState(null);
  const [courseId, setCourseId] = useState(null); // 👈 New state for course ID

  useEffect(() => {
    const loadLesson = async () => {
      try {
        // ASSUMPTION: The API response now includes the parent course ID, 
        // e.g., data.courseId
        const data = await getLessonById(id); 
        setLesson(data);
        // If your backend doesn't return courseId, you'll need to update the backend API
        // or fetch the module to get its parent courseId.
        // For now, let's assume the returned lesson data has a 'course' field.
        setCourseId(data.course || data.module?.course); 
      } catch (err) {
        console.error(err);
      }
    };
    loadLesson();
  }, [id]);

  if (!lesson) return <div className="p-6">Loading lesson...</div>;
  
  // Determine the correct back link
  const backLink = courseId ? `/course/${courseId}` : "/";

  return (
    <div className="p-6">
      {/* 👈 Updated Link to go back to the Course Page */}
      <Link to={backLink} className="text-sm text-blue-600 hover:underline">
        ← Back to Course
      </Link>
      <h1 className="text-2xl font-bold mt-2">{lesson.title}</h1>
      {/* Pass full lesson object (or just required props) to LessonRenderer */}
      <div className="mt-4">
        <LessonRenderer 
            title={lesson.title} 
            objectives={lesson.objectives} 
            content={lesson.content || []} 
        />
      </div>
    </div>
  );
};

export default LessonPage;

