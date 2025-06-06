const Product = require('../models/product');
const { NotFoundError, ValidationError } = require('../utils/errors');

class ProductService {
    static async createProduct(data, userId) {
        if (!data.name || !data.price) {
            throw new ValidationError('Name and price are required');
        }

        data.userId = userId;
        const productId = await Product.create(data);
        return this.getProductById(productId);
    }

    static async getAllProducts() {
        return await Product.findAll();
    }

    static async getProductById(id) {
        const product = await Product.findById(id);
        if (!product) {
            throw new NotFoundError('Product not found');
        }
        return product;
    }

    static async updateProduct(id, data) {
        const exists = await Product.findById(id);
        if (!exists) {
            throw new NotFoundError('Product not found');
        }

        if (!data.name || !data.price) {
            throw new ValidationError('Name and price are required');
        }

        await Product.update(id, data);
        return this.getProductById(id);
    }

    static async deleteProduct(id) {
        const exists = await Product.findById(id);
        if (!exists) {
            throw new NotFoundError('Product not found');
        }

        return await Product.softDelete(id);
    }
}

module.exports = ProductService;