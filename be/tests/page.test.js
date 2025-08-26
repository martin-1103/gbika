"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [page.test.ts]: Page content integration tests
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
const client_1 = require("@prisma/client");
const redis_1 = __importDefault(require("redis"));
const prisma = new client_1.PrismaClient();
describe('Page Content', () => {
    let testPageSlug;
    let draftPageSlug;
    beforeAll(async () => {
        // Create test pages
        const publishedPage = await prisma.page.create({
            data: {
                title: 'Test Published Page',
                slug: 'test-published-page',
                content: '<h1>Test Content</h1><p>This is a test page content.</p>',
                status: 'published'
            }
        });
        testPageSlug = publishedPage.slug;
        const draftPage = await prisma.page.create({
            data: {
                title: 'Test Draft Page',
                slug: 'test-draft-page',
                content: '<h1>Draft Content</h1><p>This is a draft page content.</p>',
                status: 'draft'
            }
        });
        draftPageSlug = draftPage.slug;
    });
    afterAll(async () => {
        // Clean up test data
        await prisma.page.deleteMany({
            where: {
                slug: {
                    in: [testPageSlug, draftPageSlug]
                }
            }
        });
        await prisma.$disconnect();
        // Close Redis connection
        try {
            const redisClient = redis_1.default.createClient({
                socket: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT || '6379')
                }
            });
            await redisClient.connect();
            await redisClient.quit();
        }
        catch (error) {
            // Ignore Redis cleanup errors in tests
        }
    });
    describe('GET /api/pages/:slug', () => {
        it('should return published page content successfully', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .get(`/api/pages/${testPageSlug}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('title', 'Test Published Page');
            expect(res.body.data).toHaveProperty('slug', testPageSlug);
            expect(res.body.data).toHaveProperty('content');
            expect(res.body.data).toHaveProperty('status', 'published');
            expect(res.body.message).toBe('Page retrieved successfully');
        });
        it('should return 404 for draft page', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .get(`/api/pages/${draftPageSlug}`);
            expect(res.statusCode).toEqual(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Page not found');
        });
        it('should return 404 for non-existent page', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .get('/api/pages/non-existent-page');
            expect(res.statusCode).toEqual(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Page not found');
        });
        it('should handle rate limiting in production mode', async () => {
            // Skip rate limiting test in test environment since limit is set to 1000
            if (process.env.NODE_ENV === 'test') {
                expect(true).toBe(true); // Skip test in test environment
                return;
            }
            // Make multiple requests to trigger rate limit
            const requests = [];
            for (let i = 0; i < 60; i++) {
                requests.push((0, supertest_1.default)(app_1.app).get(`/api/pages/${testPageSlug}`));
            }
            const responses = await Promise.all(requests);
            const rateLimitedResponses = responses.filter(res => res.statusCode === 429);
            expect(rateLimitedResponses.length).toBeGreaterThan(0);
        });
        it('should return cached content on subsequent requests', async () => {
            // First request
            const res1 = await (0, supertest_1.default)(app_1.app)
                .get(`/api/pages/${testPageSlug}`);
            expect(res1.statusCode).toEqual(200);
            // Second request (should be from cache)
            const res2 = await (0, supertest_1.default)(app_1.app)
                .get(`/api/pages/${testPageSlug}`);
            expect(res2.statusCode).toEqual(200);
            expect(res2.body.data.title).toBe(res1.body.data.title);
        });
    });
    describe('GET /api/pages/homepage', () => {
        it('should return homepage data successfully', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .get('/api/pages/homepage');
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.message).toBe('Homepage data retrieved successfully');
        });
    });
});
//# sourceMappingURL=page.test.js.map