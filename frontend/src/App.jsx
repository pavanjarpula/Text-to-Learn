import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
    console.log('App - Course generated:', course);
    setCourses(prev => [course, ...prev]);
    setActiveCourse(course);
  };

  const handleSaveCourse = async (course) => {
    console.log('App - Saving course:', course);
    if (!courses.find(c => c._id === course._id)) {
      setCourses(prev => [course, ...prev]);
    }
  };

  const handleSelectCourse = (course) => {
    console.log('App - Selecting course:', course.title);
    setActiveCourse(course);
    setActiveLesson(null);
  };

  const handleSelectLesson = (lessonData) => {
    console.log('App - handleSelectLesson received:', lessonData);
    
    // lessonData can be:
    // 1. From CoursePreview: { lesson, module, lessonIdx, moduleIdx }
    // 2. From Sidebar: just the lesson object
    
    if (lessonData && lessonData.lesson) {
      // It's an object from CoursePreview
      console.log('Setting activeLesson from CoursePreview data');
      setActiveLesson(lessonData);
    } else if (lessonData && lessonData._id) {
      // It's a direct lesson object from Sidebar
      console.log('Setting activeLesson from Sidebar');
      setActiveLesson(lessonData);
    }
  };

  const handleDeleteCourse = (courseId) => {
    console.log('App - Deleting course:', courseId);
    setCourses(prev => prev.filter(c => c._id !== courseId));
    if (activeCourse?._id === courseId) {
      setActiveCourse(null);
      setActiveLesson(null);
    }
  };

  const handleBackToCourse = () => {
    console.log('App - Going back to course');
    setActiveLesson(null);
  };

  const handleNewCourse = () => {
    console.log('App - New course');
    setActiveCourse(null);
    setActiveLesson(null);
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
                  onBackToCourse={handleBackToCourse}
                  onNewCourse={handleNewCourse}
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













