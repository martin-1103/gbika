// PageService: Database operations for pages
import { PrismaClient } from '@prisma/client';
import { createClient, RedisClientType } from 'redis';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const prisma = new PrismaClient();

// Create Redis client with better error handling
let redisClient: RedisClientType | null;
try {
  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379')
    }
  });
  
  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });
  
  redisClient.connect().catch((err) => {
    console.error('Redis connection failed:', err);
  });
} catch (error) {
  console.error('Failed to create Redis client:', error);
  redisClient = null;
}

// Find page by slug with caching
const findOneBySlug = async (slug: string): Promise<Page | null> => {
  const cacheKey = `page:${slug}`;
  
  try {
    // Try to get from cache first if Redis is available
    if (redisClient) {
      try {
        const cachedPage = await redisClient.get(cacheKey);
        if (cachedPage) {
          return JSON.parse(cachedPage) as Page;
        }
      } catch (cacheError) {
        console.error('Cache read error:', cacheError);
        // Continue to database if cache fails
      }
    }
    
    // If not in cache, get from database
    const page = await prisma.page.findFirst({
      where: {
        slug: slug,
        status: 'published'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    }) as Page | null;
    
    // Cache the result if Redis is available and page exists
    if (page && redisClient) {
      try {
        // Cache for 2 hours (7200 seconds)
        await redisClient.setEx(cacheKey, 7200, JSON.stringify(page));
      } catch (cacheError) {
        console.error('Cache write error:', cacheError);
        // Don't fail the request if caching fails
      }
    }
    
    return page;
  } catch (error) {
    console.error('Error in findOneBySlug:', error);
    throw error;
  }
};

// Invalidate cache for a specific page slug
const invalidatePageCache = async (slug: string): Promise<void> => {
  if (!redisClient) return;
  
  const cacheKey = `page:${slug}`;
  try {
    await redisClient.del(cacheKey);
  } catch (error) {
    console.error('Error invalidating page cache:', error);
  }
};

// Close Redis connection (for cleanup)
const closeRedisConnection = async (): Promise<void> => {
  if (redisClient) {
    try {
      await redisClient.quit();
    } catch (error) {
      console.error('Error closing Redis connection:', error);
    }
  }
};

export {
  findOneBySlug,
  invalidatePageCache,
  closeRedisConnection
};