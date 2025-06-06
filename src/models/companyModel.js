const db = require('../config/database');

class Company {
    static async create(data) {
        // Validate required fields
        if (!data.name) {
            throw new Error('Company name is required');
        }

        // Define fields and their default values
        const fields = {
            name: data.name,
            address: data.address || null,
            city: data.city || null,
            pincode: data.pincode || null,
            phone: data.phone || null,
            fax: data.fax || null,
            email: data.email || null,
            gstnumber: data.gstnumber || null,
            statecode: data.statecode || null,
            tinnumber: data.tinnumber || null,
            cst: data.cst || null,
            contactperson: data.contactperson || null
        };

        const query = `
            INSERT INTO companies 
            (name, address, city, pincode, phone, fax, email, 
            gstnumber, statecode, tinnumber, cst, contactperson) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = Object.values(fields);
        
        try {
            const [result] = await db.execute(query, values);
            return result.insertId;
        } catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create company');
        }
    }

    static async findAll(filters = {}, pagination = {}) {
        let query = 'SELECT * FROM companies WHERE 1=1';
        const params = [];

        // Apply filters
        if (filters.name) {
            query += ' AND name LIKE ?';
            params.push(`%${filters.name}%`);
        }
        if (filters.city) {
            query += ' AND city = ?';
            params.push(filters.city);
        }

        // Apply pagination
        if (pagination.limit) {
            query += ' LIMIT ?';
            params.push(parseInt(pagination.limit));
            
            if (pagination.offset) {
                query += ' OFFSET ?';
                params.push(parseInt(pagination.offset));
            }
        }

        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM companies WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async update(id, data) {
        const fields = [];
        const values = [];

        Object.keys(data).forEach(key => {
            if (key !== 'id') {
                fields.push(`${key} = ?`);
                values.push(data[key]);
            }
        });

        values.push(id);
        const query = `UPDATE companies SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await db.execute(query, values);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const query = 'DELETE FROM companies WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Company;