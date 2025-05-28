const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');
const { getUsers, createUser, getUserById } = require('../controllers/userController');

router.get('/', verifyToken, checkPermission('users', 'view'), getUsers);
router.post('/', verifyToken, checkPermission('users', 'create'), createUser);
router.get('/:id', verifyToken, checkPermission('users', 'view'), getUserById);

module.exports = router;