const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user")

exports.checkAuth = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.json({ isAuthenticated: false, role: null });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.json({ isAuthenticated: true, role: decoded.role });
    } catch (error) {
        return res.json({ isAuthenticated: false, role: null });
    }
};

exports.logout = (req, res) => {
    // With JWT, logout is typically handled on the client-side
    // by removing the token from storage
    res.json({ message: "Logout successful" });
};

exports.postSignup = async (req, res, next) => {
    const { username, password, mobile, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists." });
        }
        const mobileExistingUser = await User.findOne({ mobile })
        if (mobileExistingUser) {
            return res.status(400).json({ message: "User with this number already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            role: 'user',
            mobile
        });
        await user.save();

        res.status(201).json({ message: "User created successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

exports.postLogin = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        // console.log(user)
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({ message: "Login successful!", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};