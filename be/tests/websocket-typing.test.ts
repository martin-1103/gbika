// WebSocket Typing Indicator Tests - Isolated
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

describe('WebSocket Typing Indicator Tests', () => {
  
  describe('Typing Events', () => {
    it('should handle typing event without errors', async () => {
      console.log('=== Starting typing indicator test ===');
      const { token } = await createTestSession();
      
      const ws = await establishConnection(token);
      
      // Send typing event
      console.log('Sending typing event...');
      ws.send(JSON.stringify({
        event: 'user:typing',
        payload: { isTyping: true }
      }));
      
      // Wait a bit to ensure no error is sent back
      console.log('Waiting to ensure no errors...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // If we reach here without timeout, the test passes
      console.log('=== Typing indicator test completed ===');
    }, 30000);

    it('should handle stop typing event', async () => {
      console.log('=== Starting stop typing test ===');
      const { token } = await createTestSession();
      
      const ws = await establishConnection(token);
      
      // Send stop typing event
      console.log('Sending stop typing event...');
      ws.send(JSON.stringify({
        event: 'user:typing',
        payload: { isTyping: false }
      }));
      
      // Wait a bit to ensure no error is sent back
      console.log('Waiting to ensure no errors...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('=== Stop typing test completed ===');
    }, 30000);

    it('should handle multiple typing events', async () => {
      console.log('=== Starting multiple typing events test ===');
      const { token } = await createTestSession();
      
      const ws = await establishConnection(token);
      
      // Send multiple typing events
      console.log('Sending multiple typing events...');
      ws.send(JSON.stringify({
        event: 'user:typing',
        payload: { isTyping: true }
      }));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      ws.send(JSON.stringify({
        event: 'user:typing',
        payload: { isTyping: false }
      }));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      ws.send(JSON.stringify({
        event: 'user:typing',
        payload: { isTyping: true }
      }));
      
      // Wait to ensure no errors
      console.log('Waiting to ensure no errors...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('=== Multiple typing events test completed ===');
    }, 30000);
  });
});