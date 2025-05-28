const pool = require('../config/database');

class Permission {
    static async getUserPermissions(userId) {
        const [rows] = await pool.execute(`
            SELECT 
                p.id,
                pg.name as page,
                a.name as action,
                up.granted
            FROM permissions p
            JOIN pages pg ON pg.id = p.page_id
            JOIN actions a ON a.id = p.action_id
            LEFT JOIN user_permissions up ON up.permission_id = p.id AND up.user_id = ?
        `, [userId]);
        return rows;
    }

    static async getAllPermissions() {
        const [rows] = await pool.execute(`
            SELECT 
                p.id,
                pg.name as page,
                a.name as action
            FROM permissions p
            JOIN pages pg ON pg.id = p.page_id
            JOIN actions a ON a.id = p.action_id
        `);
        return rows;
    }

    static async updateUserPermissions(userId, permissions, connection) {
        const queries = permissions.map(({ permission_id, granted }) => ({
            sql: 'INSERT INTO user_permissions (user_id, permission_id, granted) VALUES (?, ?, ?)',
            values: [userId, permission_id, granted]
        }));

        await connection.execute('DELETE FROM user_permissions WHERE user_id = ?', [userId]);
        
        for (const query of queries) {
            await connection.execute(query.sql, query.values);
        }
    }

    static async checkUserPermission(userId, page, action) {
        const [rows] = await pool.execute(`
            SELECT up.granted
            FROM user_permissions up
            JOIN permissions p ON p.id = up.permission_id
            JOIN pages pg ON pg.id = p.page_id
            JOIN actions a ON a.id = p.action_id
            WHERE up.user_id = ? AND pg.name = ? AND a.name = ?
        `, [userId, page, action]);
        
        return rows[0]?.granted ?? false;
    }
}

module.exports = Permission;