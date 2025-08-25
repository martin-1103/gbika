"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [auth.test.ts]: Auth integration tests
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
const auth_service_1 = require("../src/services/auth.service");
describe('POST /api/auth/login', () => {
    it('should login a user with valid credentials', async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/login')
            .send({
            email: 'admin@example.com',
            password: 'password123',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('user');
    });
    it('should not login a user with invalid credentials', async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/login')
            .send({
            email: 'admin@example.com',
            password: 'wrongpassword',
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Email atau password salah.');
    });
    it('should not login a user with a non-existent email', async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/login')
            .send({
            email: 'nonexistent@example.com',
            password: 'password123',
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Email atau password salah.');
    });
    it('should return a 422 error if email is not provided', async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/login')
            .send({
            password: 'password123',
        });
        expect(res.statusCode).toEqual(422);
    });
    it('should return a 422 error if password is not provided', async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/login')
            .send({
            email: 'admin@example.com',
        });
        expect(res.statusCode).toEqual(422);
    });
    afterAll(async () => {
        await (0, auth_service_1.closeRedisConnection)();
    });
});
describe('POST /api/auth/logout', () => {
    let accessToken;
    beforeAll(async () => {
        // Login first to get a valid token
        const loginRes = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/login')
            .send({
            email: 'admin@example.com',
            password: 'password123',
        });
        accessToken = loginRes.body.accessToken;
    });
    it('should logout successfully with valid token', async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Logout berhasil.');
    });
    it('should return 401 with invalid token', async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/logout')
            .set('Authorization', 'Bearer invalid.token.here');
        expect(res.statusCode).toEqual(401);
    });
    it('should return 401 when no token provided', async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/logout');
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Access token required.');
    });
    it('should prevent access to protected endpoints after logout', async () => {
        // First, login to get a token
        const loginRes = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/login')
            .send({
            email: 'admin@example.com',
            password: 'password123',
        });
        const token = loginRes.body.accessToken;
        // Logout with the token
        await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        // Try to access a protected endpoint (assuming we have one)
        // For now, we'll test the logout endpoint itself
        const res = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Token has been revoked.');
    });
});
//# sourceMappingURL=auth.test.js.map