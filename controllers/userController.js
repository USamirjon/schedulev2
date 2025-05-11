// controllers/userController.js
const User = require('../models/User');
const Schedule = require('../models/Schedule');

// Admin: Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        res.render('admin/users', {
            title: 'Manage Users',
            users,
            error: null,
            success: null
        });
    } catch (error) {
        console.error('Error getting all users:', error);
        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to load users'
        });
    }
};

// Admin: Create user
const createUser = async (req, res) => {
    try {
        const { username, password, email, role, firstname, lastname } = req.body;

        // Validate input
        if (!username || !password || !email || !role || !firstname || !lastname) {
            const users = await User.findAll();
            return res.render('admin/users', {
                title: 'Manage Users',
                users,
                error: 'All fields are required',
                success: null
            });
        }

        // Create new user
        await User.create({
            username,
            password,
            email,
            role,
            firstname,
            lastname
        });

        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error creating user:', error);

        // Check for duplicate key error
        if (error.code === '23505') { // PostgreSQL unique violation error code
            const users = await User.findAll();
            return res.render('admin/users', {
                title: 'Manage Users',
                users,
                error: 'Username or email already exists',
                success: null
            });
        }

        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to create user'
        });
    }
};

// Admin: Update user
const updateUser = async (req, res) => {
    try {
        const { id, username, email, role, firstname, lastname } = req.body;

        // Validate input
        if (!username || !email || !role || !firstname || !lastname) {
            const users = await User.findAll();
            return res.render('admin/users', {
                title: 'Manage Users',
                users,
                error: 'All fields are required',
                success: null
            });
        }

        // Update user
        await User.update(id, {
            username,
            email,
            role,
            firstname,
            lastname
        });

        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error updating user:', error);

        // Check for duplicate key error
        if (error.code === '23505') { // PostgreSQL unique violation error code
            const users = await User.findAll();
            return res.render('admin/users', {
                title: 'Manage Users',
                users,
                error: 'Username or email already exists',
                success: null
            });
        }

        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to update user'
        });
    }
};

// Admin: Reset user password
const resetPassword = async (req, res) => {
    try {
        const { id, password } = req.body;

        // Validate input
        if (!password) {
            const users = await User.findAll();
            return res.render('admin/users', {
                title: 'Manage Users',
                users,
                error: 'Password is required',
                success: null
            });
        }

        // Update password
        await User.updatePassword(id, password);

        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to reset password'
        });
    }
};

// Admin: Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if it's not the admin user
        if (req.user.id === parseInt(id)) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        // Delete user
        await User.delete(id);

        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to delete user'
        });
    }
};

// Admin: Manage student groups
const manageStudentGroups = async (req, res) => {
    try {
        // Get the student
        const student = await User.findById(req.params.id);

        if (!student || student.role !== 'student') {
            return res.status(404).render('errors/404', {
                title: 'Not Found',
                message: 'Student not found'
            });
        }

        // Get all groups
        const allGroups = await Schedule.getAllGroups();

        // Get student's groups
        const studentGroups = await User.getUserGroups(student.id);

        res.render('admin/student-groups', {
            title: 'Manage Student Groups',
            student,
            allGroups,
            studentGroups
        });
    } catch (error) {
        console.error('Error managing student groups:', error);
        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to load student groups'
        });
    }
};

// Admin: Assign student to group
const assignToGroup = async (req, res) => {
    try {
        const { userId, groupName } = req.body;

        // Assign student to group
        await User.assignToGroup(userId, groupName);

        res.redirect(`/admin/users/${userId}/groups`);
    } catch (error) {
        console.error('Error assigning student to group:', error);
        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to assign student to group'
        });
    }
};

// Admin: Remove student from group
const removeFromGroup = async (req, res) => {
    try {
        const { userId, groupName } = req.params;

        // Remove student from group
        await User.removeFromGroup(userId, groupName);

        res.redirect(`/admin/users/${userId}/groups`);
    } catch (error) {
        console.error('Error removing student from group:', error);
        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to remove student from group'
        });
    }
};

// Get teacher by ID (for AJAX)
const getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await User.findById(id);

        if (!teacher || teacher.role !== 'teacher') {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        // Return only necessary data
        res.json({
            id: teacher.id,
            firstname: teacher.firstname,
            lastname: teacher.lastname
        });
    } catch (error) {
        console.error('Error getting teacher by ID:', error);
        res.status(500).json({ error: 'Failed to get teacher' });
    }
};

// Admin dashboard
const getAdminDashboard = async (req, res) => {
    try {
        // Get counts for dashboard
        const userCounts = {
            total: (await User.findAll()).length,
            students: (await User.findByRole('student')).length,
            teachers: (await User.findByRole('teacher')).length
        };

        const scheduleCount = (await Schedule.findAll()).length;
        const subjectCount = (await Subject.findAll()).length;
        const groupCount = (await Schedule.getAllGroups()).length;

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            userCounts,
            scheduleCount,
            subjectCount,
            groupCount
        });
    } catch (error) {
        console.error('Error getting admin dashboard:', error);
        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to load dashboard'
        });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    resetPassword,
    deleteUser,
    manageStudentGroups,
    assignToGroup,
    removeFromGroup,
    getTeacherById,
    getAdminDashboard
};