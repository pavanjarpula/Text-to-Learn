// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Profile() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [savedCourses, setSavedCourses] = useState([]);

  useEffect(() => {
    const fetchSavedCourses = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch("/api/user-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSavedCourses(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSavedCourses();
  }, [getAccessTokenSilently]);

  return (
    <div className="max-w-5xl mx-auto mt-24 p-6">
      <h1 className="text-3xl font-bold mb-4">Hello, {user?.nickname || user?.name}</h1>
      <h2 className="text-xl font-semibold mb-2">Your Saved Courses:</h2>
      {savedCourses.length > 0 ? (
        <ul className="space-y-2">
          {savedCourses.map((course) => (
            <li
              key={course._id}
              className="p-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-200"
            >
              {course.title}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No courses saved yet.</p>
      )}
    </div>
  );
}


