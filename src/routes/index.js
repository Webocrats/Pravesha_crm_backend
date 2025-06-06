const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const permissionRoutes = require('./permissionRoutes');
const companyRoutes = require('./companyRoutes');

// Mount the routes
router.use('/users', userRoutes);
router.use('/', permissionRoutes);  // Since permission routes already have full paths
router.use('/companies', companyRoutes);
module.exports = router;  // Export the router, not an object