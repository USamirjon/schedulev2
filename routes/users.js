// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAdmin } = require('../middleware/roles');

// Require admin role for all routes in this file
router.use(isAdmin);

// Admin dashboard
router.get('/dashboard', userController.getAdminDashboard);

// User management routes
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.post('/users/update', userController.updateUser);
router.post('/users/reset-password', userController.resetPassword);
router.get('/users/:id/delete', userController.deleteUser);

// Student group management
router.get('/users/:id/groups', userController.manageStudentGroups);
router.post('/users/groups', userController.assignToGroup);
router.get('/users/:userId/groups/:groupName/remove', userController.removeFromGroup);

// API endpoints
router.get('/api/teachers/:id', userController.getTeacherById);

module.exports = router;