// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import Home from "./pages/Home";
import Course from "./pages/Course";
import Lesson from "./pages/Lesson";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute"; // ✅ import PrivateRoute
import Profile from "./pages/Profile"; // Optional: create this page

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
      <Navbar />
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Home />} />

        {/* Protected routes */}
        <Route
          path="/course/:id"
          element={
            <PrivateRoute>
              <Course />
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
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  </Auth0Provider>
);

export default App;




