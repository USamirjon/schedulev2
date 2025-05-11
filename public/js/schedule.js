// schedule.js - Handles client-side functionality for schedule management

document.addEventListener('DOMContentLoaded', function() {
    // Initialize time picker for schedule forms
    const timeInputs = document.querySelectorAll('input[type="time"]');
    if (timeInputs.length > 0) {
        timeInputs.forEach(input => {
            // Optional: Add any time picker initialization code here if needed
        });
    }

    // Schedule form validation
    const scheduleForm = document.getElementById('schedule-form');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', function(e) {
            const subjectId = document.getElementById('subject-id').value;
            const dayOfWeek = document.getElementById('day-of-week').value;
            const startTime = document.getElementById('start-time').value;
            const endTime = document.getElementById('end-time').value;
            const groupName = document.getElementById('group-name').value;
            let isValid = true;

            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => {
                el.textContent = '';
            });

            // Validate subject
            if (!subjectId) {
                document.getElementById('subject-error').textContent = 'Please select a subject';
                isValid = false;
            }

            // Validate day of week
            if (!dayOfWeek) {
                document.getElementById('day-error').textContent = 'Please select a day';
                isValid = false;
            }

            // Validate start time
            if (!startTime) {
                document.getElementById('start-time-error').textContent = 'Start time is required';
                isValid = false;
            }

            // Validate end time
            if (!endTime) {
                document.getElementById('end-time-error').textContent = 'End time is required';
                isValid = false;
            } else if (startTime && endTime && endTime <= startTime) {
                document.getElementById('end-time-error').textContent = 'End time must be after start time';
                isValid = false;
            }

            // Validate group name
            if (!groupName) {
                document.getElementById('group-error').textContent = 'Group name is required';
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    }

    // Delete confirmation
    const deleteButtons = document.querySelectorAll('.delete-schedule-btn');
    if (deleteButtons.length > 0) {
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (!confirm('Are you sure you want to delete this schedule entry?')) {
                    e.preventDefault();
                }
            });
        });
    }

    // Edit schedule functionality
    const editButtons = document.querySelectorAll('.edit-schedule-btn');
    if (editButtons.length > 0) {
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const scheduleId = this.getAttribute('data-id');

                // Find the schedule data in the data attributes
                const subjectId = this.getAttribute('data-subject');
                const dayOfWeek = this.getAttribute('data-day');
                const startTime = this.getAttribute('data-start');
                const endTime = this.getAttribute('data-end');
                const groupName = this.getAttribute('data-group');
                const location = this.getAttribute('data-location');

                // Update the form fields
                document.getElementById('schedule-id').value = scheduleId;
                document.getElementById('subject-id').value = subjectId;
                document.getElementById('day-of-week').value = dayOfWeek;
                document.getElementById('start-time').value = startTime;
                document.getElementById('end-time').value = endTime;
                document.getElementById('group-name').value = groupName;
                document.getElementById('location').value = location || '';

                // Change form action and button text
                document.getElementById('schedule-form').action = '/teacher/schedule/update';
                document.getElementById('submit-btn').textContent = 'Update Schedule';

                // Scroll to the form
                document.getElementById('schedule-form-card').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }

    // Filter schedule by day of week
    const dayFilter = document.getElementById('filter-day');
    if (dayFilter) {
        dayFilter.addEventListener('change', function() {
            const day = this.value;
            const scheduleRows = document.querySelectorAll('.schedule-day');

            if (day === 'all') {
                scheduleRows.forEach(row => {
                    row.style.display = 'table-row';
                });
            } else {
                scheduleRows.forEach(row => {
                    if (row.getAttribute('data-day') === day) {
                        row.style.display = 'table-row';
                    } else {
                        row.style.display = 'none';
                    }
                });
            }
        });
    }

    // Filter schedule by group (for admin view)
    const groupFilter = document.getElementById('filter-group');
    if (groupFilter) {
        groupFilter.addEventListener('change', function() {
            const group = this.value;
            const scheduleItems = document.querySelectorAll('.schedule-item');

            if (group === 'all') {
                scheduleItems.forEach(item => {
                    item.style.display = 'block';
                });
            } else {
                scheduleItems.forEach(item => {
                    if (item.getAttribute('data-group') === group) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    }

    // Filter schedule by teacher (for admin view)
    const teacherFilter = document.getElementById('filter-teacher');
    if (teacherFilter) {
        teacherFilter.addEventListener('change', function() {
            const teacherId = this.value;
            const scheduleItems = document.querySelectorAll('.schedule-item');

            if (teacherId === 'all') {
                scheduleItems.forEach(item => {
                    item.style.display = 'block';
                });
            } else {
                scheduleItems.forEach(item => {
                    if (item.getAttribute('data-teacher') === teacherId) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    }

    // Reset schedule form
    const resetFormButton = document.getElementById('reset-form-btn');
    if (resetFormButton) {
        resetFormButton.addEventListener('click', function() {
            // Reset form fields
            document.getElementById('schedule-id').value = '';
            document.getElementById('schedule-form').reset();

            // Change form action and button text back to create mode
            document.getElementById('schedule-form').action = '/teacher/schedule/create';
            document.getElementById('submit-btn').textContent = 'Create Schedule';
        });
    }

    // Show current week schedule by default
    const showCurrentDaySchedule = function() {
        const today = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.
        const scheduleDayIndex = today === 0 ? 7 : today; // Convert to 1-7 where 1 is Monday and 7 is Sunday

        // Highlight current day in the schedule
        const todayElements = document.querySelectorAll(`.schedule-day[data-day="${scheduleDayIndex}"]`);
        if (todayElements.length > 0) {
            todayElements.forEach(element => {
                element.classList.add('current-day');
            });
        }
    };

    showCurrentDaySchedule();

    // Fetch subject details for edit modal (if applicable)
    const fetchSubjectDetails = function(subjectId, callback) {
        fetch(`/subjects/api/${subjectId}`)
            .then(response => response.json())
            .then(data => {
                callback(null, data);
            })
            .catch(error => {
                callback(error);
            });
    };

    // Fetch teacher details for displaying in schedule
    const fetchTeacherDetails = function(teacherId, callback) {
        fetch(`/admin/api/teachers/${teacherId}`)
            .then(response => response.json())
            .then(data => {
                callback(null, data);
            })
            .catch(error => {
                callback(error);
            });
    };

    // Create time slots for schedule table
    const createTimeTable = function() {
        const scheduleTable = document.getElementById('schedule-time-table');
        if (!scheduleTable) return;

        // Create time slots from 8:00 to 20:00
        const startHour = 8;
        const endHour = 20;
        const timeSlots = [];

        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                timeSlots.push(timeSlot);
            }
        }

        // Add time slots to the table
        const tbody = scheduleTable.querySelector('tbody');
        if (tbody) {
            timeSlots.forEach((timeSlot, index) => {
                if (index % 2 === 0) {
                    const tr = document.createElement('tr');
                    tr.className = 'time-slot';
                    tr.setAttribute('data-time', timeSlot);

                    const tdTime = document.createElement('td');
                    tdTime.className = 'time-cell';
                    tdTime.textContent = timeSlot;
                    tr.appendChild(tdTime);

                    // Add cells for each day
                    for (let day = 1; day <= 7; day++) {
                        const tdDay = document.createElement('td');
                        tdDay.className = 'day-cell';
                        tdDay.setAttribute('data-day', day);
                        tdDay.setAttribute('data-time', timeSlot);
                        tr.appendChild(tdDay);
                    }

                    tbody.appendChild(tr);
                }
            });
        }
    };

    // Initialize time table if needed
    if (document.getElementById('schedule-time-table')) {
        createTimeTable();
    }

    // Calendar view toggle (if implemented)
    const viewToggleButtons = document.querySelectorAll('.view-toggle');
    if (viewToggleButtons.length > 0) {
        viewToggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const view = this.getAttribute('data-view');

                // Remove active class from all buttons
                viewToggleButtons.forEach(btn => {
                    btn.classList.remove('active');
                });

                // Add active class to clicked button
                this.classList.add('active');

                // Show/hide relevant views
                const listView = document.getElementById('list-view');
                const calendarView = document.getElementById('calendar-view');

                if (view === 'list') {
                    listView.style.display = 'block';
                    calendarView.style.display = 'none';
                } else {
                    listView.style.display = 'none';
                    calendarView.style.display = 'block';
                }
            });
        });
    }
});