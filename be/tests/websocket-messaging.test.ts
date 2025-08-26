// WebSocket Messaging Tests - Isolated
import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { app } from '../src/app';
const websocketService = require('../src/services/websocket.service');

const prisma = new PrismaClient();
let server: any;
let wsUrl: string;
let openConnections: WebSocket[] = [];

beforeAll(async () => {
  // Create test server
  server = createServer(app);
  websocketService.initializeServer(server);
  
  await new Promise<void>((resolve) => {
    server.listen(0, () => {
      const port = server.address()?.port;
      wsUrl = `ws://localhost:${port}/livechat/ws`;
      console.log('Test server started on port:', port);
      resolve();
    });
  });
});

afterAll(async () => {
  try {
    // Force close any remaining connections
    for (const ws of openConnections) {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.terminate();
      }
    }
    openConnections = [];
    
    // Close websocket service first
    await websocketService.close();
    
    // Close the server
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => {
          resolve();
        });
        setTimeout(() => resolve(), 2000);
      });
      server = null;
    }
    
    // Disconnect from database
    await prisma.$disconnect();
    
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.error('Error in afterAll cleanup:', error);
  }
}, 15000);

afterEach(async () => {
  // Close all open connections after each test
  for (const ws of openConnections) {
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
  }
  openConnections = [];
  await new Promise(resolve => setTimeout(resolve, 500));
});

// Helper function to create a test session (mocked for testing)
async function createTestSession(name: string = 'Test User') {
  const mockGuestUser = {
    id: 'mock-user-id-' + Date.now(),
    name,
    city: 'Test City',
    country: 'Test Country',
  };

  const mockSession = {
    id: 'mock-session-id-' + Date.now(),
    guestUserId: mockGuestUser.id,
    isActive: true,
  };

  const jwtSecret = process.env.JWT_SECRET || 'test-secret';
  const token = jwt.sign(
    { sessionId: mockSession.id, userId: mockGuestUser.id },
    jwtSecret,
    { expiresIn: '24h' }
  );
  
  console.log('Generated token for session:', mockSession.id);
  return { session: mockSession, guestUser: mockGuestUser, token };
}

// Helper function to create WebSocket connection
function createWebSocketConnection(token: string): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const encodedToken = encodeURIComponent(token);
    const ws = new WebSocket(`${wsUrl}?token=${encodedToken}`);
    console.log('Attempting WebSocket connection...');
    
    const timeout = setTimeout(() => {
      console.log('WebSocket connection timeout');
      ws.close();
      reject(new Error('WebSocket connection timeout'));
    }, 10000);
    
    ws.on('open', () => {
      console.log('WebSocket connection opened');
      clearTimeout(timeout);
      resolve(ws);
    });
    
    ws.on('error', (error) => {
      console.log('WebSocket connection error:', error);
      clearTimeout(timeout);
      reject(error);
    });
  });
}

// Helper function to wait for WebSocket message
function waitForMessage(ws: WebSocket, eventType?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      console.log(`Timeout waiting for event: ${eventType}`);
      reject(new Error('Message timeout'));
    }, 10000);

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log(`Received message:`, message);
        if (!eventType || message.event === eventType) {
          clearTimeout(timeout);
          resolve(message);
        }
      } catch (error) {
        console.log('Error parsing message:', error, 'Raw data:', data.toString());
        clearTimeout(timeout);
        reject(error);
      }
    });
  });
}

// Helper function to establish connection and wait for success
async function establishConnection(token: string): Promise<WebSocket> {
  const ws = await createWebSocketConnection(token);
  openConnections.push(ws);
  
  // Wait for connection success
  await waitForMessage(ws, 'connection:success');
  console.log('Connection established successfully');
  
  return ws;
}

describe('WebSocket Messaging Tests', () => {
  
  describe('Message Sending', () => {
    it('should send and acknowledge message', async () => {
      console.log('=== Starting message send test ===');
      const { token, session } = await createTestSession('Message Sender');
      
      const ws = await establishConnection(token);
      
      // Send message
      const messageText = 'Hello from test!';
      console.log('Sending message:', messageText);
      ws.send(JSON.stringify({
        event: 'message:send',
        payload: { text: messageText }
      }));
      
      // Wait for acknowledgment
      console.log('Waiting for message acknowledgment...');
      const ackMessage = await waitForMessage(ws, 'message:ack');
      
      expect(ackMessage.event).toBe('message:ack');
      expect(ackMessage.payload).toHaveProperty('messageId');
      expect(ackMessage.payload).toHaveProperty('timestamp');
      
      console.log('=== Message send test completed ===');
    }, 30000);

    it('should reject empty message', async () => {
      console.log('=== Starting empty message test ===');
      const { token } = await createTestSession();
      
      const ws = await establishConnection(token);
      
      // Send empty message
      console.log('Sending empty message...');
      ws.send(JSON.stringify({
        event: 'message:send',
        payload: { text: '' }
      }));
      
      // Wait for error
      console.log('Waiting for error response...');
      const errorMessage = await waitForMessage(ws, 'error:invalid_payload');
      
      expect(errorMessage.event).toBe('error:invalid_payload');
      expect(errorMessage.payload.message).toContain('Message text is required');
      
      console.log('=== Empty message test completed ===');
    }, 30000);

    it('should handle invalid JSON payload', async () => {
      console.log('=== Starting invalid JSON test ===');
      const { token } = await createTestSession();
      
      const ws = await establishConnection(token);
      
      // Send invalid JSON
      console.log('Sending invalid JSON...');
      ws.send('invalid json');
      
      // Wait for error
      console.log('Waiting for error response...');
      const errorMessage = await waitForMessage(ws, 'error:invalid_payload');
      
      expect(errorMessage.event).toBe('error:invalid_payload');
      expect(errorMessage.payload.message).toContain('Invalid message format');
      
      console.log('=== Invalid JSON test completed ===');
    }, 30000);

    it('should handle unknown event type', async () => {
      console.log('=== Starting unknown event test ===');
      const { token } = await createTestSession();
      
      const ws = await establishConnection(token);
      
      // Send unknown event
      console.log('Sending unknown event...');
      ws.send(JSON.stringify({
        event: 'unknown:event',
        payload: {}
      }));
      
      // Wait for error
      console.log('Waiting for error response...');
      const errorMessage = await waitForMessage(ws, 'error:invalid_event');
      
      expect(errorMessage.event).toBe('error:invalid_event');
      expect(errorMessage.payload.message).toContain('Unknown event type');
      
      console.log('=== Unknown event test completed ===');
    }, 30000);
  });
});