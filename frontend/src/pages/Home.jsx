import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PromptForm from '../components/PromptForm';
import CoursePreview from '../components/CoursePreview';
import './Home.css';

export default function Home() {
  const [course, setCourse] = useState(null);

  return (
    <div className="home-container">
      {/* Navbar - Stays fixed at the top */}
      <nav className="navbar">
        <div className="navbar-left">📘 Text-to-Learn</div>
        <div className="navbar-right">
          <Link to="/login" className="nav-btn">Login</Link>
          <Link to="/signup" className="nav-btn">Signup</Link>
        </div>
      </nav>

      {/* Header */}
      <header className="home-header">
        <h1>Welcome to Pavan's Text-to-Learn App</h1>
        <p>Simplify self-learning with instantly generated structured courses.</p>
      </header>

      {/* PROMPT BAR SECTION */}
      <div className="prompt-bar-center">
        <PromptForm onResult={setCourse} />
      </div>

      {/* Course Preview - Now below the Prompt Bar */}
      <main className="course-preview-main">
        {course ? (
          <CoursePreview course={course} />
        ) : (
          <div className="placeholder-container">
            <p className="placeholder-text">Enter a topic below to generate a course...</p>
            <div className="placeholder-divider"></div>
          </div>
        )}
      </main>
    </div>
  );
}
