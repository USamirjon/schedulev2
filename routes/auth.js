// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { checkNotAuthenticated } = require('../middleware/auth');

// Login routes
router.get('/login', checkNotAuthenticated, authController.getLoginPage);
router.post('/login', checkNotAuthenticated, authController.login);

// Register routes
router.get('/register', checkNotAuthenticated, authController.getRegisterPage);
router.post('/register', checkNotAuthenticated, authController.register);

// Logout route
router.get('/logout', authController.logout);

// Profile routes
router.get('/profile', authController.getProfile);
router.post('/profile/password', authController.updatePassword);

module.exports = router;