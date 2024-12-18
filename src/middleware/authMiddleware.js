const jwt = require('jsonwebtoken');
const User = require('../models/userModel');  // Import the User model

// Protect route - verify JWT token
const protect = async (req, res, next) => {
    let token;

    // Check for token in headers (Authorization: Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get the token from the Authorization header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Add user info to request object (useful for profile and other user data)
            req.user = await User.findById(decoded.id).select('-password');  // Exclude password from user object

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If token is missing or not in the correct format
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Admin middleware - check if the user has 'admin' role
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();  // If user is admin, proceed to the next middleware or route handler
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
