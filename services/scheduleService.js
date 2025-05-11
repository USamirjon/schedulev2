// services/scheduleService.js
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const Subject = require('../models/Subject');

/**
 * Service to handle schedule-related operations
 */
class ScheduleService {
    /**
     * Get schedule for a student
     * @param {number} studentId - ID of the student
     * @returns {Promise<Array>} - Student's schedule entries
     */
    static async getStudentSchedule(studentId) {
        try {
            const scheduleEntries = await Schedule.findByStudent(studentId);
            return this.formatScheduleData(scheduleEntries);
        } catch (error) {
            console.error('Error getting student schedule:', error);
            throw error;
        }
    }

    /**
     * Get schedule for a teacher
     * @param {number} teacherId - ID of the teacher
     * @returns {Promise<Array>} - Teacher's schedule entries
     */
    static async getTeacherSchedule(teacherId) {
        try {
            const scheduleEntries = await Schedule.findByTeacher(teacherId);
            return this.formatScheduleData(scheduleEntries);
        } catch (error) {
            console.error('Error getting teacher schedule:', error);
            throw error;
        }
    }

    /**
     * Get all schedules (for admin)
     * @returns {Promise<Array>} - All schedule entries
     */
    static async getAllSchedules() {
        try {
            const scheduleEntries = await Schedule.findAll();
            return this.formatScheduleData(scheduleEntries);
        } catch (error) {
            console.error('Error getting all schedules:', error);
            throw error;
        }
    }

    /**
     * Format schedule data for frontend display
     * @param {Array} scheduleEntries - Raw schedule entries from database
     * @returns {Array} - Formatted schedule entries
     */
    static formatScheduleData(scheduleEntries) {
        // Group schedules by day of week
        const groupedByDay = {};

        scheduleEntries.forEach(entry => {
            const dayIndex = entry.day_of_week;
            if (!groupedByDay[dayIndex]) {
                groupedByDay[dayIndex] = [];
            }

            // Format time for display
            const startTime = entry.start_time.substring(0, 5);
            const endTime = entry.end_time.substring(0, 5);

            groupedByDay[dayIndex].push({
                ...entry,
                formattedTime: `${startTime} - ${endTime}`,
                teacherName: `${entry.teacher_firstname} ${entry.teacher_lastname}`
            });
        });

        return groupedByDay;
    }

    /**
     * Check for schedule conflicts
     * @param {Object} scheduleData - Schedule data to check
     * @returns {Promise<boolean>} - True if there's a conflict, false otherwise
     */
    static async checkConflicts(scheduleData) {
        try {
            const { teacherId, dayOfWeek, startTime, endTime, id = null } = scheduleData;

            // Check for conflicts in teacher's schedule
            const teacherSchedule = await Schedule.findByTeacher(teacherId);

            const conflict = teacherSchedule.some(entry => {
                // Skip comparing with itself when updating
                if (id && entry.id === parseInt(id)) {
                    return false;
                }

                // Only check entries for the same day
                if (entry.day_of_week !== parseInt(dayOfWeek)) {
                    return false;
                }

                // Convert times to Date objects for easier comparison
                const entryStart = new Date(`1970-01-01T${entry.start_time}`);
                const entryEnd = new Date(`1970-01-01T${entry.end_time}`);
                const newStart = new Date(`1970-01-01T${startTime}`);
                const newEnd = new Date(`1970-01-01T${endTime}`);

                // Check for overlap
                return (
                    (newStart >= entryStart && newStart < entryEnd) || // New start time is during existing slot
                    (newEnd > entryStart && newEnd <= entryEnd) || // New end time is during existing slot
                    (newStart <= entryStart && newEnd >= entryEnd) // New slot completely covers existing slot
                );
            });

            return conflict;
        } catch (error) {
            console.error('Error checking schedule conflicts:', error);
            throw error;
        }
    }
}

module.exports = ScheduleService;