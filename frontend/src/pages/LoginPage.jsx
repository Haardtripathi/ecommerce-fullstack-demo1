import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axiosConfig.js';
import useAuthCheck from "../hooks/useAuthCheck.js";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { isAuthenticated, loading, login } = useAuthCheck();

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

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/login`, {
                username,
                password,
            });

            await login(response.data.token);
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border rounded w-full py-2 px-3"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border rounded w-full py-2 px-3"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white rounded w-full py-2 hover:bg-blue-600">Login</button>
                </form>
                <p className="mt-4 text-center">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-500">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;