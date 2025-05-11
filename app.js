// app.js
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize database
db.setupDatabase().catch(console.error);

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const subjectRoutes = require('./routes/subjects');
const scheduleRoutes = require('./routes/schedule');
const { auth } = require('./middleware/auth');

app.use('/auth', authRoutes);
app.use('/admin', auth, userRoutes);
app.use('/subjects', auth, subjectRoutes);
app.use('/', auth, scheduleRoutes);

// Home route
app.get('/', auth, (req, res) => {
    switch (req.user.role) {
        case 'admin':
            res.redirect('/admin/dashboard');
            break;
        case 'teacher':
            res.redirect('/teacher/schedule');
            break;
        case 'student':
            res.redirect('/student/schedule');
            break;
        default:
            res.redirect('/auth/login');
    }
});

// Error handling
app.use((req, res, next) => {
    res.status(404).render('errors/404', {
        title: 'Page Not Found',
        message: 'The page you are looking for does not exist'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('errors/500', {
        title: 'Server Error',
        message: 'Something went wrong on our end'
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;