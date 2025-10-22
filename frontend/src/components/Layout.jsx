import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({
  courses,
  activeCourse,
  activeLesson,
  onSelectCourse,
  onSelectLesson,
  onDeleteCourse,
}) => {
  return (
    <div className="app-layout">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="app-container">
        {/* Sidebar */}
        <Sidebar
          courses={courses}
          activeCourse={activeCourse}
          activeLesson={activeLesson}
          onSelectCourse={onSelectCourse}
          onSelectLesson={onSelectLesson}
          onDeleteCourse={onDeleteCourse}
        />

        {/* Main Content */}
        <main className="app-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;


