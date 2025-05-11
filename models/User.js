// models/User.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    constructor(id, username, password, email, role, firstname, lastname) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.firstname = firstname;
        this.lastname = lastname;
    }

    // Find user by ID
    static async findById(id) {
        try {
            const result = await db.query(
                'SELECT * FROM users WHERE id = $1',
                [id]
            );
            if (result.rows.length === 0) return null;
            const user = result.rows[0];
            return new User(
                user.id,
                user.username,
                user.password,
                user.email,
                user.role,
                user.firstname,
                user.lastname
            );
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }

    // Find user by username
    static async findByUsername(username) {
        try {
            const result = await db.query(
                'SELECT * FROM users WHERE username = $1',
                [username]
            );
            if (result.rows.length === 0) return null;
            const user = result.rows[0];
            return new User(
                user.id,
                user.username,
                user.password,
                user.email,
                user.role,
                user.firstname,
                user.lastname
            );
        } catch (error) {
            console.error('Error finding user by username:', error);
            throw error;
        }
    }

    // Find all users
    static async findAll() {
        try {
            const result = await db.query(
                'SELECT id, username, email, role, firstname, lastname, created_at, updated_at FROM users ORDER BY id'
            );
            return result.rows;
        } catch (error) {
            console.error('Error finding all users:', error);
            throw error;
        }
    }

    // Find users by role
    static async findByRole(role) {
        try {
            const result = await db.query(
                'SELECT id, username, email, firstname, lastname FROM users WHERE role = $1',
                [role]
            );
            return result.rows;
        } catch (error) {
            console.error('Error finding users by role:', error);
            throw error;
        }
    }

    // Create a new user
    static async create(userData) {
        try {
            const { username, password, email, role, firstname, lastname } = userData;
            const hashedPassword = await bcrypt.hash(password, 10);

            const result = await db.query(
                `INSERT INTO users (username, password, email, role, firstname, lastname) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id, username, email, role, firstname, lastname`,
                [username, hashedPassword, email, role, firstname, lastname]
            );

            return result.rows[0];
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Update user
    static async update(id, userData) {
        try {
            const { username, email, role, firstname, lastname } = userData;

            const result = await db.query(
                `UPDATE users 
         SET username = $1, email = $2, role = $3, firstname = $4, lastname = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING id, username, email, role, firstname, lastname`,
                [username, email, role, firstname, lastname, id]
            );

            if (result.rows.length === 0) return null;
            return result.rows[0];
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // Update password
    static async updatePassword(id, newPassword) {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await db.query(
                `UPDATE users 
         SET password = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
                [hashedPassword, id]
            );

            return true;
        } catch (error) {
            console.error('Error updating password:', error);
            throw error;
        }
    }

    // Delete user
    static async delete(id) {
        try {
            await db.query('DELETE FROM users WHERE id = $1', [id]);
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    // Assign a student to a group
    static async assignToGroup(userId, groupName) {
        try {
            await db.query(
                `INSERT INTO user_groups (user_id, group_name)
         VALUES ($1, $2)
         ON CONFLICT (user_id, group_name) DO NOTHING`,
                [userId, groupName]
            );
            return true;
        } catch (error) {
            console.error('Error assigning user to group:', error);
            throw error;
        }
    }

    // Remove a student from a group
    static async removeFromGroup(userId, groupName) {
        try {
            await db.query(
                'DELETE FROM user_groups WHERE user_id = $1 AND group_name = $2',
                [userId, groupName]
            );
            return true;
        } catch (error) {
            console.error('Error removing user from group:', error);
            throw error;
        }
    }

    // Get all groups for a student
    static async getUserGroups(userId) {
        try {
            const result = await db.query(
                'SELECT group_name FROM user_groups WHERE user_id = $1',
                [userId]
            );
            return result.rows.map(row => row.group_name);
        } catch (error) {
            console.error('Error getting user groups:', error);
            throw error;
        }
    }

    // Check if the given password matches the stored hash
    async isValidPassword(password) {
        return await bcrypt.compare(password, this.password);
    }

    // Return user data without sensitive information
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            role: this.role,
            firstname: this.firstname,
            lastname: this.lastname
        };
    }
}

module.exports = User;