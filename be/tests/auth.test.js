"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [auth.test.ts]: Authentication integration tests
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
const auth_service_1 = require("../src/services/auth.service");
describe('Authentication', () => {
    let accessToken;
    let blacklistedToken;
    describe('POST /api/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/login')
                .send({
                email: 'admin@example.com',
                password: 'password123',
            });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('accessToken');
            accessToken = res.body.accessToken;
        });
        it('should return 401 with invalid credentials', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/login')
                .send({
                email: 'admin@example.com',
                password: 'wrongpassword',
            });
            expect(res.statusCode).toEqual(401);
        });
        it('should return 422 when email is missing', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/login')
                .send({
                password: 'password123',
            });
            expect(res.statusCode).toEqual(422);
        });
        it('should return 422 when password is missing', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/login')
                .send({
                email: 'admin@example.com',
            });
            expect(res.statusCode).toEqual(422);
        });
    });
    describe('POST /api/auth/logout', () => {
        it('should logout successfully with valid token', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`);
            expect(res.statusCode).toEqual(200);
            blacklistedToken = accessToken; // Store for blacklist tests
        });
        it('should return 401 when no token provided', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/logout');
            expect(res.statusCode).toEqual(401);
        });
        it('should return 401 when using invalidated token', async () => {
            // Try to use the token that was invalidated by logout
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${blacklistedToken}`);
            expect(res.statusCode).toEqual(401);
        });
    });
    describe('GET /api/auth/me', () => {
        let validToken;
        beforeAll(async () => {
            // Get a fresh token for profile tests
            const loginRes = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/login')
                .send({
                email: 'admin@example.com',
                password: 'password123',
            });
            validToken = loginRes.body.accessToken;
        });
        it('should return user profile with valid token', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${validToken}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('name');
            expect(res.body).toHaveProperty('email');
            expect(res.body).toHaveProperty('role');
            expect(res.body).toHaveProperty('createdAt');
            expect(res.body).toHaveProperty('updatedAt');
            // Security: Ensure no sensitive data is returned
            expect(res.body).not.toHaveProperty('password');
            expect(res.body.email).toEqual('admin@example.com');
        });
        it('should return 401 when no token provided', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .get('/api/auth/me');
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Access token required.');
        });
        it('should return 401 with invalid token format', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .get('/api/auth/me')
                .set('Authorization', 'InvalidTokenFormat');
            expect(res.statusCode).toEqual(401);
        });
        it('should return 401 with malformed JWT token', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid.jwt.token');
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Invalid token.');
        });
        it('should return 401 with blacklisted token', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${blacklistedToken}`);
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Token has been revoked.');
        });
        it('should return 401 with expired token', async () => {
            // This would require a token with very short expiry or manipulation
            // For now, we test with an obviously expired JWT
            const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid';
            const res = await (0, supertest_1.default)(app_1.app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${expiredToken}`);
            expect(res.statusCode).toEqual(401);
        });
    });
    afterAll(async () => {
        await (0, auth_service_1.closeRedisConnection)();
    });
});
//# sourceMappingURL=auth.test.js.map