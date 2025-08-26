"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [program.integration.test.ts]: Integration tests for program API endpoints
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const client_1 = require("@prisma/client");
const app_1 = require("../src/app");
const prisma = new client_1.PrismaClient();
(0, globals_1.describe)('Program API Integration Tests', () => {
    (0, globals_1.beforeAll)(async () => {
        // Clean up test data
        await prisma.schedule.deleteMany({});
        await prisma.program.deleteMany({});
    });
    (0, globals_1.afterAll)(async () => {
        // Clean up test data
        await prisma.schedule.deleteMany({});
        await prisma.program.deleteMany({});
        await prisma.$disconnect();
    });
    (0, globals_1.beforeEach)(async () => {
        // Clean up before each test
        await prisma.schedule.deleteMany({});
        await prisma.program.deleteMany({});
    });
    (0, globals_1.describe)('GET /api/programs/schedule', () => {
        (0, globals_1.it)('should return 200 and empty schedule when no programs exist', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/programs/schedule')
                .expect(200);
            (0, globals_1.expect)(response.body).toEqual({
                success: true,
                data: {
                    sunday: [],
                    monday: [],
                    tuesday: [],
                    wednesday: [],
                    thursday: [],
                    friday: [],
                    saturday: []
                }
            });
        });
        (0, globals_1.it)('should return 200 and weekly schedule with seeded data', async () => {
            // Seed test data
            const morningShow = await prisma.program.create({
                data: {
                    name: 'Morning Show',
                    description: 'Start your day with us'
                }
            });
            const eveningNews = await prisma.program.create({
                data: {
                    name: 'Evening News',
                    description: 'Daily news update'
                }
            });
            const musicHour = await prisma.program.create({
                data: {
                    name: 'Music Hour',
                    description: 'Best music selection'
                }
            });
            // Create schedules for different days
            await prisma.schedule.createMany({
                data: [
                    // Monday
                    {
                        programId: morningShow.id,
                        dayOfWeek: 1,
                        startTime: '06:00',
                        endTime: '09:00',
                        isActive: true
                    },
                    {
                        programId: eveningNews.id,
                        dayOfWeek: 1,
                        startTime: '18:00',
                        endTime: '19:00',
                        isActive: true
                    },
                    // Tuesday
                    {
                        programId: morningShow.id,
                        dayOfWeek: 2,
                        startTime: '06:00',
                        endTime: '09:00',
                        isActive: true
                    },
                    {
                        programId: musicHour.id,
                        dayOfWeek: 2,
                        startTime: '20:00',
                        endTime: '22:00',
                        isActive: true
                    },
                    // Wednesday - inactive schedule (should not appear)
                    {
                        programId: morningShow.id,
                        dayOfWeek: 3,
                        startTime: '06:00',
                        endTime: '09:00',
                        isActive: false
                    },
                    // Sunday
                    {
                        programId: musicHour.id,
                        dayOfWeek: 0,
                        startTime: '14:00',
                        endTime: '16:00',
                        isActive: true
                    }
                ]
            });
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/programs/schedule')
                .expect(200);
            (0, globals_1.expect)(response.body.success).toBe(true);
            (0, globals_1.expect)(response.body.data).toBeDefined();
            const schedule = response.body.data;
            // Check Sunday
            (0, globals_1.expect)(schedule.sunday).toHaveLength(1);
            (0, globals_1.expect)(schedule.sunday[0]).toEqual({
                time: '14:00',
                endTime: '16:00',
                program_name: 'Music Hour',
                program_id: musicHour.id,
                description: 'Best music selection'
            });
            // Check Monday (should have 2 programs ordered by time)
            (0, globals_1.expect)(schedule.monday).toHaveLength(2);
            (0, globals_1.expect)(schedule.monday[0]).toEqual({
                time: '06:00',
                endTime: '09:00',
                program_name: 'Morning Show',
                program_id: morningShow.id,
                description: 'Start your day with us'
            });
            (0, globals_1.expect)(schedule.monday[1]).toEqual({
                time: '18:00',
                endTime: '19:00',
                program_name: 'Evening News',
                program_id: eveningNews.id,
                description: 'Daily news update'
            });
            // Check Tuesday
            (0, globals_1.expect)(schedule.tuesday).toHaveLength(2);
            (0, globals_1.expect)(schedule.tuesday[0].time).toBe('06:00');
            (0, globals_1.expect)(schedule.tuesday[1].time).toBe('20:00');
            // Check Wednesday (should be empty due to inactive schedule)
            (0, globals_1.expect)(schedule.wednesday).toHaveLength(0);
            // Check other days are empty
            (0, globals_1.expect)(schedule.thursday).toHaveLength(0);
            (0, globals_1.expect)(schedule.friday).toHaveLength(0);
            (0, globals_1.expect)(schedule.saturday).toHaveLength(0);
        });
        (0, globals_1.it)('should handle database errors gracefully', async () => {
            // Disconnect prisma to simulate database error
            await prisma.$disconnect();
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/programs/schedule')
                .expect(500);
            (0, globals_1.expect)(response.body).toEqual({
                success: false,
                message: 'Internal server error while fetching weekly schedule'
            });
            // Reconnect for cleanup
            await prisma.$connect();
        });
        (0, globals_1.it)('should return consistent response structure', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/programs/schedule')
                .expect(200);
            (0, globals_1.expect)(response.body).toHaveProperty('success');
            (0, globals_1.expect)(response.body).toHaveProperty('data');
            (0, globals_1.expect)(typeof response.body.success).toBe('boolean');
            (0, globals_1.expect)(typeof response.body.data).toBe('object');
            const schedule = response.body.data;
            const expectedDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            expectedDays.forEach(day => {
                (0, globals_1.expect)(schedule).toHaveProperty(day);
                (0, globals_1.expect)(Array.isArray(schedule[day])).toBe(true);
            });
        });
        (0, globals_1.it)('should handle large dataset efficiently', async () => {
            // Create multiple programs
            const programs = await Promise.all([
                prisma.program.create({ data: { name: 'Program 1', description: 'Description 1' } }),
                prisma.program.create({ data: { name: 'Program 2', description: 'Description 2' } }),
                prisma.program.create({ data: { name: 'Program 3', description: 'Description 3' } })
            ]);
            // Create many schedules
            const scheduleData = [];
            for (let day = 0; day < 7; day++) {
                for (let hour = 6; hour < 22; hour += 2) {
                    const programIndex = (day + hour) % programs.length;
                    scheduleData.push({
                        programId: programs[programIndex]?.id || programs[0].id,
                        dayOfWeek: day,
                        startTime: `${hour.toString().padStart(2, '0')}:00`,
                        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
                        isActive: true
                    });
                }
            }
            await prisma.schedule.createMany({ data: scheduleData });
            const startTime = Date.now();
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/programs/schedule')
                .expect(200);
            const endTime = Date.now();
            // Should respond within reasonable time (less than 1 second)
            (0, globals_1.expect)(endTime - startTime).toBeLessThan(1000);
            (0, globals_1.expect)(response.body.success).toBe(true);
            // Verify all days have schedules
            const schedule = response.body.data;
            Object.values(schedule).forEach((daySchedule) => {
                (0, globals_1.expect)(daySchedule.length).toBeGreaterThan(0);
            });
        });
    });
});
//# sourceMappingURL=program.integration.test.js.map