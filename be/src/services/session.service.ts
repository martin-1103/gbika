// SessionService: Database operations for livechat sessions
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { createClient } from 'redis';

interface UserData {
  name: string;
  city?: string;
  country?: string;
}

interface TokenPayload {
  session_id: string;
  user_id: string;
  name: string;
}

interface SessionData {
  id: string;
  guestUserId: string;
  isActive: boolean;
  expiresAt: string;
  guestUser: {
    id: string;
    name: string;
    city: string | null;
    country: string | null;
  };
}

interface CreateSessionResult {
  session: any;
  sessionToken: string;
}

const prisma = new PrismaClient();

// Create Redis client with better error handling
let redisClient: any | null;
try {
  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379')
    }
  });
  
  redisClient.on('error', (err: Error) => {
    console.error('Redis Client Error:', err);
  });
  
  redisClient.connect().catch((err: Error) => {
    console.error('Redis connection failed:', err);
  });
} catch (error) {
  console.error('Failed to create Redis client:', error);
  redisClient = null;
}

// Create new livechat session
const createSession = async (userData: UserData): Promise<CreateSessionResult> => {
  try {
    const { name, city, country } = userData;
    
    // Create or find guest user
    const guestUser = await prisma.guestUser.create({
      data: {
        name,
        city: city || null,
        country: country || null
      }
    });
    
    // Create session with 24 hour expiry
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    const session = await prisma.session.create({
      data: {
        guestUserId: guestUser.id,
        expiresAt,
        isActive: true
      },
      include: {
        guestUser: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true
          }
        }
      }
    });
    
    // Generate JWT token
    const tokenPayload: TokenPayload = {
      session_id: session.id,
      user_id: guestUser.id,
      name: guestUser.name
    };
    
    const sessionToken = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );
    
    // Cache session data in Redis if available
    if (redisClient) {
      try {
        const cacheKey = `session:${session.id}`;
        const cacheData = JSON.stringify({
          id: session.id,
          guestUserId: session.guestUserId,
          isActive: session.isActive,
          expiresAt: session.expiresAt.toISOString(),
          guestUser: session.guestUser
        });
        await redisClient.setEx(cacheKey, 86400, cacheData); // 24 hours TTL
      } catch (cacheError) {
        console.error('Failed to cache session:', cacheError);
      }
    }
    
    return {
      session,
      sessionToken
    };
  } catch (error) {
    console.error('Error in createSession:', error);
    throw error;
  }
};

// Find session by ID with caching
const findSessionById = async (sessionId: string): Promise<any | null> => {
  try {
    // Try to get from cache first
    if (redisClient) {
      try {
        const cacheKey = `session:${sessionId}`;
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
          const sessionData: SessionData = JSON.parse(cachedData);
          // Check if session is still valid
          if (new Date(sessionData.expiresAt) > new Date() && sessionData.isActive) {
            return sessionData;
          }
        }
      } catch (cacheError) {
        console.error('Cache read error:', cacheError);
      }
    }
    
    // Get from database
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId
      },
      include: {
        guestUser: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true
          }
        }
      }
    });
    
    if (!session) {
      return null;
    }
    
    // Check if session is expired or inactive
    if (session.expiresAt < new Date() || !session.isActive) {
      return null;
    }
    
    // Update cache if available
    if (redisClient) {
      try {
        const cacheKey = `session:${sessionId}`;
        const cacheData = JSON.stringify({
          id: session.id,
          guestUserId: session.guestUserId,
          isActive: session.isActive,
          expiresAt: session.expiresAt.toISOString(),
          guestUser: session.guestUser
        });
        const ttl = Math.floor((session.expiresAt.getTime() - new Date().getTime()) / 1000);
        if (ttl > 0) {
          await redisClient.setEx(cacheKey, ttl, cacheData);
        }
      } catch (cacheError) {
        console.error('Failed to update cache:', cacheError);
      }
    }
    
    return session;
  } catch (error) {
    console.error('Error in findSessionById:', error);
    throw error;
  }
};

// Invalidate session
const invalidateSession = async (sessionId: string): Promise<boolean> => {
  try {
    // Update database
    await prisma.session.update({
      where: {
        id: sessionId
      },
      data: {
        isActive: false
      }
    });
    
    // Remove from cache
    if (redisClient) {
      try {
        const cacheKey = `session:${sessionId}`;
        await redisClient.del(cacheKey);
      } catch (cacheError) {
        console.error('Failed to invalidate session cache:', cacheError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in invalidateSession:', error);
    throw error;
  }
};

// Cleanup expired sessions (can be called by a cron job)
const cleanupExpiredSessions = async (): Promise<number> => {
  try {
    const result = await prisma.session.updateMany({
      where: {
        expiresAt: {
          lt: new Date()
        },
        isActive: true
      },
      data: {
        isActive: false
      }
    });
    
    console.log(`Cleaned up ${result.count} expired sessions`);
    return result.count;
  } catch (error) {
    console.error('Error in cleanupExpiredSessions:', error);
    throw error;
  }
};

// Close Redis connection
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
  createSession,
  findSessionById,
  invalidateSession,
  cleanupExpiredSessions,
  closeRedisConnection
};