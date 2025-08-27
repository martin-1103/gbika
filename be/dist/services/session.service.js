"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeRedisConnection = exports.cleanupExpiredSessions = exports.invalidateSession = exports.findSessionById = exports.createSession = void 0;
// SessionService: Database operations for livechat sessions
const client_1 = require("@prisma/client");
const jwt = __importStar(require("jsonwebtoken"));
const redis_1 = require("redis");
const prisma = new client_1.PrismaClient();
// Create Redis client with better error handling
let redisClient;
try {
    redisClient = (0, redis_1.createClient)({
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
}
catch (error) {
    console.error('Failed to create Redis client:', error);
    redisClient = null;
}
// Create new livechat session
const createSession = async (userData) => {
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
        const tokenPayload = {
            session_id: session.id,
            user_id: guestUser.id,
            name: guestUser.name
        };
        const sessionToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '24h' });
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
            }
            catch (cacheError) {
                console.error('Failed to cache session:', cacheError);
            }
        }
        return {
            session,
            sessionToken
        };
    }
    catch (error) {
        console.error('Error in createSession:', error);
        throw error;
    }
};
exports.createSession = createSession;
// Find session by ID with caching
const findSessionById = async (sessionId) => {
    try {
        // Try to get from cache first
        if (redisClient) {
            try {
                const cacheKey = `session:${sessionId}`;
                const cachedData = await redisClient.get(cacheKey);
                if (cachedData) {
                    const sessionData = JSON.parse(cachedData);
                    // Check if session is still valid
                    if (new Date(sessionData.expiresAt) > new Date() && sessionData.isActive) {
                        return sessionData;
                    }
                }
            }
            catch (cacheError) {
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
            }
            catch (cacheError) {
                console.error('Failed to update cache:', cacheError);
            }
        }
        return session;
    }
    catch (error) {
        console.error('Error in findSessionById:', error);
        throw error;
    }
};
exports.findSessionById = findSessionById;
// Invalidate session
const invalidateSession = async (sessionId) => {
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
            }
            catch (cacheError) {
                console.error('Failed to invalidate session cache:', cacheError);
            }
        }
        return true;
    }
    catch (error) {
        console.error('Error in invalidateSession:', error);
        throw error;
    }
};
exports.invalidateSession = invalidateSession;
// Cleanup expired sessions (can be called by a cron job)
const cleanupExpiredSessions = async () => {
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
    }
    catch (error) {
        console.error('Error in cleanupExpiredSessions:', error);
        throw error;
    }
};
exports.cleanupExpiredSessions = cleanupExpiredSessions;
// Close Redis connection
const closeRedisConnection = async () => {
    if (redisClient) {
        try {
            await redisClient.quit();
        }
        catch (error) {
            console.error('Error closing Redis connection:', error);
        }
    }
};
exports.closeRedisConnection = closeRedisConnection;
//# sourceMappingURL=session.service.js.map