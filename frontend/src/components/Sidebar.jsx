import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, User, Home, BookOpen, PlusSquare } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

const Sidebar = () => {
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth0();

    const navItems = [
        { name: 'Home', path: '/', icon: Home, auth: 'public' },
        { name: 'My Courses', path: '/profile', icon: BookOpen, auth: 'private' },
        { name: 'New Course', path: '/', icon: PlusSquare, auth: 'private' }, 
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 p-6 space-y-8 shadow-2xl sticky top-[72px] h-[calc(100vh-72px)] hidden md:block">
            <nav className="space-y-2">
                {navItems.filter(item => item.auth === 'public' || isAuthenticated).map(item => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center p-3 rounded-xl transition duration-200 ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                            }`}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout button at the bottom */}
            {isAuthenticated && (
                <div className="absolute bottom-6 w-full pr-12">
                    <button
                        onClick={() => logout({ returnTo: window.location.origin })}
                        className="flex items-center w-full p-3 rounded-xl transition duration-200 text-red-600 hover:bg-red-50 hover:shadow-md"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sidebar;