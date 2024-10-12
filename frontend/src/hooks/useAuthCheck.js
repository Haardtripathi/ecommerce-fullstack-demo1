import { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const AUTH_CHANGE_EVENT = 'authStateChanged';

const useAuthCheck = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthenticated(false);
            setRole('');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`/check-auth`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAuthenticated(response.data.isAuthenticated);
            setRole(response.data.role || '');
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsAuthenticated(false);
            setRole('');
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();

        const handleAuthChange = () => {
            checkAuth();
        };

        window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);

        return () => {
            window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
        };
    }, []);

    const login = async (token) => {
        localStorage.setItem('token', token);
        await checkAuth();
        window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    };

    const logout = async () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setRole('');
        window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
        return { success: true };
    };

    return { isAuthenticated, loading, role, checkAuth, login, logout };
};

export default useAuthCheck;