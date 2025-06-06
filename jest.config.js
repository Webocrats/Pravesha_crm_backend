module.exports = {
    testEnvironment: 'node',
    verbose: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/config/**',
        '!src/migrations/**'
    ],
    testMatch: [
        '**/tests/**/*.test.js'
    ]
};