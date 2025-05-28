const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        // Insert pages
        const pages = ['users', 'products', 'orders', 'customers', 'reports', 'settings'];
        for (const page of pages) {
            await pool.execute('INSERT IGNORE INTO pages (name) VALUES (?)', [page]);
        }

        // Insert actions
        const actions = ['view', 'create', 'edit', 'delete', 'export'];
        for (const action of actions) {
            await pool.execute('INSERT IGNORE INTO actions (name) VALUES (?)', [action]);
        }

        // Create permissions (combinations of pages and actions)
        const [pageRows] = await pool.execute('SELECT id FROM pages');
        const [actionRows] = await pool.execute('SELECT id FROM actions');

        for (const page of pageRows) {
            for (const action of actionRows) {
                await pool.execute(
                    'INSERT IGNORE INTO permissions (page_id, action_id) VALUES (?, ?)',
                    [page.id, action.id]
                );
            }
        }

        // Create super admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const [result] = await pool.execute(
            'INSERT IGNORE INTO users (username, password, is_superior) VALUES (?, ?, ?)',
            ['admin', hashedPassword, true]
        );

        // Grant all permissions to admin
        const [permissions] = await pool.execute('SELECT id FROM permissions');
        const [adminUser] = await pool.execute('SELECT id FROM users WHERE username = ?', ['admin']);

        for (const permission of permissions) {
            await pool.execute(
                'INSERT IGNORE INTO user_permissions (user_id, permission_id, granted) VALUES (?, ?, ?)',
                [adminUser[0].id, permission.id, true]
            );
        }

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

module.exports = { seedDatabase };