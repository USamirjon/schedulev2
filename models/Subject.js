// models/Subject.js
const db = require('../config/db');

class Subject {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    // Find subject by ID
    static async findById(id) {
        try {
            const result = await db.query(
                'SELECT * FROM subjects WHERE id = $1',
                [id]
            );
            if (result.rows.length === 0) return null;
            const subject = result.rows[0];
            return new Subject(
                subject.id,
                subject.name,
                subject.description
            );
        } catch (error) {
            console.error('Error finding subject by ID:', error);
            throw error;
        }
    }

    // Find all subjects
    static async findAll() {
        try {
            const result = await db.query(
                'SELECT * FROM subjects ORDER BY name'
            );
            return result.rows;
        } catch (error) {
            console.error('Error finding all subjects:', error);
            throw error;
        }
    }

    // Create a new subject
    static async create(subjectData) {
        try {
            const { name, description } = subjectData;

            const result = await db.query(
                `INSERT INTO subjects (name, description) 
         VALUES ($1, $2) 
         RETURNING *`,
                [name, description]
            );

            return result.rows[0];
        } catch (error) {
            console.error('Error creating subject:', error);
            throw error;
        }
    }

    // Update subject
    static async update(id, subjectData) {
        try {
            const { name, description } = subjectData;

            const result = await db.query(
                `UPDATE subjects 
         SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
                [name, description, id]
            );

            if (result.rows.length === 0) return null;
            return result.rows[0];
        } catch (error) {
            console.error('Error updating subject:', error);
            throw error;
        }
    }

    // Delete subject
    static async delete(id) {
        try {
            await db.query('DELETE FROM subjects WHERE id = $1', [id]);
            return true;
        } catch (error) {
            console.error('Error deleting subject:', error);
            throw error;
        }
    }
}

module.exports = Subject;