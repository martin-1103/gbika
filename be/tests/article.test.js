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
describe('GET /api/articles/:slug', () => {
    let publishedArticleSlug;
    let draftArticleSlug;
    beforeAll(async () => {
        // Clean up any existing test data
        await prisma.article.deleteMany({
            where: {
                slug: {
                    in: ['test-published-article-detail', 'test-draft-article-detail']
                }
            }
        });
        // Create a published article for testing
        const publishedArticle = await prisma.article.create({
            data: {
                title: 'Test Published Article Detail',
                slug: 'test-published-article-detail',
                content: 'This is a published article for detail testing.',
                status: 'published',
                published_at: new Date('2024-01-15')
            }
        });
        publishedArticleSlug = publishedArticle.slug;
        // Create a draft article for testing
        const draftArticle = await prisma.article.create({
            data: {
                title: 'Test Draft Article Detail',
                slug: 'test-draft-article-detail',
                content: 'This is a draft article for detail testing.',
                status: 'draft',
                published_at: null
            }
        });
        draftArticleSlug = draftArticle.slug;
    });
    afterAll(async () => {
        // Clean up test data
        await prisma.article.deleteMany({
            where: {
                slug: {
                    in: [publishedArticleSlug, draftArticleSlug]
                }
            }
        });
    });
    it('should return published article details when slug exists', async () => {
        const response = await (0, supertest_1.default)(app_1.app)
            .get(`/api/articles/${publishedArticleSlug}`)
            .expect(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('title', 'Test Published Article Detail');
        expect(response.body.data).toHaveProperty('slug', publishedArticleSlug);
        expect(response.body.data).toHaveProperty('content', 'This is a published article for detail testing.');
        expect(response.body.data).toHaveProperty('status', 'published');
        expect(response.body.data).toHaveProperty('published_at');
        expect(response.body.data).toHaveProperty('createdAt');
        expect(response.body.data).toHaveProperty('updatedAt');
        expect(response.body.data.published_at).not.toBeNull();
    });
    it('should return 404 when trying to access draft article', async () => {
        const response = await (0, supertest_1.default)(app_1.app)
            .get(`/api/articles/${draftArticleSlug}`)
            .expect(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Article not found.');
    });
    it('should return 404 when article slug does not exist', async () => {
        const response = await (0, supertest_1.default)(app_1.app)
            .get('/api/articles/non-existent-article-slug')
            .expect(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Article not found.');
    });
    it('should return 404 when slug parameter is invalid', async () => {
        const response = await (0, supertest_1.default)(app_1.app)
            .get('/api/articles/invalid-slug-that-does-not-exist')
            .expect(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Article not found.');
    });
    it('should handle special characters in slug gracefully', async () => {
        const response = await (0, supertest_1.default)(app_1.app)
            .get('/api/articles/article-with-special-chars-@#$%')
            .expect(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Article not found.');
    });
});
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
describe('Article Service Unit Tests', () => {
    const { findOneBySlug } = require('../src/services/article.service');
    let testArticleSlug;
    beforeAll(async () => {
        // Clean up any existing test data
        await prisma.article.deleteMany({
            where: {
                OR: [
                    { slug: 'test-service-unit-article' },
                    { slug: 'deleted-article-unit-test' }
                ]
            }
        });
        // Create a test article for service unit tests
        const testArticle = await prisma.article.create({
            data: {
                title: 'Test Service Unit Article',
                slug: 'test-service-unit-article',
                content: 'This is a test article for service unit testing.',
                status: 'published',
                published_at: new Date('2024-01-20')
            }
        });
        testArticleSlug = testArticle.slug;
    });
    afterAll(async () => {
        // Clean up test data
        await prisma.article.deleteMany({
            where: {
                OR: [
                    { slug: testArticleSlug },
                    { slug: 'deleted-article-unit-test' }
                ]
            }
        });
    });
    describe('findOneBySlug', () => {
        it('should return published article when slug exists', async () => {
            const article = await findOneBySlug(testArticleSlug);
            expect(article).not.toBeNull();
            expect(article).toHaveProperty('id');
            expect(article).toHaveProperty('title', 'Test Service Unit Article');
            expect(article).toHaveProperty('slug', testArticleSlug);
            expect(article).toHaveProperty('content', 'This is a test article for service unit testing.');
            expect(article).toHaveProperty('status', 'published');
            expect(article).toHaveProperty('published_at');
            expect(article).toHaveProperty('createdAt');
            expect(article).toHaveProperty('updatedAt');
            expect(article.published_at).not.toBeNull();
        });
        it('should return null when article slug does not exist', async () => {
            const article = await findOneBySlug('non-existent-slug');
            expect(article).toBeNull();
        });
        it('should return null when article exists but is draft', async () => {
            // Create a draft article for this test
            const draftArticle = await prisma.article.create({
                data: {
                    title: 'Draft Article for Unit Test',
                    slug: 'draft-article-unit-test',
                    content: 'This is a draft article.',
                    status: 'draft',
                    published_at: null
                }
            });
            const article = await findOneBySlug(draftArticle.slug);
            expect(article).toBeNull();
            // Clean up
            await prisma.article.delete({
                where: { slug: draftArticle.slug }
            });
        });
        it('should return null when article exists but is soft deleted', async () => {
            // Create a soft deleted article for this test
            const deletedArticle = await prisma.article.create({
                data: {
                    title: 'Deleted Article for Unit Test',
                    slug: 'deleted-article-unit-test',
                    content: 'This is a deleted article.',
                    status: 'published',
                    published_at: new Date(),
                    deleted_at: new Date()
                }
            });
            const article = await findOneBySlug(deletedArticle.slug);
            expect(article).toBeNull();
            // Clean up
            await prisma.article.delete({
                where: { slug: deletedArticle.slug }
            });
        });
        it('should handle empty string slug gracefully', async () => {
            const article = await findOneBySlug('');
            expect(article).toBeNull();
        });
        it('should handle special characters in slug', async () => {
            const article = await findOneBySlug('article-with-special-chars-@#$%');
            expect(article).toBeNull();
        });
    });
});
//# sourceMappingURL=article.test.js.map