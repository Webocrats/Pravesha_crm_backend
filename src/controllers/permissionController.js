const permissionService = require('../services/permissionsService');

const getAllPermissions = async (req, res) => {
    try {
        const permissions = await permissionService.getAllPermissions();
        res.status(200).json(permissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPages = async (req, res) => {
    try {
        const pages = await permissionService.getPages();
        res.status(200).json(pages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getActions = async (req, res) => {
    try {
        const actions = await permissionService.getActions();
        res.status(200).json(actions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserPermissions = async (req, res) => {
    try {
        const { id } = req.params;
        const permissions = await permissionService.getUserPermissions(id);
        res.status(200).json(permissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUserPermissions = async (req, res) => {
    try {
        const { id } = req.params;
        const { permissions } = req.body;
        await permissionService.updateUserPermissions(id, permissions);
        res.status(200).json({ message: 'Permissions updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllPermissions,
    getPages,
    getActions,
    getUserPermissions,
    updateUserPermissions
};
// This code defines the permission controller for handling requests related to permissions, pages, actions, and user permissions.