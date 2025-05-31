const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const permissionRoutes = require('./permissionRoutes');
const productRoutes = require('./productRoutes');

// Mount the routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/', permissionRoutes);  // Since permission routes already have full paths
// sample
// router.use('/products', productRoutes);

module.exports = router;  // Export the router, not an object