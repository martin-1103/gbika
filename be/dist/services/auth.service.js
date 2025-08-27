"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenBlacklisted = exports.blacklistToken = exports.generateToken = exports.loginUser = exports.closeRedisConnection = void 0;
// [auth.service.ts]: Authentication logic
const user_service_1 = require("./user.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("redis");
// Redis client for token blacklisting
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});
// Connect to Redis only if not already connected
const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};
// Function to close Redis connection (for testing)
const closeRedisConnection = async () => {
    if (redisClient.isOpen) {
        await redisClient.quit();
    }
};
exports.closeRedisConnection = closeRedisConnection;
const loginUser = async (email, password) => {
    const user = await (0, user_service_1.findUserByEmail)(email);
    if (!user) {
        return null;
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return null;
    }
    return user;
};
exports.loginUser = loginUser;
const generateToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    const payload = {
        sub: user.id,
        role: user.role,
        jti: require('crypto').randomUUID(), // Add JWT ID for blacklisting
    };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
    return token;
};
exports.generateToken = generateToken;
// Add token to blacklist
const blacklistToken = async (token) => {
    try {
        // Ensure Redis is connected
        await connectRedis();
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded || !decoded.jti) {
            throw new Error('Invalid token format');
        }
        // Calculate TTL based on remaining token validity
        const currentTime = Math.floor(Date.now() / 1000);
        const ttl = Math.max(0, decoded.exp - currentTime);
        // Store token jti in Redis with TTL
        await redisClient.setEx(`blacklist:${decoded.jti}`, ttl, token);
        return true;
    }
    catch (error) {
        console.error('Error blacklisting token:', error);
        return false;
    }
};
exports.blacklistToken = blacklistToken;
// Check if token is blacklisted
const isTokenBlacklisted = async (token) => {
    try {
        // Ensure Redis is connected
        await connectRedis();
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded || !decoded.jti) {
            return false;
        }
        const blacklistedToken = await redisClient.get(`blacklist:${decoded.jti}`);
        return blacklistedToken === token;
    }
    catch (error) {
        console.error('Error checking blacklist:', error);
        return false;
    }
};
exports.isTokenBlacklisted = isTokenBlacklisted;
//# sourceMappingURL=auth.service.js.map