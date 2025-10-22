import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import './Appp.css';

function App() {
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  const handleCourseGenerated = (course) => {
    setCourses(prev => [course, ...prev]);
    setActiveCourse(course);
  };

  const handleSaveCourse = async (course) => {
    // This will save to backend when authenticated
    console.log('Saving course:', course);
    // Add to courses list if not already there
    if (!courses.find(c => c._id === course._id)) {
      setCourses(prev => [course, ...prev]);
    }
  };

  const handleSelectCourse = (course) => {
    setActiveCourse(course);
    setActiveLesson(null);
  };

  const handleSelectLesson = (lesson) => {
    setActiveLesson(lesson);
  };

  const handleDeleteCourse = (courseId) => {
    setCourses(prev => prev.filter(c => c._id !== courseId));
    if (activeCourse?._id === courseId) {
      setActiveCourse(null);
      setActiveLesson(null);
    }
  };

  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      }}
    >
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                courses={courses}
                activeCourse={activeCourse}
                activeLesson={activeLesson}
                onSelectCourse={handleSelectCourse}
                onSelectLesson={handleSelectLesson}
                onDeleteCourse={handleDeleteCourse}
              />
            }
          >
            <Route
              index
              element={
                <Home
                  activeCourse={activeCourse}
                  activeLesson={activeLesson}
                  onCourseGenerated={handleCourseGenerated}
                  onSaveCourse={handleSaveCourse}
                  onSelectLesson={handleSelectLesson}
                  onBackToCourse={() => setActiveLesson(null)}
                  onNewCourse={() => {
                    setActiveCourse(null);
                    setActiveLesson(null);
                  }}
                />
              }
            />
            <Route
              path="profile"
              element={<Profile courses={courses} />}
            />
          </Route>
        </Routes>
      </Router>
    </Auth0Provider>
  );
}

export default App;














