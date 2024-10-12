/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthCheck from "../hooks/useAuthCheck";

const HomePage = () => {
    const { isAuthenticated, loading, role } = useAuthCheck();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-6">Welcome to Apna-Bazaar</h1>
            <div className="text-center mb-8">
                <p className="text-xl text-gray-600 mb-4">Your go-to destination for quality products, all in one place.</p>
            </div>

            <div className="max-w-4xl mx-auto">
                {isAuthenticated ? (
                    role === 'admin' ? (  // Check if the user is an admin
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
                            <p className="text-gray-600 mb-4">
                                Welcome, Admin! Manage products, orders, and users from this dashboard.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <Link
                                    to="/shop"
                                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                                >
                                    Manage Products
                                </Link>
                                <Link
                                    to="/admin/users"
                                    className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300"
                                >
                                    View Users
                                </Link>
                            </div>
                        </div>
                    ) : ( // Content for regular authenticated users
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">Welcome Back!</h2>
                            <p className="text-gray-600 mb-4">
                                We are thrilled to have you with us. Browse our latest products and discover great deals curated just for you.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <Link
                                    to="/shop"
                                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                                >
                                    Explore Our Shop
                                </Link>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Become a Part of Apna-Bazaar</h2>
                        <p className="text-gray-600 mb-4">
                            Join our community for a personalized shopping experience, exclusive deals, and so much more!
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link
                                to="/login"
                                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300"
                            >
                                Create an Account
                            </Link>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Exclusive Products</h3>
                        <p className="text-gray-600">
                            Discover premium, handpicked products that meet your every need.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Competitive Prices</h3>
                        <p className="text-gray-600">
                            Enjoy great deals and discounts, helping you save more every time you shop.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Reliable Delivery</h3>
                        <p className="text-gray-600">
                            Get your products quickly and securely delivered right to your doorstep.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
