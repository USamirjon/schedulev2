// public/js/admin.js
document.addEventListener('DOMContentLoaded', function() {
    // Handle user form modal
    const userFormModal = document.getElementById('userFormModal');
    if (userFormModal) {
        // Open modal for creating new user
        document.getElementById('newUserBtn')?.addEventListener('click', function() {
            document.getElementById('userForm').reset();
            document.getElementById('userFormTitle').textContent = 'Create New User';
            document.getElementById('userForm').action = '/admin/users';
            document.getElementById('userIdInput').value = '';
            document.getElementById('passwordGroup').style.display = 'block';

            // Show the modal
            const modal = new bootstrap.Modal(userFormModal);
            modal.show();
        });

        // Open modal for editing user
        document.querySelectorAll('.edit-user-btn').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                const username = this.getAttribute('data-username');
                const email = this.getAttribute('data-email');
                const role = this.getAttribute('data-role');
                const firstname = this.getAttribute('data-firstname');
                const lastname = this.getAttribute('data-lastname');

                document.getElementById('userFormTitle').textContent = 'Edit User';
                document.getElementById('userForm').action = '/admin/users/update';
                document.getElementById('userIdInput').value = userId;
                document.getElementById('usernameInput').value = username;
                document.getElementById('emailInput').value = email;
                document.getElementById('roleSelect').value = role;
                document.getElementById('firstnameInput').value = firstname;
                document.getElementById('lastnameInput').value = lastname;
                document.getElementById('passwordGroup').style.display = 'none';

                // Show the modal
                const modal = new bootstrap.Modal(userFormModal);
                modal.show();
            });
        });

        // Open modal for resetting password
        document.querySelectorAll('.reset-password-btn').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                const username = this.getAttribute('data-username');

                document.getElementById('resetPasswordTitle').textContent = `Reset Password for ${username}`;
                document.getElementById('resetPasswordForm').action = '/admin/users/reset-password';
                document.getElementById('resetPasswordIdInput').value = userId;

                // Show the modal
                const resetPasswordModal = new bootstrap.Modal(document.getElementById('resetPasswordModal'));
                resetPasswordModal.show();
            });
        });

        // Confirm delete user
        document.querySelectorAll('.delete-user-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                    e.preventDefault();
                }
            });
        });
    }

    // Handle subject form modal
    const subjectFormModal = document.getElementById('subjectFormModal');
    if (subjectFormModal) {
        // Open modal for creating new subject
        document.getElementById('newSubjectBtn')?.addEventListener('click', function() {
            document.getElementById('subjectForm').reset();
            document.getElementById('subjectFormTitle').textContent = 'Create New Subject';
            document.getElementById('subjectForm').action = '/admin/subjects';
            document.getElementById('subjectIdInput').value = '';

            // Show the modal
            const modal = new bootstrap.Modal(subjectFormModal);
            modal.show();
        });

        // Open modal for editing subject
        document.querySelectorAll('.edit-subject-btn').forEach(button => {
            button.addEventListener('click', function() {
                const subjectId = this.getAttribute('data-id');
                const name = this.getAttribute('data-name');
                const description = this.getAttribute('data-description');

                document.getElementById('subjectFormTitle').textContent = 'Edit Subject';
                document.getElementById('subjectForm').action = '/admin/subjects/update';
                document.getElementById('subjectIdInput').value = subjectId;
                document.getElementById('subjectNameInput').value = name;
                document.getElementById('subjectDescriptionInput').value = description;

                // Show the modal
                const modal = new bootstrap.Modal(subjectFormModal);
                modal.show();
            });
        });

        // Confirm delete subject
        document.querySelectorAll('.delete-subject-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                if (!confirm('Are you sure you want to delete this subject? This will also delete all related schedule entries.')) {
                    e.preventDefault();
                }
            });
        });
    }

    // Handle schedule management
    const scheduleFormModal = document.getElementById('scheduleFormModal');
    if (scheduleFormModal) {
        // Initialize time pickers if flatpickr is available
        if (typeof flatpickr === 'function') {
            flatpickr(".time-picker", {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true
            });
        }

        // Open modal for creating new schedule entry
        document.getElementById('newScheduleBtn')?.addEventListener('click', function() {
            document.getElementById('scheduleForm').reset();
            document.getElementById('scheduleFormTitle').textContent = 'Create New Schedule Entry';
            document.getElementById('scheduleForm').action = '/teacher/schedule';
            document.getElementById('scheduleIdInput').value = '';

            // Show the modal
            const modal = new bootstrap.Modal(scheduleFormModal);
            modal.show();
        });

        // Confirm delete schedule entry
        document.querySelectorAll('.delete-schedule-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                if (!confirm('Are you sure you want to delete this schedule entry?')) {
                    e.preventDefault();
                }
            });
        });
    }

    // Handle student group management
    const groupFormModal = document.getElementById('groupFormModal');
    if (groupFormModal) {
        // Open modal for assigning student to group
        document.getElementById('assignGroupBtn')?.addEventListener('click', function() {
            document.getElementById('groupForm').reset();

            // Show the modal
            const modal = new bootstrap.Modal(groupFormModal);
            modal.show();
        });

        // Confirm remove from group
        document.querySelectorAll('.remove-group-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                if (!confirm('Are you sure you want to remove the student from this group?')) {
                    e.preventDefault();
                }
            });
        });
    }

    // Filter tables if search input exists
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const searchValue = this.value.toLowerCase().trim();
            const tableId = this.getAttribute('data-table');
            const table = document.getElementById(tableId);

            if (table) {
                const rows = table.querySelectorAll('tbody tr');

                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchValue) ? '' : 'none';
                });
            }
        });
    }

    // Admin dashboard charts
    if (document.getElementById('usersChart')) {
        renderAdminDashboardCharts();
    }
});

// Render charts for admin dashboard
function renderAdminDashboardCharts() {
    // Users chart
    const usersCtx = document.getElementById('usersChart').getContext('2d');
    const usersData = {
        labels: ['Students', 'Teachers', 'Admins'],
        datasets: [{
            data: [
                parseInt(document.getElementById('studentCount').value || 0),
                parseInt(document.getElementById('teacherCount').value || 0),
                parseInt(document.getElementById('adminCount').value || 0)
            ],
            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
            hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
            hoverBorderColor: "rgba(234, 236, 244, 1)",
        }]
    };

    new Chart(usersCtx, {
        type: 'doughnut',
        data: usersData,
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
            },
            legend: {
                display: true,
                position: 'bottom'
            },
            cutoutPercentage: 70,
        },
    });

    // Schedule distribution chart (if data is available)
    if (document.getElementById('scheduleChart')) {
        const scheduleCtx = document.getElementById('scheduleChart').getContext('2d');
        const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        // Get schedule counts per day from hidden inputs if they exist
        const dayCounts = [];
        for (let i = 1; i <= 7; i++) {
            const countElement = document.getElementById(`day${i}Count`);
            dayCounts.push(countElement ? parseInt(countElement.value || 0) : 0);
        }

        const scheduleData = {
            labels: dayLabels,
            datasets: [{
                label: 'Classes',
                backgroundColor: '#4e73df',
                hoverBackgroundColor: '#2e59d9',
                borderColor: '#4e73df',
                data: dayCounts,
            }]
        };

        new Chart(scheduleCtx, {
            type: 'bar',
            data: scheduleData,
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 7
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0,
                            maxTicksLimit: 5,
                            padding: 10,
                        },
                        gridLines: {
                            color: "rgb(234, 236, 244)",
                            zeroLineColor: "rgb(234, 236, 244)",
                            drawBorder: false,
                            borderDash: [2],
                            zeroLineBorderDash: [2]
                        }
                    }],
                },
                legend: {
                    display: false
                },
                tooltips: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    titleMarginBottom: 10,
                    titleFontColor: '#6e707e',
                    titleFontSize: 14,
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    caretPadding: 10,
                },
            }
        });
    }
}