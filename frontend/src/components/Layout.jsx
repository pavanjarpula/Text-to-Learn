import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

const Layout = () => {
  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
  };

  const handleBackToCourse = () => {
    setSelectedLesson(null);
  };

  return (
    <div className="layout-container">
      {/* Fixed Navbar */}
      <header className="layout-header">
        <Navbar />
      </header>

      {/* Main Layout with Sidebar */}
      <div className="layout-main">
        {/* Sidebar */}
        <aside className="layout-sidebar">
          <Sidebar onSelectLesson={handleSelectLesson} />
        </aside>

        {/* Main Content */}
        <main className="layout-content">
          <Outlet context={{ selectedLesson, onSelectLesson: handleSelectLesson, onBackToCourse: handleBackToCourse }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;
