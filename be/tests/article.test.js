"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [article.test.ts]: Article integration tests
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
const client_1 = require("@prisma/client");
const auth_service_1 = require("../src/services/auth.service");
const prisma = new client_1.PrismaClient();
describe('DELETE /api/articles/:slug', () => {
    let adminToken;
    let nonAdminToken;
    let testArticleSlug;
    beforeAll(async () => {
        // Login as admin to get token
        const adminRes = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/login')
            .send({
            email: 'admin@example.com',
            password: 'password123',
        });
        adminToken = adminRes.body.accessToken;
        // Login as non-admin to get token
        const nonAdminRes = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/login')
            .send({
            email: 'editor@example.com',
            password: 'password123',
        });
        nonAdminToken = nonAdminRes.body.accessToken;
        // Add a small delay to ensure tokens are properly set
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Create a test article
        const article = await prisma.article.create({
            data: {
                title: 'Test Article for Deletion',
                slug: 'test-article-deletion',
                content: 'This article will be deleted in tests.',
                status: 'published',
                published_at: new Date(),
            },
        });
        testArticleSlug = article.slug;
        // Verify article was created
        const createdArticle = await prisma.article.findUnique({
            where: { slug: testArticleSlug },
        });
        if (!createdArticle) {
            throw new Error('Failed to create test article');
        }
    });
    afterAll(async () => {
        // Clean up test data
        await prisma.article.deleteMany({
            where: {
                slug: testArticleSlug,
            },
        });
        await prisma.$disconnect();
        await (0, auth_service_1.closeRedisConnection)();
    });
    it('should allow admin to soft delete an article', async () => {
        // Verify article exists before deletion
        const articleBeforeDelete = await prisma.article.findUnique({
            where: { slug: testArticleSlug },
        });
        expect(articleBeforeDelete).not.toBeNull();
        expect(articleBeforeDelete?.deleted_at).toBeNull();
        const res = await (0, supertest_1.default)(app_1.app)
            .delete(`/api/articles/${testArticleSlug}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(204);
        // Verify article is soft deleted
        const articleAfterDelete = await prisma.article.findUnique({
            where: { slug: testArticleSlug },
        });
        expect(articleAfterDelete?.deleted_at).not.toBeNull();
    });
    it('should return 404 when trying to delete non-existent article', async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .delete('/api/articles/non-existent-article')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(404);
    });
    it('should return 401 when no token provided', async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .delete(`/api/articles/${testArticleSlug}`);
        expect(res.statusCode).toEqual(401);
    });
    it('should return 403 when user is not admin', async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .delete(`/api/articles/${testArticleSlug}`)
            .set('Authorization', `Bearer ${nonAdminToken}`);
        expect(res.statusCode).toEqual(403);
    });
});
//# sourceMappingURL=article.test.js.map