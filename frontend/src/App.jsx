// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Course from "./pages/Course";
import Lesson from "./pages/Lesson";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

const App = () => (
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: audience,
    }}
  >
    <Router>
      <Routes>
        {/* All routes wrapped in Layout which includes Navbar + Sidebar */}
        <Route element={<Layout />}>
          {/* ---------- Public Routes ---------- */}
          <Route path="/" element={<Home />} />
          <Route path="/course/:id" element={<Course />} />

          {/* ---------- Protected Routes ---------- */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/lesson/:id"
            element={
              <PrivateRoute>
                <Lesson />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  </Auth0Provider>
);

export default App















