const service = require('../services/authService');

const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const response = await service.registerUser(username, password);
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const response = await service.loginUser(username, password);
        res.status(200).json(response);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const healthCheck = async (req, res) => {
    try {
        const response = await service.checkHealth();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    register,
    login,
    healthCheck
};
// This code defines the authentication controller for handling user registration, login, and health check requests.