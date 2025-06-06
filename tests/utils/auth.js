const userService = require('../../src/services/usersService');
const { ValidationError, AuthenticationError } = require('../../src/utils/errors');

const TEST_SUPERIOR_USER = {
    username: 'testadmin',
    password: 'testpass123',
    is_superior: true
};

const getSuperiorUserToken = async () => {
    try {
        // Try to create superior user
        try {
            console.log('Creating superior user...');
            await userService.createSuperiorUser(TEST_SUPERIOR_USER);
        } catch (firstError) {
            console.log('Create user error:', firstError);
            if (!firstError.message.includes('already exists')) {
                throw firstError;
            }
            console.log('User already exists, proceeding to login...');
        }

        // Login with superior user credentials
        console.log('Attempting login...');
        const loginResponse = await userService.loginUser(
            TEST_SUPERIOR_USER.username,
            TEST_SUPERIOR_USER.password
        );
        console.log('Login response:', loginResponse);

        if (!loginResponse.userId) {
            throw new Error('Login response missing userId');
        }

        // Verify superior status
        const user = await userService.getUserById(loginResponse.userId);
        if (!user || !user.is_superior) {
            throw new AuthenticationError('User is not a superior user');
        }

        return {
            token: loginResponse.token,
            userId: loginResponse.userId
        };
    } catch (error) {
        throw new Error(`Authentication failed: ${error.message}`);
    }
};

module.exports = {
    getSuperiorUserToken,
    TEST_SUPERIOR_USER
};