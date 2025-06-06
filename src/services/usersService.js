const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { ValidationError, AuthenticationError } = require('../utils/errors');
require('dotenv').config();

const registerUser = async (username, password) => {
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create(username, hashedPassword);
    
    const token = jwt.sign(
        { 
            id: user.id, 
            username: user.username,
            is_superior: user.is_superior 
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { message: 'User registered successfully', token };
};

const loginUser = async (username, password) => {
    const user = await User.findByUsername(username);
    if (!user) {
        throw new AuthenticationError('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new AuthenticationError('Invalid password');
    }

    const token = jwt.sign(
        { 
            id: user.id, 
            username: user.username,
            is_superior: user.is_superior 
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { 
        token,
        userId: user.id,  // Explicitly include userId in response
        message: 'Login successful'
    };
};

const checkHealth = async () => {
    return {
        status: 'OK',
        message: 'Server is running properly',
        timestamp: new Date().toISOString()
    };
};

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
    if (!id) {
        throw new ValidationError('User ID is required');
    }

    const [rows] = await pool.execute(
        'SELECT id, username, is_superior FROM users WHERE id = ?',
        [id]
    );
    
    const user = rows[0];
    if (!user) {
        throw new ValidationError('User not found');
    }

    return user;
};

const createSuperiorUser = async (userData) => {
    try {
        if (!userData.username || !userData.password) {
            throw new ValidationError('Username and password are required');
        }

        // Check if user exists
        const existingUser = await User.findByUsername(userData.username);
        if (existingUser) {
            throw new ValidationError('Username already exists');
        }

        // Create superior user with is_superior flag
        const userId = await User.create({
            ...userData,
            is_superior: true
        });

        return await User.findById(userId);
    } catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }
        throw new Error(`Failed to create superior user: ${error.message}`);
    }
};

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    registerUser,
    loginUser,
    checkHealth,
    createSuperiorUser
};