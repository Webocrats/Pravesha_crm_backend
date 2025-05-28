const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
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
        throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error('Invalid password');
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

    return { message: 'Login successful', token };
};

const checkHealth = async () => {
    return {
        status: 'OK',
        message: 'Server is running properly',
        timestamp: new Date().toISOString()
    };
};

module.exports = {
    registerUser,
    loginUser,
    checkHealth
};