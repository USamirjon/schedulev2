// services/userService.js
const User = require('../models/User');
const Schedule = require('../models/Schedule');

/**
 * Service to handle user-related operations
 */
class UserService {
    /**
     * Get all users
     * @returns {Promise<Array>} - All users
     */
    static async getAllUsers() {
        try {
            return await User.findAll();
        } catch (error) {
            console.error('Error getting all users:', error);
            throw error;
        }
    }

    /**
     * Get user by ID
     * @param {number} id - User ID
     * @returns {Promise<Object|null>} - User object or null if not found
     */
    static async getUserById(id) {
        try {
            const user = await User.findById(id);
            return user ? user.toJSON() : null;
        } catch (error) {
            console.error('Error getting user by ID:', error);
            throw error;
        }
    }

    /**
     * Get users by role
     * @param {string} role - User role (admin, teacher, student)
     * @returns {Promise<Array>} - Users with the specified role
     */
    static async getUsersByRole(role) {
        try {
            return await User.findByRole(role);
        } catch (error) {
            console.error('Error getting users by role:', error);
            throw error;
        }
    }

    /**
     * Create a new user
     * @param {Object} userData - User data including username, password, email, role, etc.
     * @returns {Promise<Object>} - Created user object
     */
    static async createUser(userData) {
        try {
            // Validate required fields
            const requiredFields = ['username', 'password', 'email', 'role', 'firstname', 'lastname'];
            for (const field of requiredFields) {
                if (!userData[field]) {
                    throw new Error(`${field} is required`);
                }
            }

            // Validate role
            const validRoles = ['admin', 'teacher', 'student'];
            if (!validRoles.includes(userData.role)) {
                throw new Error('Invalid role');
            }

            return await User.create(userData);
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    /**
     * Update a user
     * @param {number} id - User ID
     * @param {Object} userData - Updated user data
     * @returns {Promise<Object|null>} - Updated user object or null if not found
     */
    static async updateUser(id, userData) {
        try {
            // Validate required fields
            const requiredFields = ['username', 'email', 'role', 'firstname', 'lastname'];
            for (const field of requiredFields) {
                if (!userData[field]) {
                    throw new Error(`${field} is required`);
                }
            }

            // Validate role
            const validRoles = ['admin', 'teacher', 'student'];
            if (!validRoles.includes(userData.role)) {
                throw new Error('Invalid role');
            }

            return await User.update(id, userData);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    /**
     * Delete a user
     * @param {number} id - User ID
     * @returns {Promise<boolean>} - True if deleted successfully
     */
    static async deleteUser(id) {
        try {
            // Check if user is a teacher with scheduled classes
            const user = await User.findById(id);

            if (user && user.role === 'teacher') {
                const schedules = await Schedule.findByTeacher(id);
                if (schedules.length > 0) {
                    throw new Error('Cannot delete teacher who has scheduled classes');
                }
            }

            return await User.delete(id);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    /**
     * Get user groups
     * @param {number} userId - User ID
     * @returns {Promise<Array>} - Groups the user belongs to
     */
    static async getUserGroups(userId) {
        try {
            return await User.getUserGroups(userId);
        } catch (error) {
            console.error('Error getting user groups:', error);
            throw error;
        }
    }

    /**
     * Assign user to group
     * @param {number} userId - User ID
     * @param {string} groupName - Group name
     * @returns {Promise<boolean>} - True if assigned successfully
     */
    static async assignToGroup(userId, groupName) {
        try {
            return await User.assignToGroup(userId, groupName);
        } catch (error) {
            console.error('Error assigning user to group:', error);
            throw error;
        }
    }

    /**
     * Remove user from group
     * @param {number} userId - User ID
     * @param {string} groupName - Group name
     * @returns {Promise<boolean>} - True if removed successfully
     */
    static async removeFromGroup(userId, groupName) {
        try {
            return await User.removeFromGroup(userId, groupName);
        } catch (error) {
            console.error('Error removing user from group:', error);
            throw error;
        }
    }

    /**
     * Update user password
     * @param {number} id - User ID
     * @param {string} newPassword - New password
     * @returns {Promise<boolean>} - True if updated successfully
     */
    static async updatePassword(id, newPassword) {
        try {
            return await User.updatePassword(id, newPassword);
        } catch (error) {
            console.error('Error updating password:', error);
            throw error;
        }
    }
}

module.exports = UserService;