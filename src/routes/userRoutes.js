const express = require('express');
const {
    registerUser,
    registerAdmin,
    loginUser,
    getUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

const router = express.Router();

// Regular user routes with validation
router.post(
    '/register',
    [
        check('name', 'Name is required').notEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
    ],
    registerUser
);

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    loginUser
);

router.get('/profile', protect, getUserProfile);

// Admin-specific routes with validation
router.post(
    '/admin/register',
    [
        check('name', 'Name is required').notEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
    ],
    registerAdmin
);



module.exports = router;
