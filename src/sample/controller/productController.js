const ProductService = require('../services/productService');
const { responseHandler } = require('../../utils/responseHandler');

class ProductController {
    static async createProduct(req, res) {
        try {
            const product = await ProductService.createProduct(req.body, req.user.id);
            return responseHandler.success(res, 201, 'Product created successfully', product);
        } catch (error) {
            return responseHandler.error(res, error);
        }
    }

    static async getProducts(req, res) {
        try {
            const products = await ProductService.getAllProducts();
            return responseHandler.success(res, 200, 'Products retrieved successfully', products);
        } catch (error) {
            return responseHandler.error(res, error);
        }
    }

    static async getProductById(req, res) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            return responseHandler.success(res, 200, 'Product retrieved successfully', product);
        } catch (error) {
            return responseHandler.error(res, error);
        }
    }

    static async updateProduct(req, res) {
        try {
            const product = await ProductService.updateProduct(req.params.id, req.body);
            return responseHandler.success(res, 200, 'Product updated successfully', product);
        } catch (error) {
            return responseHandler.error(res, error);
        }
    }

    static async deleteProduct(req, res) {
        try {
            await ProductService.deleteProduct(req.params.id);
            return responseHandler.success(res, 200, 'Product deleted successfully');
        } catch (error) {
            return responseHandler.error(res, error);
        }
    }
}

module.exports = ProductController;