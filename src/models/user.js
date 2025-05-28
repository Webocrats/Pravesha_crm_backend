const pool = require('../config/database');

class User {
    static async findByUsername(username) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id, username, is_superior FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async create(username, password) {
        const [result] = await pool.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password]
        );
        return {
            id: result.insertId,
            username,
            is_superior: false
        };
    }

    static async getAll() {
        const [rows] = await pool.execute(
            'SELECT id, username, is_superior FROM users'
        );
        return rows;
    }
}

module.exports = User;