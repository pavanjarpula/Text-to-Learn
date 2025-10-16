// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // You need to create this
import Navbar from './Navbar'; // Your existing Navbar

const Layout = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Top Bar for Auth (Keep separate if not integrating into layout) */}
            <header className="absolute top-0 w-full z-10">
                <Navbar />
            </header>

            {/* Main Layout Area */}
            <div className="flex flex-1 pt-20"> {/* Add padding for the fixed Navbar */}
                <Sidebar />
                
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet /> {/* Renders the current page (Home, Course, Profile) */}
                </main>
            </div>
        </div>
    );
};

export default Layout;