"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [service.test.ts]: Service integration tests
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
describe('POST /api/services/song-request', () => {
    beforeEach(async () => {
        // Clean up before each test
        await prisma.songRequest.deleteMany({});
    });
    afterAll(async () => {
        await prisma.songRequest.deleteMany({});
    });
    describe('Valid submissions', () => {
        it('should submit a song request successfully with all fields', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/song-request')
                .send({
                name: 'John Doe',
                city: 'Jakarta',
                song_title: 'Amazing Grace',
                message: 'This song means a lot to me and my family.',
            });
            expect(res.statusCode).toEqual(201);
            expect(res.body.message).toBe('Song request submitted successfully.');
            const songRequest = await prisma.songRequest.findFirst({
                where: {
                    name: 'John Doe',
                },
            });
            expect(songRequest).not.toBeNull();
            expect(songRequest?.city).toBe('Jakarta');
            expect(songRequest?.songTitle).toBe('Amazing Grace');
            expect(songRequest?.message).toBe('This song means a lot to me and my family.');
        });
        it('should submit song request with only required fields', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/song-request')
                .send({
                name: 'Jane Smith',
                song_title: 'How Great Thou Art',
            });
            expect(res.statusCode).toEqual(201);
            expect(res.body.message).toBe('Song request submitted successfully.');
            const songRequest = await prisma.songRequest.findFirst({
                where: {
                    name: 'Jane Smith',
                },
            });
            expect(songRequest).not.toBeNull();
            expect(songRequest?.city).toBeNull();
            expect(songRequest?.message).toBeNull();
            expect(songRequest?.songTitle).toBe('How Great Thou Art');
        });
        it('should trim whitespace from all fields', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/song-request')
                .send({
                name: '  John Doe  ',
                city: '  Jakarta  ',
                song_title: '  Amazing Grace  ',
                message: '  This is my message  ',
            });
            expect(res.statusCode).toEqual(201);
            const songRequest = await prisma.songRequest.findFirst({
                where: {
                    name: 'John Doe',
                },
            });
            expect(songRequest?.name).toBe('John Doe');
            expect(songRequest?.city).toBe('Jakarta');
            expect(songRequest?.songTitle).toBe('Amazing Grace');
            expect(songRequest?.message).toBe('This is my message');
        });
    });
    describe('Validation errors', () => {
        it('should reject request without name', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/song-request')
                .send({
                song_title: 'Amazing Grace',
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body.errors).toContainEqual(expect.objectContaining({
                path: 'name',
                msg: 'Name is required',
            }));
        });
        it('should reject request without song title', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/song-request')
                .send({
                name: 'John Doe',
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body.errors).toContainEqual(expect.objectContaining({
                path: 'song_title',
                msg: 'Song title is required',
            }));
        });
        it('should reject request with name too short', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/song-request')
                .send({
                name: 'A',
                song_title: 'Amazing Grace',
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body.errors).toContainEqual(expect.objectContaining({
                path: 'name',
                msg: 'Name must be between 2 and 100 characters',
            }));
        });
        it('should reject request with name too long', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/song-request')
                .send({
                name: 'A'.repeat(101),
                song_title: 'Amazing Grace',
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body.errors).toContainEqual(expect.objectContaining({
                path: 'name',
                msg: 'Name must be between 2 and 100 characters',
            }));
        });
        it('should reject request with song title too long', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/song-request')
                .send({
                name: 'John Doe',
                song_title: 'A'.repeat(201),
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body.errors).toContainEqual(expect.objectContaining({
                path: 'song_title',
                msg: 'Song title must be between 1 and 200 characters',
            }));
        });
        it('should reject request with city too long', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/song-request')
                .send({
                name: 'John Doe',
                city: 'A'.repeat(101),
                song_title: 'Amazing Grace',
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body.errors).toContainEqual(expect.objectContaining({
                path: 'city',
                msg: 'City must be between 1 and 100 characters',
            }));
        });
        it('should reject request with message too long', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/song-request')
                .send({
                name: 'John Doe',
                song_title: 'Amazing Grace',
                message: 'A'.repeat(501),
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body.errors).toContainEqual(expect.objectContaining({
                path: 'message',
                msg: 'Message must be between 1 and 500 characters',
            }));
        });
    });
    describe('Rate limiting', () => {
        it('should have rate limiting headers in response', async () => {
            // Make a single request to check if rate limiting headers are present
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/song-request')
                .send({
                name: 'Test User',
                song_title: 'Test Song',
            });
            // Check if rate limiting headers are present (indicates middleware is working)
            expect(response.headers).toHaveProperty('x-ratelimit-limit');
            expect(response.headers).toHaveProperty('x-ratelimit-remaining');
            expect(response.status).toBe(201);
        });
    });
});
describe('POST /api/services/prayer', () => {
    beforeEach(async () => {
        await prisma.prayerRequest.deleteMany({});
    });
    describe('Valid submissions', () => {
        it('should submit a prayer request successfully with all fields', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/prayer')
                .send({
                name: 'John Doe',
                contact: 'john.doe@example.com',
                content: 'Please pray for my family during this difficult time. We need strength and guidance.',
                is_anonymous: false,
            });
            expect(res.statusCode).toEqual(201);
            expect(res.body.message).toBe('Prayer request submitted successfully.');
            const prayerRequest = await prisma.prayerRequest.findFirst({
                where: {
                    name: 'John Doe',
                },
            });
            expect(prayerRequest).not.toBeNull();
            expect(prayerRequest?.contact).toBe('john.doe@example.com');
            expect(prayerRequest?.isAnonymous).toBe(false);
        });
        it('should submit anonymous prayer request', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/prayer')
                .send({
                name: 'Anonymous User',
                contact: '+1234567890',
                content: 'Please pray for healing and peace in our community.',
                is_anonymous: true,
            });
            expect(res.statusCode).toEqual(201);
            expect(res.body.message).toBe('Prayer request submitted successfully.');
            const prayerRequest = await prisma.prayerRequest.findFirst({
                where: {
                    name: 'Anonymous User',
                },
            });
            expect(prayerRequest?.isAnonymous).toBe(true);
        });
        it('should accept phone number as contact', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/prayer')
                .send({
                name: 'Mary Smith',
                contact: '+1234567890',
                content: 'Please pray for my health and recovery from illness.',
            });
            expect(res.statusCode).toEqual(201);
        });
    });
    describe('Validation errors', () => {
        it('should return 422 when prayer content is empty', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/prayer')
                .send({
                name: 'Jane Doe',
                contact: 'jane.doe@example.com',
                content: '',
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Validation failed');
            expect(res.body.errors.length).toBeGreaterThan(0);
        });
        it('should return 422 when content is too short', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/prayer')
                .send({
                name: 'Test User',
                contact: 'test@example.com',
                content: 'Short',
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Validation failed');
            expect(res.body.errors).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    path: 'content',
                    msg: 'Prayer content must be between 10 and 2000 characters'
                })
            ]));
        });
        it('should return 422 when name is too short', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/prayer')
                .send({
                name: 'A',
                contact: 'test@example.com',
                content: 'Please pray for my family during this time.',
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Validation failed');
            expect(res.body.errors).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    path: 'name',
                    msg: 'Name must be between 2 and 100 characters'
                })
            ]));
        });
        it('should return 422 when contact is empty', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/prayer')
                .send({
                name: 'Test User',
                contact: '',
                content: 'Please pray for my family during this time.',
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Validation failed');
            expect(res.body.errors).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    path: 'contact',
                    msg: 'Contact information is required'
                })
            ]));
        });
        it('should return 422 when name is empty', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/prayer')
                .send({
                name: '',
                contact: 'test@example.com',
                content: 'Please pray for my family during this time.',
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Validation failed');
            expect(res.body.errors).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    path: 'name',
                    msg: 'Name is required'
                })
            ]));
        });
        it('should return 422 when required fields are missing', async () => {
            const res = await (0, supertest_1.default)(app_1.app)
                .post('/api/services/prayer')
                .send({});
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Validation failed');
            expect(res.body.errors.length).toBeGreaterThan(0);
        });
    });
    describe('Rate limiting', () => {
        it('should handle multiple requests within rate limit', async () => {
            const requests = [];
            for (let i = 0; i < 5; i++) {
                requests.push((0, supertest_1.default)(app_1.app)
                    .post('/api/services/prayer')
                    .send({
                    name: `User ${i}`,
                    contact: `user${i}@example.com`,
                    content: `Prayer request number ${i} for testing rate limiting.`,
                }));
            }
            const responses = await Promise.all(requests);
            responses.forEach(res => {
                expect(res.statusCode).toEqual(201);
            });
        });
    });
});
afterAll(async () => {
    await prisma.prayerRequest.deleteMany({});
    await prisma.songRequest.deleteMany({});
    await prisma.$disconnect();
});
//# sourceMappingURL=service.test.js.map