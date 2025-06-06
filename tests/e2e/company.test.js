const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/database');
const { generateTestToken } = require('../setup');

describe('Company E2E Tests', () => {
    let authToken;
    let testCompanyId;

    beforeAll(async () => {
        // Setup test user with all permissions
        authToken = generateTestToken({ 
            id: 1, 
            permissions: ['companies.view', 'companies.create', 'companies.edit', 'companies.delete'] 
        });
    });

    afterAll(async () => {
        // Cleanup database
        if (testCompanyId) {
            await db.execute('DELETE FROM companies WHERE id = ?', [testCompanyId]);
        }
        await db.end();
    });

    it('should perform full CRUD lifecycle', async () => {
        // 1. Create Company
        const createResponse = await request(app)
            .post('/api/companies')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                id: '1',
                name: 'E2E Test Company',
                city: 'Test City'
            });

        expect(createResponse.status).toBe(201);
        testCompanyId = createResponse.body.data.id;

        // 2. Get Company
        const getResponse = await request(app)
            .get(`/api/companies/${testCompanyId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(getResponse.status).toBe(200);
        expect(getResponse.body.data.name).toBe('E2E Test Company');

        // 3. Update Company
        const updateResponse = await request(app)
            .put(`/api/companies/${testCompanyId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Updated E2E Company'
            });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.data.name).toBe('Updated E2E Company');

        // 4. Delete Company
        const deleteResponse = await request(app)
            .delete(`/api/companies/${testCompanyId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(deleteResponse.status).toBe(200);
    });
});