// middleware/roles.js

// Middleware to check if user has required role
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).redirect('/auth/login');
        }

        // If roles is a string, convert to array
        const requiredRoles = typeof roles === 'string' ? [roles] : roles;

        if (requiredRoles.includes(req.user.role)) {
            return next();
        }

        return res.status(403).render('errors/403', {
            title: 'Access Denied',
            message: 'You do not have permission to access this resource.'
        });
    };
};

// Admin role check
const isAdmin = checkRole('admin');

// Teacher role check
const isTeacher = checkRole(['admin', 'teacher']);

// Student role check
const isStudent = checkRole(['admin', 'student']);

module.exports = {
    checkRole,
    isAdmin,
    isTeacher,
    isStudent
};