// src/pages/Profile.jsx (Renamed from MyCourses for clarity, but logic remains)
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getMyCourses, deleteCourseById } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

const ProfilePage = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;
    const loadCourses = async () => {
      try {
        const token = await getAccessTokenSilently();
        const data = await getMyCourses(token);
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, [isAuthenticated, getAccessTokenSilently]);

  if (!isAuthenticated) return <div className="p-6">Please log in to view your profile.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      
      {/* Profile Header Section (Gemini UI Style) */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold mb-2 text-blue-700">User Profile</h1>
        <div className="flex items-center space-x-4">
          <img 
            src={user.picture || 'default-avatar.png'} // Use default if no picture
            alt="User Avatar"
            className="w-16 h-16 rounded-full border-2 border-blue-500"
          />
          <div>
            <p className="text-xl font-semibold">{user.name || user.nickname || 'User'}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <p className="text-gray-500 text-xs mt-1">Auth0 ID: {user.sub}</p>
          </div>
        </div>
      </div>

      {/* My Courses Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold border-b pb-2 text-gray-800">My Created Courses ({courses.length})</h2>
        {loading ? (
          <div className="text-gray-500">Loading your courses...</div>
        ) : courses.length === 0 ? (
          <div className="p-4 bg-yellow-50 rounded-lg text-yellow-800">You haven't generated any courses yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard 
                key={course._id} 
                course={course} 
                onView={() => navigate(`/course/${course._id}`)} 
                // onDelete={handleDelete} 
                // NOTE: Move delete logic to a separate component or keep it clean
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Card Component for better profile styling
const CourseCard = ({ course, onView }) => (
    <div className="p-5 border rounded-xl shadow-md bg-white hover:shadow-lg transition cursor-pointer flex flex-col justify-between">
        <h3 className="text-lg font-bold text-blue-600">{course.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{course.description}</p>
        <div className="mt-3 text-xs text-gray-400">
            {course.tags.map(tag => <span key={tag} className="mr-2 px-2 py-1 bg-gray-100 rounded">{tag}</span>)}
        </div>
        <button 
            onClick={onView} 
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
            View Course
        </button>
        {/* Optional: Add Delete Button here with logic */}
    </div>
);

export default ProfilePage;




