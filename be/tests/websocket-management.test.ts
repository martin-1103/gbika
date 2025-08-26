// WebSocket Connection Management Tests - Isolated
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
  await new Promise(resolve => setTimeout(resolve, 1000));
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

describe('WebSocket Connection Management Tests', () => {
  
  describe('Multiple Connections', () => {
    it('should handle multiple connections from same session', async () => {
      console.log('=== Starting multiple connections test ===');
      const { token } = await createTestSession();
      
      console.log('Creating first connection...');
      const ws1 = await establishConnection(token);
      
      console.log('Creating second connection...');
      const ws2 = await establishConnection(token);
      
      // Both connections should be active
      const stats = websocketService.getStats();
      console.log('Current stats:', stats);
      expect(stats.activeConnections).toBeGreaterThanOrEqual(2);
      
      console.log('=== Multiple connections test completed ===');
    }, 30000);

    it('should handle connections from different sessions', async () => {
      console.log('=== Starting different sessions test ===');
      const { token: token1 } = await createTestSession('User 1');
      const { token: token2 } = await createTestSession('User 2');
      
      console.log('Creating connection for user 1...');
      const ws1 = await establishConnection(token1);
      
      console.log('Creating connection for user 2...');
      const ws2 = await establishConnection(token2);
      
      // Both connections should be active
      const stats = websocketService.getStats();
      console.log('Current stats:', stats);
      expect(stats.activeConnections).toBeGreaterThanOrEqual(2);
      
      console.log('=== Different sessions test completed ===');
    }, 30000);
  });

  describe('Connection Cleanup', () => {
    it('should clean up connection on close', async () => {
      console.log('=== Starting connection cleanup test ===');
      const { token } = await createTestSession();
      
      const ws = await establishConnection(token);
      
      const initialConnections = websocketService.getStats().activeConnections;
      console.log('Initial connections:', initialConnections);
      
      console.log('Closing connection...');
      ws.close();
      
      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const finalConnections = websocketService.getStats().activeConnections;
      console.log('Final connections:', finalConnections);
      expect(finalConnections).toBeLessThan(initialConnections);
      
      console.log('=== Connection cleanup test completed ===');
    }, 30000);

    it('should handle forced connection termination', async () => {
      console.log('=== Starting forced termination test ===');
      const { token } = await createTestSession();
      
      const ws = await establishConnection(token);
      
      const initialConnections = websocketService.getStats().activeConnections;
      console.log('Initial connections:', initialConnections);
      
      console.log('Terminating connection...');
      ws.terminate();
      
      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const finalConnections = websocketService.getStats().activeConnections;
      console.log('Final connections:', finalConnections);
      expect(finalConnections).toBeLessThan(initialConnections);
      
      console.log('=== Forced termination test completed ===');
    }, 30000);
  });

  describe('Connection Stats', () => {
    it('should provide accurate connection statistics', async () => {
      console.log('=== Starting connection stats test ===');
      
      const initialStats = websocketService.getStats();
      console.log('Initial stats:', initialStats);
      
      const { token } = await createTestSession();
      const ws = await establishConnection(token);
      
      const afterConnectionStats = websocketService.getStats();
      console.log('After connection stats:', afterConnectionStats);
      
      expect(afterConnectionStats.activeConnections).toBeGreaterThan(initialStats.activeConnections);
      expect(afterConnectionStats).toHaveProperty('activeConnections');
      
      console.log('=== Connection stats test completed ===');
    }, 30000);
  });
});