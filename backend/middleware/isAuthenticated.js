const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.isAuthenticated = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

exports.isNotAdmin = async (req, res, next) => {
    try {
        if (req.user && req.user.role !== "admin") {
            return next();
        }
        return res.status(401).json({ message: 'Unauthorized access' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user && req.user.role === "admin") {
            return next();
        }
        return res.status(401).json({ message: 'Unauthorized access' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};