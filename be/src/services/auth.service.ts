// [auth.service.ts]: Authentication logic
import { findUserByEmail } from './user.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { createClient } from 'redis';

// Redis client for token blacklisting
const redisClient = createClient({
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
export const closeRedisConnection = async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return user;
};

export const generateToken = (user: User) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  const payload = {
    sub: user.id,
    role: user.role,
    jti: require('crypto').randomUUID(), // Add JWT ID for blacklisting
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  return token;
};

// Add token to blacklist
export const blacklistToken = async (token: string) => {
  try {
    // Ensure Redis is connected
    await connectRedis();

    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.jti) {
      throw new Error('Invalid token format');
    }

    // Calculate TTL based on remaining token validity
    const currentTime = Math.floor(Date.now() / 1000);
    const ttl = Math.max(0, decoded.exp - currentTime);

    // Store token jti in Redis with TTL
    await redisClient.setEx(`blacklist:${decoded.jti}`, ttl, token);
    return true;
  } catch (error) {
    console.error('Error blacklisting token:', error);
    return false;
  }
};

// Check if token is blacklisted
export const isTokenBlacklisted = async (token: string) => {
  try {
    // Ensure Redis is connected
    await connectRedis();

    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.jti) {
      return false;
    }

    const blacklistedToken = await redisClient.get(`blacklist:${decoded.jti}`);
    return blacklistedToken === token;
  } catch (error) {
    console.error('Error checking blacklist:', error);
    return false;
  }
};
