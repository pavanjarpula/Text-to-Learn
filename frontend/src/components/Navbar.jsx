// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-xl">Text-to-Lear</Link>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/course/1">Courses</Link>
      </div>
    </nav>
  );
};

export default Navbar;

