import React, { useState, useCallback } from 'react';
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
  const [courseSource, setCourseSource] = useState(null);
  const [archivedCourse, setArchivedCourse] = useState(null);
  const [isViewingProfileLesson, setIsViewingProfileLesson] = useState(false);
  const [notification, setNotification] = useState(null);

  // Show notification utility
  const showNotification = useCallback((message, type = 'info') => {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const handleCourseGenerated = useCallback((course) => {
    try {
      console.log('✅ App - Course generated:', course.title);
      setCourses(prev => [course, ...prev]);
      setActiveCourse(course);
      setCourseSource('generated');
      if (!isViewingProfileLesson) {
        setArchivedCourse(null);
      }
      showNotification(`Course "${course.title}" generated successfully!`, 'success');
    } catch (error) {
      console.error('❌ Error generating course:', error);
      showNotification('Failed to generate course', 'error');
    }
  }, [isViewingProfileLesson, showNotification]);

  const handleSaveCourse = useCallback(async (course) => {
    try {
      console.log('✅ App - Saving course:', course.title);
      if (!courses.find(c => c._id === course._id)) {
        setCourses(prev => [course, ...prev]);
      }
      showNotification(`Course "${course.title}" saved successfully!`, 'success');
    } catch (error) {
      console.error('❌ Error saving course:', error);
      showNotification('Failed to save course', 'error');
    }
  }, [courses, showNotification]);

  const handleSelectCourse = useCallback((course) => {
    try {
      // 🔒 LOCK: Don't allow course selection if viewing profile lesson
      if (isViewingProfileLesson) {
        console.log('🔒 LOCKED: Cannot select course while viewing profile lesson');
        return;
      }

      if (!course) {
        console.log('🔄 App - Clearing course selection');
        setActiveCourse(null);
        setActiveLesson(null);
        setCourseSource(null);
        return;
      }

      console.log('✅ App - Selecting course:', course.title);
      
      const courseExists = courses.some(c => c._id === course._id);
      
      if (courseExists) {
        console.log('📚 Course exists in sidebar, activating');
        setActiveCourse(course);
        setActiveLesson(null);
        setCourseSource('sidebar');
        setArchivedCourse(null);
      } else {
        console.log('📦 New course from profile, archiving current');
        if (activeCourse) {
          setArchivedCourse(activeCourse);
        }
        setActiveCourse(course);
        setActiveLesson(null);
        setCourseSource('saved');
      }
    } catch (error) {
      console.error('❌ Error selecting course:', error);
      showNotification('Failed to select course', 'error');
    }
  }, [courses, activeCourse, isViewingProfileLesson, showNotification]);

  const handleSelectLesson = useCallback((lessonData) => {
    try {
      // 🔒 LOCK: Don't allow lesson selection if viewing profile lesson
      if (isViewingProfileLesson) {
        console.log('🔒 LOCKED: Cannot select lesson while viewing profile lesson');
        return;
      }

      console.log('✅ App - Selecting lesson:', lessonData?.lesson?.title || 'Unknown');
      
      if (lessonData && lessonData.lesson) {
        setActiveLesson(lessonData);
        setCourseSource('sidebar');
      } else if (lessonData && lessonData._id) {
        setActiveLesson(lessonData);
        setCourseSource('sidebar');
      }
    } catch (error) {
      console.error('❌ Error selecting lesson:', error);
      showNotification('Failed to select lesson', 'error');
    }
  }, [isViewingProfileLesson, showNotification]);

  const handleDeleteCourse = useCallback((courseId) => {
    try {
      // 🔒 LOCK: Don't allow delete if viewing profile lesson
      if (isViewingProfileLesson) {
        console.log('🔒 LOCKED: Cannot delete course while viewing profile lesson');
        return;
      }

      console.log('🗑️ App - Deleting course:', courseId);
      setCourses(prev => prev.filter(c => c._id !== courseId));
      if (activeCourse?._id === courseId) {
        setActiveCourse(null);
        setActiveLesson(null);
        setCourseSource(null);
      }
      showNotification('Course deleted successfully', 'success');
    } catch (error) {
      console.error('❌ Error deleting course:', error);
      showNotification('Failed to delete course', 'error');
    }
  }, [activeCourse, isViewingProfileLesson, showNotification]);

  const handleBackToCourse = useCallback(() => {
    // 🔒 LOCK: Don't allow back if viewing profile lesson
    if (isViewingProfileLesson) {
      console.log('🔒 LOCKED: Cannot go back while viewing profile lesson');
      return;
    }

    console.log('🔙 App - Going back to course');
    setActiveLesson(null);
  }, [isViewingProfileLesson]);

  const handleNewCourse = useCallback(() => {
    try {
      // 🔒 LOCK: Don't allow new course if viewing profile lesson
      if (isViewingProfileLesson) {
        console.log('🔒 LOCKED: Cannot create new course while viewing profile lesson');
        return;
      }

      console.log('🆕 App - Starting new course');
      setActiveCourse(null);
      setActiveLesson(null);
      setCourseSource('generated');
      setArchivedCourse(null);
      showNotification('Starting new course...', 'info');
    } catch (error) {
      console.error('❌ Error creating new course:', error);
      showNotification('Failed to start new course', 'error');
    }
  }, [isViewingProfileLesson, showNotification]);

  const handleCloseProfileLesson = useCallback(() => {
    try {
      console.log('❌ App - Closing profile lesson');
      
      if (archivedCourse) {
        console.log('♻️ Restoring archived course:', archivedCourse.title);
        setActiveCourse(archivedCourse);
        setArchivedCourse(null);
        setActiveLesson(null);
        setCourseSource('sidebar');
      } else {
        setActiveCourse(null);
        setActiveLesson(null);
        setCourseSource(null);
      }
      
      // 🔓 UNLOCK: Only set to false when explicitly closing
      setIsViewingProfileLesson(false);
    } catch (error) {
      console.error('❌ Error closing profile lesson:', error);
      showNotification('Failed to close profile lesson', 'error');
    }
  }, [archivedCourse, showNotification]);

  const handleViewProfileLesson = useCallback((lessonData) => {
    try {
      console.log('👁️ App - Viewing profile lesson:', lessonData?.lesson?.title);
      
      // 🔒 LOCK: Set isViewingProfileLesson to true - blocks all other operations
      setIsViewingProfileLesson(true);
      
      // Archive current course if viewing different course
      if (activeCourse && !activeCourse._id?.includes(lessonData?.course?.title)) {
        setArchivedCourse(activeCourse);
      }
      
      setActiveLesson(lessonData);
      setCourseSource('profile');
    } catch (error) {
      console.error('❌ Error viewing profile lesson:', error);
      showNotification('Failed to view lesson', 'error');
    }
  }, [activeCourse, showNotification]);

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
                courseSource={courseSource}
                isViewingProfileLesson={isViewingProfileLesson}
                notification={notification}
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
                  isViewingProfileLesson={isViewingProfileLesson}
                  onCloseProfileLesson={handleCloseProfileLesson}
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
              element={
                <Profile 
                  courses={courses}
                  activeCourse={activeCourse}
                  courseSource={courseSource}
                  isViewingProfileLesson={isViewingProfileLesson}
                  onSelectCourse={handleSelectCourse}
                  onViewProfileLesson={handleViewProfileLesson}
                />
              }
            />
          </Route>
        </Routes>
      </Router>
    </Auth0Provider>
  );
}

export default App;