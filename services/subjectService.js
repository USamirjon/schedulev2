// services/subjectService.js
const Subject = require('../models/Subject');
const Schedule = require('../models/Schedule');

/**
 * Service to handle subject-related operations
 */
class SubjectService {
    /**
     * Get all subjects
     * @returns {Promise<Array>} - All subjects
     */
    static async getAllSubjects() {
        try {
            return await Subject.findAll();
        } catch (error) {
            console.error('Error getting all subjects:', error);
            throw error;
        }
    }

    /**
     * Get subject by ID
     * @param {number} id - Subject ID
     * @returns {Promise<Object|null>} - Subject object or null if not found
     */
    static async getSubjectById(id) {
        try {
            return await Subject.findById(id);
        } catch (error) {
            console.error('Error getting subject by ID:', error);
            throw error;
        }
    }

    /**
     * Create a new subject
     * @param {Object} subjectData - Subject data including name and description
     * @returns {Promise<Object>} - Created subject object
     */
    static async createSubject(subjectData) {
        try {
            // Validate subject data
            if (!subjectData.name) {
                throw new Error('Subject name is required');
            }

            return await Subject.create(subjectData);
        } catch (error) {
            console.error('Error creating subject:', error);
            throw error;
        }
    }

    /**
     * Update a subject
     * @param {number} id - Subject ID
     * @param {Object} subjectData - Updated subject data
     * @returns {Promise<Object|null>} - Updated subject object or null if not found
     */
    static async updateSubject(id, subjectData) {
        try {
            // Validate subject data
            if (!subjectData.name) {
                throw new Error('Subject name is required');
            }

            return await Subject.update(id, subjectData);
        } catch (error) {
            console.error('Error updating subject:', error);
            throw error;
        }
    }

    /**
     * Delete a subject
     * @param {number} id - Subject ID
     * @returns {Promise<boolean>} - True if deleted successfully
     */
    static async deleteSubject(id) {
        try {
            // Check if subject is used in any schedule entries
            const schedules = await Schedule.findAll();
            const subjectInUse = schedules.some(schedule => schedule.subject_id === parseInt(id));

            if (subjectInUse) {
                throw new Error('Cannot delete subject that is in use in schedule');
            }

            return await Subject.delete(id);
        } catch (error) {
            console.error('Error deleting subject:', error);
            throw error;
        }
    }

    /**
     * Get subjects with their usage stats
     * @returns {Promise<Array>} - Subjects with usage stats
     */
    static async getSubjectsWithStats() {
        try {
            const subjects = await Subject.findAll();
            const schedules = await Schedule.findAll();

            // Count usage of each subject in schedules
            return subjects.map(subject => {
                const usageCount = schedules.filter(schedule =>
                    schedule.subject_id === subject.id
                ).length;

                return {
                    ...subject,
                    usageCount
                };
            });
        } catch (error) {
            console.error('Error getting subjects with stats:', error);
            throw error;
        }
    }
}

module.exports = SubjectService;