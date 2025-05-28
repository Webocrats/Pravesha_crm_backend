const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const getAllUsers = async () => {
    const [rows] = await pool.execute(
        'SELECT id, username, is_superior FROM users'
    );
    return rows;
};

const createUser = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword]
    );
    return {
        id: result.insertId,
        username,
        is_superior: false
    };
};

const getUserById = async (id) => {
    const [rows] = await pool.execute(
        'SELECT id, username, is_superior FROM users WHERE id = ?',
        [id]
    );
    return rows[0];
};

module.exports = {
    getAllUsers,
    createUser,
    getUserById
};