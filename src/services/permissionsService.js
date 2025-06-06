const pool = require('../config/database');

const getAllPermissions = async () => {
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
};

const getPages = async () => {
    const [rows] = await pool.execute('SELECT * FROM pages');
    return rows;
};

const getActions = async () => {
    const [rows] = await pool.execute('SELECT * FROM actions');
    return rows;
};

const getUserPermissions = async (userId) => {
    const [rows] = await pool.execute(`
        SELECT 
            p.id as permission_id,
            pg.name as page,
            a.name as action,
            up.granted
        FROM permissions p
        JOIN pages pg ON pg.id = p.page_id
        JOIN actions a ON a.id = p.action_id
        LEFT JOIN user_permissions up ON up.permission_id = p.id AND up.user_id = ?
    `, [userId]);
    return rows;
};

const updateUserPermissions = async (userId, permissions) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Delete existing permissions
        await connection.execute(
            'DELETE FROM user_permissions WHERE user_id = ?',
            [userId]
        );

        // Validate permissions before insertion
        const validPermissions = permissions.filter(p => 
            p && p.permission_id && p.granted != null
        );

        if (validPermissions.length === 0) {
            throw new Error('No valid permissions provided');
        }

        // Insert new permissions
        for (const perm of validPermissions) {
            await connection.execute(
                'INSERT INTO user_permissions (user_id, permission_id, granted) VALUES (?, ?, ?)',
                [userId, perm.permission_id, perm.granted ? 1 : 0]
            );
        }

        await connection.commit();
        return { success: true };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    getAllPermissions,
    getPages,
    getActions,
    getUserPermissions,
    updateUserPermissions
};