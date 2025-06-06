const db = require('../../config/database');

class Product {
    static async create(data) {
        const query = 'INSERT INTO products (name, description, price, created_by) VALUES (?, ?, ?, ?)';
        const [result] = await db.execute(query, [data.name, data.description, data.price, data.userId]);
        return result.insertId;
    }

    static async findAll() {
        const query = 'SELECT * FROM products WHERE deleted_at IS NULL';
        const [rows] = await db.execute(query);
        return rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM products WHERE id = ? AND deleted_at IS NULL';
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async update(id, data) {
        const query = 'UPDATE products SET name = ?, description = ?, price = ?, updated_at = NOW() WHERE id = ?';
        const [result] = await db.execute(query, [data.name, data.description, data.price, id]);
        return result.affectedRows > 0;
    }

    static async softDelete(id) {
        const query = 'UPDATE products SET deleted_at = NOW() WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Product;