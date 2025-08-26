// WebSocket Connection Tests - Isolated
import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { app } from '../src/app';
const websocketService = require('../src/services/websocket.service');

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
    console.log('Attempting WebSocket connection to:', `${wsUrl}?token=${encodedToken.substring(0, 20)}...`);
    
    const timeout = setTimeout(() => {
      console.log('WebSocket connection timeout');
      ws.close();
      reject(new Error('WebSocket connection timeout'));
    }, 10000); // Increased timeout
    
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
    }, 10000); // Increased timeout

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

describe('WebSocket Connection Tests', () => {
  
  describe('Basic Connection', () => {
    it('should establish connection with valid token', async () => {
      console.log('=== Starting connection test ===');
      const { token } = await createTestSession();
      
      console.log('Creating WebSocket connection with message listener...');
      const encodedToken = encodeURIComponent(token);
      const ws = new WebSocket(`${wsUrl}?token=${encodedToken}`);
      openConnections.push(ws);
      
      // Setup message listener BEFORE connection opens
      const messagePromise = waitForMessage(ws, 'connection:success');
      
      // Wait for connection to open
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('WebSocket connection timeout'));
        }, 10000);
        
        ws.on('open', () => {
          console.log('WebSocket connection opened');
          clearTimeout(timeout);
          resolve();
        });
        
        ws.on('error', (error) => {
          console.log('WebSocket connection error:', error);
          clearTimeout(timeout);
          reject(error);
        });
      });
      
      console.log('Waiting for connection success event...');
      // Wait for connection success event
      const message = await messagePromise;
      
      expect(message.event).toBe('connection:success');
      expect(message.payload).toHaveProperty('sessionId');
      expect(message.payload).toHaveProperty('user');
      expect(message.payload.user).toHaveProperty('name', 'Test User');
      
      console.log('=== Connection test completed successfully ===');
    }, 30000); // 30 second timeout

    it('should reject connection with invalid token', async () => {
      console.log('=== Starting invalid token test ===');
      const invalidToken = 'invalid-token';
      
      await expect(createWebSocketConnection(invalidToken))
        .rejects.toThrow();
      
      console.log('=== Invalid token test completed ===');
    }, 15000);

    it('should reject connection with expired token', async () => {
      console.log('=== Starting expired token test ===');
      const { session, guestUser } = await createTestSession();
      
      // Create expired token
      const expiredToken = jwt.sign(
        { sessionId: session.id, userId: guestUser.id },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '-1h' } // Expired 1 hour ago
      );
      
      await expect(createWebSocketConnection(expiredToken))
        .rejects.toThrow();
      
      console.log('=== Expired token test completed ===');
    }, 15000);

    it('should reject connection without token', async () => {
      console.log('=== Starting no token test ===');
      await expect(
        new Promise((resolve, reject) => {
          const ws = new WebSocket(wsUrl); // No token
          ws.on('open', resolve);
          ws.on('error', reject);
          setTimeout(() => reject(new Error('Connection should have been rejected')), 5000);
        })
      ).rejects.toThrow();
      
      console.log('=== No token test completed ===');
    }, 15000);
  });
});