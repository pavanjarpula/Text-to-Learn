// src/pages/Profile.jsx (or src/pages/MyCourses.jsx)
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { apiRequest } from "../utils/api";
import CoursePreview from "../components/CoursePreview";
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch user's courses
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const token = await getAccessTokenSilently();
        const data = await apiRequest("/courses/my", "GET", null, token);
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, [getAccessTokenSilently]);

  // ✅ Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      const token = await getAccessTokenSilently();
      await apiRequest(`/courses/${id}`, "DELETE", null, token);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading) return <div className="p-6">Loading your courses...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>
      <div className="grid gap-4">
        {courses.length === 0 && <div>No courses yet.</div>}
        {courses.map((course) => (
          <div
            key={course._id}
            className="flex items-start justify-between border p-3 rounded"
          >
            <div
              onClick={() => navigate(`/course/${course._id}`)}
              style={{ cursor: "pointer" }}
            >
              <CoursePreview course={course} />
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate(`/course/${course._id}`)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                View
              </button>
              <button
                onClick={() => handleDelete(course._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;




