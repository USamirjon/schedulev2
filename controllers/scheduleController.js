// controllers/scheduleController.js
const Schedule = require('../models/Schedule');
const Subject = require('../models/Subject');
const User = require('../models/User');

// Display schedule for students
const getStudentSchedule = async (req, res) => {
    try {
        // Get student's schedule based on their groups
        const scheduleEntries = await Schedule.findByStudent(req.user.id);

        // Get student's groups for filtering
        const userGroups = await User.getUserGroups(req.user.id);

        res.render('student/schedule', {
            title: 'My Schedule',
            scheduleEntries,
            userGroups,
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        });
    } catch (error) {
        console.error('Error getting student schedule:', error);
        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to load schedule'
        });
    }
};

// Display schedule for teachers
const getTeacherSchedule = async (req, res) => {
    try {
        // Get teacher's schedule
        const scheduleEntries = await Schedule.findByTeacher(req.user.id);

        res.render('teacher/schedule', {
            title: 'My Teaching Schedule',
            scheduleEntries,
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        });
    } catch (error) {
        console.error('Error getting teacher schedule:', error);
        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to load schedule'
        });
    }
};

// Display schedule management for teachers
const getManageSchedule = async (req, res) => {
    try {
        // Get teacher's schedule
        const scheduleEntries = await Schedule.findByTeacher(req.user.id);

        // Get subjects for creating new entries
        const subjects = await Subject.findAll();

        // Get all groups
        const groups = await Schedule.getAllGroups();

        res.render('teacher/manage-schedule', {
            title: 'Manage Schedule',
            scheduleEntries,
            subjects,
            groups,
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        });
    } catch (error) {
        console.error('Error getting manage schedule page:', error);
        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to load schedule management page'
        });
    }
};

// Create new schedule entry (for teachers)
const createScheduleEntry = async (req, res) => {
    try {
        const { subjectId, dayOfWeek, startTime, endTime, groupName, location } = req.body;

        // Create new schedule entry
        await Schedule.create({
            subjectId,
            teacherId: req.user.id,
            dayOfWeek,
            startTime,
            endTime,
            groupName,
            location
        });

        res.redirect('/teacher/manage-schedule');
    } catch (error) {
        console.error('Error creating schedule entry:', error);
        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to create schedule entry'
        });
    }
};

// Update schedule entry (for teachers)
const updateScheduleEntry = async (req, res) => {
    try {
        const { id, subjectId, dayOfWeek, startTime, endTime, groupName, location } = req.body;

        // Check if the schedule entry exists and belongs to this teacher
        const scheduleEntry = await Schedule.findById(id);

        if (!scheduleEntry || scheduleEntry.teacherId !== req.user.id) {
            return res.status(403).render('errors/403', {
                title: 'Access Denied',
                message: 'You do not have permission to update this schedule entry'
            });
        }

        // Update schedule entry
        await Schedule.update(id, {
            subjectId,
            teacherId: req.user.id,
            dayOfWeek,
            startTime,
            endTime,
            groupName,
            location
        });

        res.redirect('/teacher/manage-schedule');
    } catch (error) {
        console.error('Error updating schedule entry:', error);
        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to update schedule entry'
        });
    }
};

// Delete schedule entry (for teachers)
const deleteScheduleEntry = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the schedule entry exists and belongs to this teacher
        const scheduleEntry = await Schedule.findById(id);

        if (!scheduleEntry || scheduleEntry.teacherId !== req.user.id) {
            return res.status(403).render('errors/403', {
                title: 'Access Denied',
                message: 'You do not have permission to delete this schedule entry'
            });
        }

        // Delete schedule entry
        await Schedule.delete(id);

        res.redirect('/teacher/manage-schedule');
    } catch (error) {
        console.error('Error deleting schedule entry:', error);
        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to delete schedule entry'
        });
    }
};

// Admin: View all schedules
const getAllSchedules = async (req, res) => {
    try {
        // Get all schedule entries
        const scheduleEntries = await Schedule.findAll();

        // Get all groups for filtering
        const groups = await Schedule.getAllGroups();

        // Get all teachers for filtering
        const teachers = await User.findByRole('teacher');

        res.render('admin/schedules', {
            title: 'All Schedules',
            scheduleEntries,
            groups,
            teachers,
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        });
    } catch (error) {
        console.error('Error getting all schedules:', error);
        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to load schedules'
        });
    }
};

module.exports = {
    getStudentSchedule,
    getTeacherSchedule,
    getManageSchedule,
    createScheduleEntry,
    updateScheduleEntry,
    deleteScheduleEntry,
    getAllSchedules
};