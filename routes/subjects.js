// routes/subjects.js
const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');

// Admin only routes
router.get('/', auth, isAdmin, subjectController.getAllSubjects);
router.post('/', auth, isAdmin, subjectController.createSubject);
router.post('/update', auth, isAdmin, subjectController.updateSubject);
router.get('/:id/delete', auth, isAdmin, subjectController.deleteSubject);

// API routes
router.get('/api/:id', auth, subjectController.getSubjectById);

module.exports = router;