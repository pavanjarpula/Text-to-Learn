import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react'; // ✅ import Auth0 hook
import PromptForm from '../components/PromptForm';
import CoursePreview from '../components/CoursePreview';
import './Home.css';

export default function Home() {
  const [course, setCourse] = useState(null);
  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0(); // ✅ use Auth0 hook

  return (
    <div className="home-container">
      {/* Navbar - Stays fixed at the top */}
      <nav className="navbar">
        <div className="navbar-left">📘 Text-to-Learn</div>
        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              <span className="nav-btn">Hello, {user?.nickname}</span> {/* ✅ username instead of email */}
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="nav-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => loginWithRedirect()} // ✅ login
                className="nav-btn"
              >
                Login
              </button>
              <button
                onClick={() =>
                  loginWithRedirect({
                    authorizationParams: { screen_hint: 'signup' }, // ✅ signup mode
                  })
                }
                className="nav-btn"
              >
                Signup
              </button>
            </>
          )}
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
