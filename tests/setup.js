const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateTestToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET || 'test-secret', { expiresIn: '24h' });
};

module.exports = {
    generateTestToken
}; 