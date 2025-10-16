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
            <>
              <span className="user-greeting">
                Hello, {user?.nickname || user?.name || "User"}
              </span>

              <Link to="/profile" className="nav-btn profile-btn-custom">
                Profile
              </Link>

              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="nav-btn logout-btn-custom"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="auth-buttons-unauthenticated">
              <button
                onClick={() => loginWithRedirect()}
                className="nav-btn login"
              >
                Login
              </button>

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









