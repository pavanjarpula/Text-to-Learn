// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Course from './pages/Course';
import Lesson from './pages/Lesson';
import Navbar from './components/Navbar';

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/course/:id" element={<Course />} />
      <Route path="/lesson/:id" element={<Lesson />} />
    </Routes>
  </Router>
);

export default App; // ✅ Default export is required

