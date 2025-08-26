// [program.test.ts]: Unit tests for program service
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { findWeeklySchedule, findTodaySchedule } from '../src/services/program.service';

const prisma = new PrismaClient();

describe('Program Service', () => {
  beforeAll(async () => {
    // Clean up test data
    await prisma.schedule.deleteMany({});
    await prisma.program.deleteMany({});
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.schedule.deleteMany({});
    await prisma.program.deleteMany({});
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up before each test
    await prisma.schedule.deleteMany({});
    await prisma.program.deleteMany({});
  });

  describe('findWeeklySchedule', () => {
    it('should return empty schedule when no programs exist', async () => {
      const result = await findWeeklySchedule();
      
      expect(result).toEqual({
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: []
      });
    });

    it('should return weekly schedule grouped by day', async () => {
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

      const result = await findWeeklySchedule();

      // Check Monday has 2 programs
      expect(result.monday).toHaveLength(2);
      expect(result.monday[0]).toEqual({
        time: '08:00',
        endTime: '10:00',
        program_name: 'Morning Show',
        program_id: program1.id,
        description: 'Morning radio program'
      });
      expect(result.monday[1]).toEqual({
        time: '18:00',
        endTime: '19:00',
        program_name: 'Evening News',
        program_id: program2.id,
        description: 'Evening news program'
      });

      // Check Tuesday has 1 program
      expect(result.tuesday).toHaveLength(1);
      expect(result.tuesday[0].program_name).toBe('Morning Show');

      // Check Wednesday has no programs (inactive schedule)
      expect(result.wednesday).toHaveLength(0);

      // Check other days are empty
      expect(result.sunday).toHaveLength(0);
      expect(result.thursday).toHaveLength(0);
      expect(result.friday).toHaveLength(0);
      expect(result.saturday).toHaveLength(0);
    });

    it('should order schedules by start time within each day', async () => {
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

      const result = await findWeeklySchedule();

      expect(result.monday).toHaveLength(3);
      expect(result.monday[0].time).toBe('08:00');
      expect(result.monday[1].time).toBe('12:00');
      expect(result.monday[2].time).toBe('20:00');
    });
  });

  describe('findTodaySchedule', () => {
    it('should return today\'s schedule only', async () => {
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

      const result = await findTodaySchedule();

      expect(result).toHaveLength(1);
      expect(result[0]?.program_name).toBe('Today Program');
      expect(result[0]?.time).toBe('10:00');
    });
  });
});