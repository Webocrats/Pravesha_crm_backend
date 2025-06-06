const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/permissionsMiddleware');
const {
    getAllPermissions,
    getPages,
    getActions,
    getUserPermissions,
    updateUserPermissions
} = require('../controllers/permissionController');

// Permission management routes
router.get('/permissions', verifyToken, checkPermission('settings', 'view'), getAllPermissions);
router.get('/permissions/pages', verifyToken, checkPermission('settings', 'view'), getPages);
router.get('/permissions/actions', verifyToken, checkPermission('settings', 'view'), getActions);
router.get('/users/:id/permissions', verifyToken, checkPermission('settings', 'view'), getUserPermissions);
router.post('/users/:id/permissions', verifyToken, checkPermission('settings', 'edit'), updateUserPermissions);

module.exports = router;