const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/permissionsMiddleware');
const { PERMISSIONS } = require('../constants');

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/', verifyToken, checkPermission('users', 'view'), userController.getUsers);
router.post('/', verifyToken, checkPermission('users', 'create'), userController.createUser);
router.get('/:id', verifyToken, checkPermission('users', 'view'), userController.getUserById);
router.post('/superior', [
    verifyToken,
    checkPermission(PERMISSIONS.PAGES.USERS, PERMISSIONS.ACTIONS.CREATE),
    userController.createSuperiorUser
]);

module.exports = router;

