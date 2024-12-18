const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator'); // For validation errors

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


// POST /users/register - Register a regular user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Create new user
        // No need to has password here since it is hashed in the model by default using pre actions
        const user = await User.create({
            name,
            email,
            password,
            role: 'user',
        });

        if (!user) {
            res.status(400);
            throw new Error('Invalid user data');
        }

        // Respond with user data and token
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



// POST /users/admin/register - Register an admin user
const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validate input data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if admin already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Create a new admin user
        const user = await User.create({
            name,
            email,
            password,
            role: 'admin',
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid user data' });
        }

        // Respond with user data and JWT token
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
        });
    }
};


// POST /users/login - Login user or admin
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User doesn't exist" });
        }

        // Check if password matches
        const isPasswordValid = await user.matchPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Wrong password' });
        }

        // Generate JWT token
        const token = generateToken(user._id, user.role);

        // Respond with user data and token
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error occurred during login' });
    }
};



// GET /users/profile - Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, registerAdmin, loginUser, getUserProfile };
