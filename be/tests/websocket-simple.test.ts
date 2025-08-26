// Simple WebSocket Test
import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { app } from '../src/app';
const websocketService = require('../src/services/websocket.service');

const prisma = new PrismaClient();

describe('WebSocket Basic Test', () => {
  let server: any;
  let wsUrl: string;
  
  beforeAll(async () => {
    server = createServer(app);
    websocketService.initializeServer(server);
    
    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        const port = server.address()?.port;
        wsUrl = `ws://localhost:${port}/livechat/ws`;
        resolve();
      });
    });
  }, 10000);
  
  afterAll(async () => {
    try {
      await websocketService.close();
      if (server) {
        await new Promise<void>((resolve) => {
          server.close(() => resolve());
        });
      }
      await prisma.$disconnect();
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }, 10000);
  
  it('should create a valid JWT token', async () => {
    // Create test session
    const guestUser = await prisma.guestUser.create({
      data: {
        name: 'Test User',
        city: 'Test City'
      }
    });
    
    const session = await prisma.session.create({
      data: {
        guestUserId: guestUser.id,
        isActive: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });
    
    const token = jwt.sign(
      {
        sessionId: session.id,
        userId: guestUser.id,
        name: guestUser.name
      },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '24h' }
    );
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    
    // Cleanup
    await prisma.session.delete({ where: { id: session.id } });
    await prisma.guestUser.delete({ where: { id: guestUser.id } });
  });
});