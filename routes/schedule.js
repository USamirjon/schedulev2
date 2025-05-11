// routes/schedule.js
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { auth } = require('../middleware/auth');
const { isAdmin, isTeacher, isStudent } = require('../middleware/roles');

// Student routes
router.get('/student/schedule', auth, isStudent, scheduleController.getStudentSchedule);

// Teacher routes
router.get('/teacher/schedule', auth, isTeacher, scheduleController.getTeacherSchedule);
router.get('/teacher/manage-schedule', auth, isTeacher, scheduleController.getManageSchedule);
router.post('/teacher/schedule', auth, isTeacher, scheduleController.createScheduleEntry);
router.post('/teacher/schedule/update', auth, isTeacher, scheduleController.updateScheduleEntry);
router.get('/teacher/schedule/:id/delete', auth, isTeacher, scheduleController.deleteScheduleEntry);

// Admin routes
router.get('/admin/schedules', auth, isAdmin, scheduleController.getAllSchedules);

module.exports = router;