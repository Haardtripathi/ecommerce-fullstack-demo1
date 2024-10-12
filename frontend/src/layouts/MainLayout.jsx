/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Navbar toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
