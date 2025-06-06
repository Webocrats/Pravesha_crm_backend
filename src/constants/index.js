const PERMISSIONS = {
    PAGES: {
        USERS: 'users',
        SETTINGS: 'settings',
        PRODUCTS: 'products',
        ORDERS: 'orders',
        CUSTOMERS: 'customers',
        REPORTS: 'reports',
        COMPANIES: 'companies'
    },
    ACTIONS: {
        VIEW: 'view',
        CREATE: 'create',
        EDIT: 'edit',
        DELETE: 'delete',
        EXPORT: 'export'
    }
};

const ERROR_MESSAGES = {
    USER_EXISTS: 'User already exists',
    USER_NOT_FOUND: 'User not found',
    INVALID_PASSWORD: 'Invalid password',
    UNAUTHORIZED: 'Unauthorized access',
    PERMISSION_DENIED: 'Permission denied',
    COMPANY_NOT_FOUND: 'Company not found',
    COMPANY_EXISTS: 'Company already exists'
};

module.exports = {
    PERMISSIONS,
    ERROR_MESSAGES
};