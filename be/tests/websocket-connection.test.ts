// WebSocket Connection Test with Real Database
import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { app } from '../src/app';
const websocketService = require('../src/services/websocket.service');

const prisma = new PrismaClient();

describe('WebSocket Connection Test', () => {
  let server: any;
  let wsUrl: string;
  let testGuestUser: any;
  let testSession: any;
  
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
    
    // Create test data
    testGuestUser = await prisma.guestUser.create({
      data: {
        name: 'Connection Test User',
        city: 'Test City',
        country: 'Test Country'
      }
    });
    
    testSession = await prisma.session.create({
      data: {
        guestUserId: testGuestUser.id,
        isActive: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });
  }, 15000);
  
  afterAll(async () => {
    try {
      // Cleanup test data
      if (testSession) {
        await prisma.session.delete({ where: { id: testSession.id } });
      }
      if (testGuestUser) {
        await prisma.guestUser.delete({ where: { id: testGuestUser.id } });
      }
      
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
  }, 15000);
  
  it('should establish WebSocket connection with real database session', async () => {
    const token = jwt.sign(
      {
        sessionId: testSession.id,
        userId: testGuestUser.id
      },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '24h' }
    );
    
    const ws = await new Promise<WebSocket>((resolve, reject) => {
      const encodedToken = encodeURIComponent(token);
      const websocket = new WebSocket(`${wsUrl}?token=${encodedToken}`);
      
      const timeout = setTimeout(() => {
        websocket.close();
        reject(new Error('WebSocket connection timeout'));
      }, 10000);
      
      websocket.on('open', () => {
        clearTimeout(timeout);
        resolve(websocket);
      });
      
      websocket.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
    
    // Wait for connection success message
    const message = await new Promise<any>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Message timeout'));
      }, 10000);
      
      ws.on('message', (data) => {
        try {
          const parsed = JSON.parse(data.toString());
          console.log('Received message:', parsed);
          if (parsed.event === 'connection:success') {
            clearTimeout(timeout);
            resolve(parsed);
          }
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      });
    });
    
    expect(message.event).toBe('connection:success');
    expect(message.payload).toHaveProperty('sessionId', testSession.id);
      expect(message.payload.user).toHaveProperty('name', 'Connection Test User');
    
    ws.close();
  }, 20000);
});