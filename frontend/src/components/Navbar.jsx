// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Navbar.css";

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo */}
        <Link to="/" className="navbar-left">
          ✨ Text-to-Learn
        </Link>

        {/* Right side links */}
        <div className="navbar-right-links">
          {isAuthenticated ? (
            // Authenticated Flow: Greeting -> Courses -> Profile -> Logout
            <>
              {/* 1. Greeting */}
              <span className="user-greeting">
                Hello, {user?.nickname || user?.name || "User"}
              </span>
              
              {/* 2. Courses Link (Standard link style) */}
              <Link
                to="/courses"
                className="nav-btn nav-link-custom" 
              >
                Courses
              </Link>

              {/* 3. Profile Button (Updated subtle style) */}
              <Link
                to="/profile"
                className="nav-btn profile-btn-custom"
              >
                Profile
              </Link>

              {/* 4. Logout Button (Updated subtle style) */}
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="nav-btn logout-btn-custom"
              >
                Logout
              </button>
            </>
          ) : (
            // Unauthenticated Flow: Courses -> Login -> Signup
            <div className="auth-buttons-unauthenticated">
              {/* Courses Link */}
              <Link
                to="/courses"
                className="nav-btn nav-link-custom" 
              >
                Courses
              </Link>
              
              {/* Login Button (Updated subtle style) */}
              <button
                onClick={() => loginWithRedirect()}
                className="nav-btn login"
              >
                Login
              </button>
              
              {/* Signup Button (Updated subtle style) */}
              <button
                onClick={() =>
                  loginWithRedirect({
                    authorizationParams: { screen_hint: "signup" },
                  })
                }
                className="nav-btn signup"
              >
                Signup
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;








