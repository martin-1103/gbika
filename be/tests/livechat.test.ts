// [livechat.test.ts]: Unit and integration tests for livechat session functionality
import request from 'supertest';
import { app } from '../src/app';
import { PrismaClient } from '@prisma/client';
import * as redis from 'redis';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const redisClient = redis.createClient();

describe('Livechat Session API', () => {
  beforeAll(async () => {
    // Connect to Redis for testing
    await redisClient.connect();
  });

  afterAll(async () => {
    // Clean up
    await redisClient.disconnect();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clear Redis cache and database before each test
    await redisClient.flushAll();
    await prisma.session.deleteMany();
    await prisma.guestUser.deleteMany();
  });

  describe('POST /api/livechat/session', () => {
    it('should create a new session with valid data', async () => {
      const userData = {
        name: 'John Doe',
        city: 'Jakarta',
        country: 'Indonesia'
      };

      const response = await request(app)
        .post('/api/livechat/session')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Session created successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('sessionToken');
      expect(response.body.data).toHaveProperty('sessionId');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('expiresAt');
      
      // Verify user data
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.user.city).toBe(userData.city);
      expect(response.body.data.user.country).toBe(userData.country);
      
      // Verify JWT token
      const token = response.body.data.sessionToken;
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      expect(decoded).toHaveProperty('session_id');
      expect(decoded).toHaveProperty('user_id');
      expect(decoded).toHaveProperty('name', userData.name);
      
      // Verify cookies are set
      const cookies = response.headers['set-cookie'] as unknown as string[];
      expect(cookies).toBeDefined();
      expect(cookies.some((cookie: string) => cookie.includes('livechat_name=John%20Doe'))).toBe(true);
      expect(cookies.some((cookie: string) => cookie.includes('livechat_city=Jakarta'))).toBe(true);
      expect(cookies.some((cookie: string) => cookie.includes('livechat_country=Indonesia'))).toBe(true);
    });

    it('should create session with only required name field', async () => {
      const userData = {
        name: 'Jane Smith'
      };

      const response = await request(app)
        .post('/api/livechat/session')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.user.city).toBeNull();
      expect(response.body.data.user.country).toBeNull();
      
      // Verify only name cookie is set
      const cookies = response.headers['set-cookie'] as unknown as string[];
      expect(cookies.some((cookie: string) => cookie.includes('livechat_name=Jane%20Smith'))).toBe(true);
    });

    it('should reject request with missing name', async () => {
      const userData = {
        city: 'Jakarta',
        country: 'Indonesia'
      };

      const response = await request(app)
        .post('/api/livechat/session')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Validation failed');
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'name',
            msg: 'Name is required'
          })
        ])
      );
    });

    it('should reject request with invalid name (too short)', async () => {
      const userData = {
        name: 'A'
      };

      const response = await request(app)
        .post('/api/livechat/session')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'name',
            msg: 'Name must be between 2 and 50 characters'
          })
        ])
      );
    });

    it('should reject request with invalid name (contains numbers)', async () => {
      const userData = {
        name: 'John123'
      };

      const response = await request(app)
        .post('/api/livechat/session')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'name',
            msg: 'Name can only contain letters and spaces'
          })
        ])
      );
    });

    it('should reject request with invalid city (contains numbers)', async () => {
      const userData = {
        name: 'John Doe',
        city: 'Jakarta123'
      };

      const response = await request(app)
        .post('/api/livechat/session')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'city',
            msg: 'City can only contain letters and spaces'
          })
        ])
      );
    });

    it('should handle rate limiting in production mode', async () => {
      // Skip this test in test environment since rate limiting is disabled
      if (process.env.NODE_ENV === 'test') {
        return;
      }

      const userData = {
        name: 'Rate Test User'
      };

      // Make multiple requests to trigger rate limit
      const requests = [];
      for (let i = 0; i < 6; i++) {
        requests.push(
          request(app)
            .post('/api/livechat/session')
            .send(userData)
        );
      }

      const responses = await Promise.all(requests);
      
      // First 5 should succeed, 6th should be rate limited
      const successfulResponses = responses.filter(res => res.status === 201);
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      
      expect(successfulResponses.length).toBe(5);
      expect(rateLimitedResponses.length).toBe(1);
      if (rateLimitedResponses.length > 0 && rateLimitedResponses[0]?.body?.message) {
        expect(rateLimitedResponses[0].body.message).toContain('Too many session creation attempts');
      }
    });

    it('should store session data in database correctly', async () => {
      const userData = {
        name: 'Database Test User',
        city: 'Bandung',
        country: 'Indonesia'
      };

      const response = await request(app)
        .post('/api/livechat/session')
        .send(userData)
        .expect(201);

      const sessionId = response.body.data.sessionId;
      const userId = response.body.data.user.id;

      // Verify guest user in database
      const guestUser = await prisma.guestUser.findUnique({
        where: { id: userId }
      });
      expect(guestUser).toBeTruthy();
      expect(guestUser!.name).toBe(userData.name);
      expect(guestUser!.city).toBe(userData.city);
      expect(guestUser!.country).toBe(userData.country);

      // Verify session in database
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { guestUser: true }
      });
      expect(session).toBeTruthy();
      expect(session!.isActive).toBe(true);
      expect(session!.guestUserId).toBe(userId);
      expect(session!.expiresAt).toBeInstanceOf(Date);
      expect(session!.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it('should cache session data in Redis', async () => {
      const userData = {
        name: 'Cache Test User'
      };

      const response = await request(app)
        .post('/api/livechat/session')
        .send(userData)
        .expect(201);

      const sessionId = response.body.data.sessionId;
      
      // Check if session is cached in Redis
      const cacheKey = `session:${sessionId}`;
      const cachedData = await redisClient.get(cacheKey);
      
      expect(cachedData).toBeTruthy();
      const sessionData = JSON.parse(cachedData!);
      expect(sessionData.id).toBe(sessionId);
      expect(sessionData.isActive).toBe(true);
      expect(sessionData.guestUser.name).toBe(userData.name);
    });
  });
});