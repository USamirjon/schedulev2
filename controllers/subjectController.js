// controllers/subjectController.js
const Subject = require('../models/Subject');

// Admin: Get all subjects
const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.findAll();

        res.render('admin/subjects', {
            title: 'Manage Subjects',
            subjects,
            error: null,
            success: null
        });
    } catch (error) {
        console.error('Error getting all subjects:', error);
        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to load subjects'
        });
    }
};

// Admin: Create subject
const createSubject = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validate input
        if (!name) {
            const subjects = await Subject.findAll();
            return res.render('admin/subjects', {
                title: 'Manage Subjects',
                subjects,
                error: 'Subject name is required',
                success: null
            });
        }

        // Create new subject
        await Subject.create({ name, description });

        res.redirect('/admin/subjects');
    } catch (error) {
        console.error('Error creating subject:', error);

        // Check for duplicate key error
        if (error.code === '23505') { // PostgreSQL unique violation error code
            const subjects = await Subject.findAll();
            return res.render('admin/subjects', {
                title: 'Manage Subjects',
                subjects,
                error: 'A subject with this name already exists',
                success: null
            });
        }

        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to create subject'
        });
    }
};

// Admin: Update subject
const updateSubject = async (req, res) => {
    try {
        const { id, name, description } = req.body;

        // Validate input
        if (!name) {
            const subjects = await Subject.findAll();
            return res.render('admin/subjects', {
                title: 'Manage Subjects',
                subjects,
                error: 'Subject name is required',
                success: null
            });
        }

        // Update subject
        await Subject.update(id, { name, description });

        res.redirect('/admin/subjects');
    } catch (error) {
        console.error('Error updating subject:', error);

        // Check for duplicate key error
        if (error.code === '23505') { // PostgreSQL unique violation error code
            const subjects = await Subject.findAll();
            return res.render('admin/subjects', {
                title: 'Manage Subjects',
                subjects,
                error: 'A subject with this name already exists',
                success: null
            });
        }

        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to update subject'
        });
    }
};

// Admin: Delete subject
const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete subject
        await Subject.delete(id);

        res.redirect('/admin/subjects');
    } catch (error) {
        console.error('Error deleting subject:', error);
        res.status(500).render('errors/500', {
            title: 'Error',
            message: 'Failed to delete subject'
        });
    }
};

// Get subject details (API endpoint)
const getSubjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findById(id);

        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        res.json(subject);
    } catch (error) {
        console.error('Error getting subject by ID:', error);
        res.status(500).json({ error: 'Failed to get subject' });
    }
};

module.exports = {
    getAllSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
    getSubjectById
};