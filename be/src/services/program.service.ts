// [program.service.ts]: Program and schedule business logic
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Redis client for caching (temporarily disabled for compilation)
let redisClient: any = null;

// Get today's schedule
export const findTodaySchedule = async () => {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    
    const schedules = await prisma.schedule.findMany({
      where: {
        dayOfWeek,
        isActive: true
      },
      include: {
        program: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });
    
    // Transform data to match expected format
    return schedules.map(schedule => ({
      time: schedule.startTime,
      endTime: schedule.endTime,
      program_name: schedule.program.name,
      program_id: schedule.program.id,
      description: schedule.program.description
    }));
  } catch (error) {
    console.error('Error in findTodaySchedule:', error);
    throw error;
  }
};

// Interface for schedule item
interface ScheduleItem {
  time: string;
  endTime: string;
  program_name: string;
  program_id: string;
  description: string | null;
}

// Get weekly schedule grouped by day with caching
export const findWeeklySchedule = async () => {
  const cacheKey = 'weekly_schedule';
  const cacheTTL = 3600; // 1 hour in seconds
  
  try {
    // Try to get from cache first if Redis is available
    if (redisClient && redisClient.isOpen) {
      try {
        const cachedSchedule = await redisClient.get(cacheKey);
        if (cachedSchedule) {
          console.log('Weekly schedule served from cache');
          return JSON.parse(cachedSchedule);
        }
      } catch (cacheError) {
        console.error('Cache read error:', cacheError);
        // Continue to database if cache fails
      }
    }
    
    // If not in cache, get from database
    const schedules = await prisma.schedule.findMany({
      where: {
        isActive: true
      },
      include: {
        program: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });
    
    // Group by day of week
    const weeklySchedule: Record<string, ScheduleItem[]> = {
      sunday: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: []
    };
    
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    
    schedules.forEach(schedule => {
      const dayName = dayNames[schedule.dayOfWeek] as keyof typeof weeklySchedule;
      if (dayName && weeklySchedule[dayName]) {
        weeklySchedule[dayName].push({
          time: schedule.startTime,
          endTime: schedule.endTime,
          program_name: schedule.program.name,
          program_id: schedule.program.id,
          description: schedule.program.description
        });
      }
    });
    
    // Cache the result if Redis is available
    if (redisClient && redisClient.isOpen) {
      try {
        await redisClient.setEx(cacheKey, cacheTTL, JSON.stringify(weeklySchedule));
        console.log('Weekly schedule cached successfully');
      } catch (cacheError) {
        console.error('Cache write error:', cacheError);
      }
    }
    
    return weeklySchedule;
  } catch (error) {
    console.error('Error in findWeeklySchedule:', error);
    throw error;
  }
};

// Invalidate weekly schedule cache
export const invalidateWeeklyScheduleCache = async () => {
  if (!redisClient || !redisClient.isOpen) return;
  
  try {
    const cacheKey = 'weekly_schedule';
    await redisClient.del(cacheKey);
    console.log('Weekly schedule cache invalidated');
  } catch (error) {
    console.error('Error invalidating weekly schedule cache:', error);
  }
};

// Close Redis connection (for cleanup)
export const closeRedisConnection = async () => {
  if (redisClient && redisClient.isOpen) {
    try {
      await redisClient.quit();
      console.log('Program service Redis connection closed');
    } catch (error) {
      console.error('Error closing Redis connection:', error);
    }
  }
};