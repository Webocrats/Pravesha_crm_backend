const express = require('express');
const router = express.Router();
const ProductController = require('../controller/productController');
const auth = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permissions');

router.post('/',
    auth,
    checkPermission('products', 'create'),
    ProductController.createProduct
);

router.get('/',
    auth,
    checkPermission('products', 'view'),
    ProductController.getProducts
);

router.get('/:id',
    auth,
    checkPermission('products', 'view'),
    ProductController.getProductById
);

router.put('/:id',
    auth,
    checkPermission('products', 'edit'),
    ProductController.updateProduct
);

router.delete('/:id',
    auth,
    checkPermission('products', 'delete'),
    ProductController.deleteProduct
);

module.exports = router;