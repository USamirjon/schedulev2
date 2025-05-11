// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies['auth_token'];

        if (!token) {
            return res.status(401).redirect('/auth/login');
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by ID
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).redirect('/auth/login');
        }

        // Add user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).redirect('/auth/login');
    }
};

// Check if user is already logged in (for login/register pages)
const checkNotAuthenticated = (req, res, next) => {
    const token = req.cookies['auth_token'];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return res.redirect('/');
        } catch (error) {
            // Invalid token, proceed to login page
        }
    }

    next();
};

module.exports = {
    auth,
    checkNotAuthenticated
};