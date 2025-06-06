const userService = require('../services/usersService');

const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const response = await userService.registerUser(username, password);
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const response = await userService.loginUser(username, password);
        res.status(200).json(response);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const healthCheck = async (req, res) => {
    try {
        const response = await userService.checkHealth();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// This code defines the authentication controller for handling user registration, login, and health check requests.

const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userService.createUser(username, password);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createSuperiorUser = async (req, res) => {
    try {
        const { username, password, is_superior } = req.body;
        const userData = {
            username,
            password,
            is_superior: is_superior !== undefined ? is_superior : true
        };

        const user = await userService.createSuperiorUser(userData);
        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    getUsers,
    createUser,
    getUserById,
    register,
    login,
    healthCheck,
    createSuperiorUser
};
// This code defines the user controller for handling requests related to users, including getting all users, creating a new user, and getting a user by ID.