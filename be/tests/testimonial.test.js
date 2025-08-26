"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [testimonial.test.ts]: Testimonial integration tests
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
describe('GET /api/testimonials', () => {
    beforeEach(async () => {
        // Clean up before each test
        await prisma.testimonial.deleteMany({});
        // Seed test data
        await prisma.testimonial.createMany({
            data: [
                {
                    name: 'John Doe',
                    email: 'john@example.com',
                    city: 'Jakarta',
                    title: 'Amazing Grace in My Life',
                    content: 'This church has been a blessing to my family. The community is so welcoming and the teachings have transformed my life.',
                    status: 'approved'
                },
                {
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    city: 'Bandung',
                    title: 'Found Hope Here',
                    content: 'I was going through a difficult time and found hope and healing through this church community. Grateful for the support.',
                    status: 'approved'
                },
                {
                    name: 'Bob Wilson',
                    email: 'bob@example.com',
                    city: 'Surabaya',
                    title: 'Life Changing Experience',
                    content: 'The sermons and fellowship have been life changing. I recommend this church to anyone seeking spiritual growth.',
                    status: 'approved'
                },
                {
                    name: 'Alice Brown',
                    email: 'alice@example.com',
                    city: 'Medan',
                    title: 'Pending Testimonial',
                    content: 'This testimonial should not appear in the list as it is still pending approval.',
                    status: 'pending'
                },
                {
                    name: 'Charlie Davis',
                    email: 'charlie@example.com',
                    city: 'Yogyakarta',
                    title: 'Rejected Testimonial',
                    content: 'This testimonial should not appear in the list as it was rejected.',
                    status: 'rejected'
                }
            ]
        });
    });
    afterEach(async () => {
        await prisma.testimonial.deleteMany({});
    });
    describe('Valid requests', () => {
        it('should return approved testimonials with default pagination', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .get('/api/testimonials');
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(3); // Only approved testimonials
            expect(res.body.meta.total).toBe(3);
            expect(res.body.meta.page).toBe(1);
            expect(res.body.meta.limit).toBe(10);
            expect(res.body.meta.totalPages).toBe(1);
            // Check that only approved testimonials are returned
            const testimonialTitles = res.body.data.map((t) => t.title);
            expect(testimonialTitles).toContain('Amazing Grace in My Life');
            expect(testimonialTitles).toContain('Found Hope Here');
            expect(testimonialTitles).toContain('Life Changing Experience');
            expect(testimonialTitles).not.toContain('Pending Testimonial');
            expect(testimonialTitles).not.toContain('Rejected Testimonial');
        });
        it('should return testimonials with custom pagination', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .get('/api/testimonials')
                .query({ page: 1, limit: 2 });
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(2);
            expect(res.body.meta.total).toBe(3);
            expect(res.body.meta.page).toBe(1);
            expect(res.body.meta.limit).toBe(2);
            expect(res.body.meta.totalPages).toBe(2);
        });
        it('should return second page of testimonials', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .get('/api/testimonials')
                .query({ page: 2, limit: 2 });
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(1); // Only 1 testimonial on page 2
            expect(res.body.meta.total).toBe(3);
            expect(res.body.meta.page).toBe(2);
            expect(res.body.meta.limit).toBe(2);
            expect(res.body.meta.totalPages).toBe(2);
        });
        it('should return empty array when no approved testimonials exist', async () => {
            // Delete all approved testimonials
            await prisma.testimonial.deleteMany({
                where: { status: 'approved' }
            });
            const res = await (0, supertest_1.default)(app_1.app)
                .get('/api/testimonials');
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(0);
            expect(res.body.meta.total).toBe(0);
            expect(res.body.meta.page).toBe(1);
            expect(res.body.meta.limit).toBe(10);
            expect(res.body.meta.totalPages).toBe(0);
        });
        it('should return testimonials ordered by creation date (newest first)', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .get('/api/testimonials');
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toHaveLength(3);
            // Check that testimonials are ordered by createdAt desc
            const createdDates = res.body.data.map((t) => new Date(t.createdAt));
            for (let i = 1; i < createdDates.length; i++) {
                expect(createdDates[i - 1].getTime()).toBeGreaterThanOrEqual(createdDates[i].getTime());
            }
        });
    });
    describe('Validation errors', () => {
        it('should return 400 for invalid page parameter', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .get('/api/testimonials')
                .query({ page: 0 });
            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Validation failed');
            expect(res.body.errors).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    msg: 'Page must be a positive integer'
                })
            ]));
        });
        it('should return 400 for invalid limit parameter', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .get('/api/testimonials')
                .query({ limit: 100 });
            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Validation failed');
            expect(res.body.errors).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    msg: 'Limit must be between 1 and 50'
                })
            ]));
        });
        it('should return 400 for negative page parameter', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .get('/api/testimonials')
                .query({ page: -1 });
            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Validation failed');
        });
        it('should return 400 for zero limit parameter', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .get('/api/testimonials')
                .query({ limit: 0 });
            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Validation failed');
        });
    });
    describe('Rate limiting', () => {
        it('should allow multiple requests within rate limit', async () => {
            // Make multiple requests quickly
            const promises = Array(5).fill(null).map(() => (0, supertest_1.default)(app_1.app).get('/api/testimonials'));
            const responses = await Promise.all(promises);
            // All requests should succeed
            responses.forEach(res => {
                expect(res.statusCode).toEqual(200);
            });
        });
    });
    describe('Performance tests', () => {
        it('should handle large dataset efficiently', async () => {
            // Create many approved testimonials
            const manyTestimonials = Array(100).fill(null).map((_, index) => ({
                name: `User ${index}`,
                email: `user${index}@example.com`,
                city: `City ${index}`,
                title: `Testimonial ${index}`,
                content: `This is testimonial content number ${index}. It contains enough text to meet the minimum requirements for a valid testimonial.`,
                status: 'approved'
            }));
            await prisma.testimonial.createMany({
                data: manyTestimonials
            });
            const startTime = Date.now();
            const res = await (0, supertest_1.default)(app_1.app)
                .get('/api/testimonials')
                .query({ limit: 20 });
            const endTime = Date.now();
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toHaveLength(20);
            expect(res.body.meta.total).toBe(103); // 100 + 3 from beforeEach
            // Response should be fast (under 1 second)
            expect(endTime - startTime).toBeLessThan(1000);
        });
    });
});
describe('POST /api/testimonials', () => {
    beforeEach(async () => {
        await prisma.testimonial.deleteMany({});
    });
    afterEach(async () => {
        await prisma.testimonial.deleteMany({});
    });
    describe('Valid submissions', () => {
        it('should submit a testimonial successfully with all fields', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/testimonials')
                .send({
                name: 'John Doe',
                email: 'john@example.com',
                city: 'Jakarta',
                title: 'Amazing Grace in My Life',
                content: 'This church has been a blessing to my family. The community is so welcoming and the teachings have transformed my life.'
            });
            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Testimonial submitted successfully. It will be reviewed before being published.');
            const testimonial = await prisma.testimonial.findFirst({
                where: { email: 'john@example.com' }
            });
            expect(testimonial).not.toBeNull();
            expect(testimonial?.name).toBe('John Doe');
            expect(testimonial?.city).toBe('Jakarta');
            expect(testimonial?.title).toBe('Amazing Grace in My Life');
            expect(testimonial?.status).toBe('pending'); // Default status
        });
        it('should submit testimonial with only required fields', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/testimonials')
                .send({
                name: 'Jane Smith',
                email: 'jane@example.com',
                title: 'Found Hope Here',
                content: 'I was going through a difficult time and found hope and healing through this church community.'
            });
            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            const testimonial = await prisma.testimonial.findFirst({
                where: { email: 'jane@example.com' }
            });
            expect(testimonial).not.toBeNull();
            expect(testimonial?.city).toBeNull(); // Optional field
            expect(testimonial?.status).toBe('pending');
        });
    });
});
afterAll(async () => {
    await prisma.testimonial.deleteMany({});
    await prisma.$disconnect();
});
//# sourceMappingURL=testimonial.test.js.map