const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// need to add the function to add user with superior role

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
            is_superior: true
        };
   }

    static async createSuperiorUser(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        const query = `
            INSERT INTO users (username, password, is_superior) 
            VALUES (?, ?, ?)
        `;
        
        const values = [
            data.username,
            hashedPassword,
            data.is_superior ? 1 : 0
        ];

        const [result] = await pool.execute(query, values);
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await pool.execute(
            'SELECT id, username, is_superior FROM users'
        );
        return rows;
    }
}

module.exports = User;