"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// [program.test.ts]: Unit tests for program service
const globals_1 = require("@jest/globals");
const client_1 = require("@prisma/client");
const program_service_1 = require("../src/services/program.service");
const prisma = new client_1.PrismaClient();
(0, globals_1.describe)('Program Service', () => {
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
    (0, globals_1.describe)('findWeeklySchedule', () => {
        (0, globals_1.it)('should return empty schedule when no programs exist', async () => {
            const result = await (0, program_service_1.findWeeklySchedule)();
            (0, globals_1.expect)(result).toEqual({
                sunday: [],
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: []
            });
        });
        (0, globals_1.it)('should return weekly schedule grouped by day', async () => {
            // Create test programs
            const program1 = await prisma.program.create({
                data: {
                    name: 'Morning Show',
                    description: 'Morning radio program'
                }
            });
            const program2 = await prisma.program.create({
                data: {
                    name: 'Evening News',
                    description: 'Evening news program'
                }
            });
            // Create test schedules
            await prisma.schedule.createMany({
                data: [
                    {
                        programId: program1.id,
                        dayOfWeek: 1, // Monday
                        startTime: '08:00',
                        endTime: '10:00',
                        isActive: true
                    },
                    {
                        programId: program2.id,
                        dayOfWeek: 1, // Monday
                        startTime: '18:00',
                        endTime: '19:00',
                        isActive: true
                    },
                    {
                        programId: program1.id,
                        dayOfWeek: 2, // Tuesday
                        startTime: '08:00',
                        endTime: '10:00',
                        isActive: true
                    },
                    {
                        programId: program1.id,
                        dayOfWeek: 3, // Wednesday
                        startTime: '08:00',
                        endTime: '10:00',
                        isActive: false // Inactive schedule
                    }
                ]
            });
            const result = await (0, program_service_1.findWeeklySchedule)();
            // Check Monday has 2 programs
            (0, globals_1.expect)(result.monday).toHaveLength(2);
            (0, globals_1.expect)(result.monday[0]).toEqual({
                time: '08:00',
                endTime: '10:00',
                program_name: 'Morning Show',
                program_id: program1.id,
                description: 'Morning radio program'
            });
            (0, globals_1.expect)(result.monday[1]).toEqual({
                time: '18:00',
                endTime: '19:00',
                program_name: 'Evening News',
                program_id: program2.id,
                description: 'Evening news program'
            });
            // Check Tuesday has 1 program
            (0, globals_1.expect)(result.tuesday).toHaveLength(1);
            (0, globals_1.expect)(result.tuesday[0].program_name).toBe('Morning Show');
            // Check Wednesday has no programs (inactive schedule)
            (0, globals_1.expect)(result.wednesday).toHaveLength(0);
            // Check other days are empty
            (0, globals_1.expect)(result.sunday).toHaveLength(0);
            (0, globals_1.expect)(result.thursday).toHaveLength(0);
            (0, globals_1.expect)(result.friday).toHaveLength(0);
            (0, globals_1.expect)(result.saturday).toHaveLength(0);
        });
        (0, globals_1.it)('should order schedules by start time within each day', async () => {
            const program = await prisma.program.create({
                data: {
                    name: 'Test Program',
                    description: 'Test description'
                }
            });
            // Create schedules in reverse time order
            await prisma.schedule.createMany({
                data: [
                    {
                        programId: program.id,
                        dayOfWeek: 1, // Monday
                        startTime: '20:00',
                        endTime: '21:00',
                        isActive: true
                    },
                    {
                        programId: program.id,
                        dayOfWeek: 1, // Monday
                        startTime: '08:00',
                        endTime: '09:00',
                        isActive: true
                    },
                    {
                        programId: program.id,
                        dayOfWeek: 1, // Monday
                        startTime: '12:00',
                        endTime: '13:00',
                        isActive: true
                    }
                ]
            });
            const result = await (0, program_service_1.findWeeklySchedule)();
            (0, globals_1.expect)(result.monday).toHaveLength(3);
            (0, globals_1.expect)(result.monday[0].time).toBe('08:00');
            (0, globals_1.expect)(result.monday[1].time).toBe('12:00');
            (0, globals_1.expect)(result.monday[2].time).toBe('20:00');
        });
    });
    (0, globals_1.describe)('findTodaySchedule', () => {
        (0, globals_1.it)('should return today\'s schedule only', async () => {
            const program = await prisma.program.create({
                data: {
                    name: 'Today Program',
                    description: 'Program for today'
                }
            });
            const today = new Date();
            const todayDayOfWeek = today.getDay();
            const otherDay = todayDayOfWeek === 0 ? 1 : 0; // Different day
            await prisma.schedule.createMany({
                data: [
                    {
                        programId: program.id,
                        dayOfWeek: todayDayOfWeek,
                        startTime: '10:00',
                        endTime: '11:00',
                        isActive: true
                    },
                    {
                        programId: program.id,
                        dayOfWeek: otherDay,
                        startTime: '10:00',
                        endTime: '11:00',
                        isActive: true
                    }
                ]
            });
            const result = await (0, program_service_1.findTodaySchedule)();
            (0, globals_1.expect)(result).toHaveLength(1);
            (0, globals_1.expect)(result[0]?.program_name).toBe('Today Program');
            (0, globals_1.expect)(result[0]?.time).toBe('10:00');
        });
    });
});
//# sourceMappingURL=program.test.js.map