// auth.js - Handles client-side form validation for authentication forms

document.addEventListener('DOMContentLoaded', function() {
    // Login form validation
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            let isValid = true;
            let errorMessage = '';

            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => {
                el.textContent = '';
            });

            // Validate username
            if (!username) {
                errorMessage = 'Username is required';
                document.getElementById('username-error').textContent = errorMessage;
                isValid = false;
            }

            // Validate password
            if (!password) {
                errorMessage = 'Password is required';
                document.getElementById('password-error').textContent = errorMessage;
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    }

    // Registration form validation
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();
            const email = document.getElementById('email').value.trim();
            const firstname = document.getElementById('firstname').value.trim();
            const lastname = document.getElementById('lastname').value.trim();
            let isValid = true;

            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => {
                el.textContent = '';
            });

            // Validate username
            if (!username) {
                document.getElementById('username-error').textContent = 'Username is required';
                isValid = false;
            } else if (username.length < 3) {
                document.getElementById('username-error').textContent = 'Username must be at least 3 characters';
                isValid = false;
            }

            // Validate password
            if (!password) {
                document.getElementById('password-error').textContent = 'Password is required';
                isValid = false;
            } else if (password.length < 6) {
                document.getElementById('password-error').textContent = 'Password must be at least 6 characters';
                isValid = false;
            }

            // Validate password confirmation
            if (password !== confirmPassword) {
                document.getElementById('confirm-password-error').textContent = 'Passwords do not match';
                isValid = false;
            }

            // Validate email
            if (!email) {
                document.getElementById('email-error').textContent = 'Email is required';
                isValid = false;
            } else if (!isValidEmail(email)) {
                document.getElementById('email-error').textContent = 'Please enter a valid email address';
                isValid = false;
            }

            // Validate first name
            if (!firstname) {
                document.getElementById('firstname-error').textContent = 'First name is required';
                isValid = false;
            }

            // Validate last name
            if (!lastname) {
                document.getElementById('lastname-error').textContent = 'Last name is required';
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    }

    // Password change form validation
    const passwordChangeForm = document.getElementById('password-change-form');
    if (passwordChangeForm) {
        passwordChangeForm.addEventListener('submit', function(e) {
            const currentPassword = document.getElementById('current-password').value.trim();
            const newPassword = document.getElementById('new-password').value.trim();
            const confirmNewPassword = document.getElementById('confirm-new-password').value.trim();
            let isValid = true;

            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => {
                el.textContent = '';
            });

            // Validate current password
            if (!currentPassword) {
                document.getElementById('current-password-error').textContent = 'Current password is required';
                isValid = false;
            }

            // Validate new password
            if (!newPassword) {
                document.getElementById('new-password-error').textContent = 'New password is required';
                isValid = false;
            } else if (newPassword.length < 6) {
                document.getElementById('new-password-error').textContent = 'New password must be at least 6 characters';
                isValid = false;
            }

            // Validate password confirmation
            if (newPassword !== confirmNewPassword) {
                document.getElementById('confirm-new-password-error').textContent = 'Passwords do not match';
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    }

    // Helper function to validate email format
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Password toggle visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    if (togglePasswordButtons.length > 0) {
        togglePasswordButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);

                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    this.textContent = 'Hide';
                } else {
                    passwordInput.type = 'password';
                    this.textContent = 'Show';
                }
            });
        });
    }

    // Show alert messages for a few seconds before fading out
    const alerts = document.querySelectorAll('.alert');
    if (alerts.length > 0) {
        setTimeout(() => {
            alerts.forEach(alert => {
                alert.style.transition = 'opacity 1s';
                alert.style.opacity = '0';

                setTimeout(() => {
                    alert.style.display = 'none';
                }, 1000);
            });
        }, 5000);
    }
});