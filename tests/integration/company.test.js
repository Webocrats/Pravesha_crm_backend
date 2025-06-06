const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/database');
const { getSuperiorUserToken } = require('../utils/auth');

describe('Company API Integration Tests', () => {
    let authToken;
    let testUserId;
    let testCompanyId;

    const testCompany = {
        name: 'Integration Test Company',
        city: 'Test City',
        email: 'test@example.com'
    };

    beforeAll(async () => {
        try {
            // Get token from superior user
            const authResponse = await getSuperiorUserToken();
            authToken = authResponse.token;
            testUserId = authResponse.userId;
        } catch (error) {
            console.error('Setup error:', error);
            throw error;
        }
    });

    afterAll(async () => {
        try {
            // Clean up test company if created
            if (testCompanyId) {
                await db.execute(
                    'DELETE FROM companies WHERE id = ?', 
                    [testCompanyId]
                );
            }
            // Don't delete the superior user as it might be needed for other tests
            await db.end();
        } catch (error) {
            console.error('Cleanup error:', error);
            throw error;
        }
    });

    describe('POST /api/companies', () => {
        it('should create a new company', async () => {
            const response = await request(app)
                .post('/api/companies')
                .set('Authorization', `Bearer ${authToken}`)
                .send(testCompany);

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data.name).toBe(testCompany.name);
            
            // Store the company ID for later cleanup
            testCompanyId = response.body.data.id;
        });

        it('should reject request without auth token', async () => {
            const response = await request(app)
                .post('/api/companies')
                .send(testCompany);

            expect(response.status).toBe(401);
        });

        it('should reject duplicate company creation', async () => {
            const response = await request(app)
                .post('/api/companies')
                .set('Authorization', `Bearer ${authToken}`)
                .send(testCompany);

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/companies', () => {
        it('should return list of companies', async () => {
            const response = await request(app)
                .get('/api/companies')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it('should filter companies by name', async () => {
            const response = await request(app)
                .get('/api/companies')
                .query({ name: 'Integration Test' })
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.some(company => 
                company.name.includes('Integration Test')
            )).toBe(true);
        });
    });

    describe('GET /api/companies/:id', () => {
        it('should return specific company', async () => {
            const response = await request(app)
                .get(`/api/companies/${testCompanyId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.id).toBe(testCompanyId);
            expect(response.body.data.name).toBe(testCompany.name);
        });

        it('should return 404 for non-existent company', async () => {
            const response = await request(app)
                .get('/api/companies/nonexistent')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/companies/:id', () => {
        it('should update company', async () => {
            const updatedData = {
                name: 'Updated Test Company',
                city: 'Updated City'
            };

            const response = await request(app)
                .put(`/api/companies/${testCompanyId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe(updatedData.name);
            expect(response.body.data.city).toBe(updatedData.city);
        });
    });

    describe('DELETE /api/companies/:id', () => {
        it('should delete company', async () => {
            const response = await request(app)
                .delete(`/api/companies/${testCompanyId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);

            // Verify deletion
            const getResponse = await request(app)
                .get(`/api/companies/${testCompanyId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(getResponse.status).toBe(404);
        });
    });
});