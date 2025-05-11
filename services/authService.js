// services/authService.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Authentication service to handle user login, token generation and verification
 */
class AuthService {
    /**
     * Authenticate a user with username and password
     * @param {string} username - User's username
     * @param {string} password - User's password
     * @returns {Promise<Object|null>} - Returns user object and token if authentication successful, null otherwise
     */
    static async authenticate(username, password) {
        try {
            // Find user by username
            const user = await User.findByUsername(username);

            if (!user || !(await user.isValidPassword(password))) {
                return null;
            }

            // Generate JWT token
            const token = this.generateToken(user);

            return {
                user: user.toJSON(),
                token
            };
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    }

    /**
     * Generate JWT token for a user
     * @param {Object} user - User object
     * @returns {string} - JWT token
     */
    static generateToken(user) {
        return jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
    }

    /**
     * Verify JWT token
     * @param {string} token - JWT token to verify
     * @returns {Object|null} - Decoded token payload if valid, null otherwise
     */
    static verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            console.error('Token verification error:', error);
            return null;
        }
    }

    /**
     * Register a new user
     * @param {Object} userData - User data including username, password, email, role, etc.
     * @returns {Promise<Object>} - Created user object
     */
    static async register(userData) {
        try {
            // Check if username or email already exists
            const existingUser = await User.findByUsername(userData.username);
            if (existingUser) {
                throw new Error('Username already exists');
            }

            // Create new user
            const user = await User.create(userData);
            return user;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }
}

module.exports = AuthService;