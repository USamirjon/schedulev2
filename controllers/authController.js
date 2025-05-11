// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Render login page
const getLoginPage = (req, res) => {
    res.render('auth/login', { title: 'Login', error: null });
};

// Process login request
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findByUsername(username);

        if (!user || !(await user.isValidPassword(password))) {
            return res.render('auth/login', {
                title: 'Login',
                error: 'Invalid username or password'
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Set cookie with token
        res.cookie('auth_token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // Redirect based on role
        switch (user.role) {
            case 'admin':
                res.redirect('/admin/dashboard');
                break;
            case 'teacher':
                res.redirect('/teacher/schedule');
                break;
            case 'student':
                res.redirect('/student/schedule');
                break;
            default:
                res.redirect('/');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.render('auth/login', {
            title: 'Login',
            error: 'An error occurred during login'
        });
    }
};

// Render register page
const getRegisterPage = (req, res) => {
    res.render('auth/register', { title: 'Register', error: null });
};

// Process registration (admin only function in actual app)
const register = async (req, res) => {
    try {
        const { username, password, email, role, firstname, lastname } = req.body;

        // Check if username or email already exists
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.render('auth/register', {
                title: 'Register',
                error: 'Username already exists'
            });
        }

        // Create new user
        await User.create({
            username,
            password,
            email,
            role: role || 'student', // Default to student if no role provided
            firstname,
            lastname
        });

        res.redirect('/auth/login');
    } catch (error) {
        console.error('Registration error:', error);
        res.render('auth/register', {
            title: 'Register',
            error: 'An error occurred during registration'
        });
    }
};

// Process logout
const logout = (req, res) => {
    res.clearCookie('auth_token');
    res.redirect('/auth/login');
};

// Get current user profile
const getProfile = (req, res) => {
    res.render('profile', {
        title: 'My Profile',
        user: req.user
    });
};

// Update user password
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Check if current password is correct
        if (!(await req.user.isValidPassword(currentPassword))) {
            return res.render('profile', {
                title: 'My Profile',
                user: req.user,
                error: 'Current password is incorrect'
            });
        }

        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
            return res.render('profile', {
                title: 'My Profile',
                user: req.user,
                error: 'New passwords do not match'
            });
        }

        // Update password
        await User.updatePassword(req.user.id, newPassword);

        res.render('profile', {
            title: 'My Profile',
            user: req.user,
            success: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Update password error:', error);
        res.render('profile', {
            title: 'My Profile',
            user: req.user,
            error: 'An error occurred while updating password'
        });
    }
};

module.exports = {
    getLoginPage,
    login,
    getRegisterPage,
    register,
    logout,
    getProfile,
    updatePassword
};