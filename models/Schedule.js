// models/Schedule.js
const db = require('../config/db');

class Schedule {
    constructor(id, subjectId, teacherId, dayOfWeek, startTime, endTime, groupName, location) {
        this.id = id;
        this.subjectId = subjectId;
        this.teacherId = teacherId;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.groupName = groupName;
        this.location = location;
    }

    // Find schedule by ID
    static async findById(id) {
        try {
            const result = await db.query(
                'SELECT * FROM schedule WHERE id = $1',
                [id]
            );
            if (result.rows.length === 0) return null;
            const schedule = result.rows[0];
            return new Schedule(
                schedule.id,
                schedule.subject_id,
                schedule.teacher_id,
                schedule.day_of_week,
                schedule.start_time,
                schedule.end_time,
                schedule.group_name,
                schedule.location
            );
        } catch (error) {
            console.error('Error finding schedule by ID:', error);
            throw error;
        }
    }

    // Find all schedule entries
    static async findAll() {
        try {
            const result = await db.query(`
        SELECT s.*, 
               sub.name as subject_name, 
               u.firstname as teacher_firstname, 
               u.lastname as teacher_lastname
        FROM schedule s
        JOIN subjects sub ON s.subject_id = sub.id
        JOIN users u ON s.teacher_id = u.id
        ORDER BY s.day_of_week, s.start_time
      `);
            return result.rows;
        } catch (error) {
            console.error('Error finding all schedule entries:', error);
            throw error;
        }
    }

    // Find schedule by teacher ID
    static async findByTeacher(teacherId) {
        try {
            const result = await db.query(`
        SELECT s.*, 
               sub.name as subject_name, 
               u.firstname as teacher_firstname, 
               u.lastname as teacher_lastname
        FROM schedule s
        JOIN subjects sub ON s.subject_id = sub.id
        JOIN users u ON s.teacher_id = u.id
        WHERE s.teacher_id = $1
        ORDER BY s.day_of_week, s.start_time
      `, [teacherId]);
            return result.rows;
        } catch (error) {
            console.error('Error finding schedule by teacher:', error);
            throw error;
        }
    }

    // Find schedule by group
    static async findByGroup(groupName) {
        try {
            const result = await db.query(`
        SELECT s.*, 
               sub.name as subject_name, 
               u.firstname as teacher_firstname, 
               u.lastname as teacher_lastname
        FROM schedule s
        JOIN subjects sub ON s.subject_id = sub.id
        JOIN users u ON s.teacher_id = u.id
        WHERE s.group_name = $1
        ORDER BY s.day_of_week, s.start_time
      `, [groupName]);
            return result.rows;
        } catch (error) {
            console.error('Error finding schedule by group:', error);
            throw error;
        }
    }

    // Find schedule for a specific student (based on their groups)
    static async findByStudent(userId) {
        try {
            const result = await db.query(`
        SELECT s.*, 
               sub.name as subject_name, 
               u.firstname as teacher_firstname, 
               u.lastname as teacher_lastname
        FROM schedule s
        JOIN subjects sub ON s.subject_id = sub.id
        JOIN users u ON s.teacher_id = u.id
        JOIN user_groups ug ON s.group_name = ug.group_name
        WHERE ug.user_id = $1
        ORDER BY s.day_of_week, s.start_time
      `, [userId]);
            return result.rows;
        } catch (error) {
            console.error('Error finding schedule by student:', error);
            throw error;
        }
    }

    // Create a new schedule entry
    static async create(scheduleData) {
        try {
            const { subjectId, teacherId, dayOfWeek, startTime, endTime, groupName, location } = scheduleData;

            const result = await db.query(
                `INSERT INTO schedule 
         (subject_id, teacher_id, day_of_week, start_time, end_time, group_name, location) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
                [subjectId, teacherId, dayOfWeek, startTime, endTime, groupName, location]
            );

            return result.rows[0];
        } catch (error) {
            console.error('Error creating schedule entry:', error);
            throw error;
        }
    }

    // Update schedule entry
    static async update(id, scheduleData) {
        try {
            const { subjectId, teacherId, dayOfWeek, startTime, endTime, groupName, location } = scheduleData;

            const result = await db.query(
                `UPDATE schedule 
         SET subject_id = $1, 
             teacher_id = $2, 
             day_of_week = $3, 
             start_time = $4, 
             end_time = $5, 
             group_name = $6, 
             location = $7, 
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING *`,
                [subjectId, teacherId, dayOfWeek, startTime, endTime, groupName, location, id]
            );

            if (result.rows.length === 0) return null;
            return result.rows[0];
        } catch (error) {
            console.error('Error updating schedule entry:', error);
            throw error;
        }
    }

    // Delete schedule entry
    static async delete(id) {
        try {
            await db.query('DELETE FROM schedule WHERE id = $1', [id]);
            return true;
        } catch (error) {
            console.error('Error deleting schedule entry:', error);
            throw error;
        }
    }

    // Get all unique group names
    static async getAllGroups() {
        try {
            const result = await db.query(
                'SELECT DISTINCT group_name FROM schedule ORDER BY group_name'
            );
            return result.rows.map(row => row.group_name);
        } catch (error) {
            console.error('Error getting all groups:', error);
            throw error;
        }
    }
}

module.exports = Schedule;
