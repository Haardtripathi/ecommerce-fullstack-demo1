import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuthCheck from "../hooks/useAuthCheck";

const Sidebar = ({ isOpen }) => {
    const { isAuthenticated, role, logout, loading } = useAuthCheck();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            navigate("/login");
        }
    };

    if (loading) {
        return null; // or a loading spinner if you prefer
    }

    return (
        <div className={`bg-gray-800 h-full transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
            <div className="flex flex-col h-full py-4">
                <nav className="mt-10">
                    <ul className="space-y-2">
                        <li>
                            <Link to="/" className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2">
                                <span className="ml-3">Home</span>
                            </Link>
                        </li>
                        {isAuthenticated && (
                            <li>
                                <Link to="/shop" className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2">
                                    <span className="ml-3">Shop</span>
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link to="/about" className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2">
                                <span className="ml-3">About</span>
                            </Link>
                        </li>
                        {isAuthenticated && role === "user" && (
                            <li>
                                <Link to="/cart" className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2">
                                    <span className="ml-3">Cart</span>
                                </Link>
                            </li>
                        )}
                        {isAuthenticated && role === "admin" && (
                            <li>
                                <Link to="/admin/add-product" className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2">
                                    <span className="ml-3">Add Product</span>
                                </Link>
                            </li>
                        )}
                        {!isAuthenticated ? (
                            <>
                                <li>
                                    <Link to="/login" className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2">
                                        <span className="ml-3">Login</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/signup" className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2">
                                        <span className="ml-3">Sign Up</span>
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2"
                                >
                                    <span className="ml-3">Logout</span>
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
};

export default Sidebar;