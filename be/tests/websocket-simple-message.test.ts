// WebSocket Simple Message Test - Testing connection:success message
import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { app } from '../src/app';
const websocketService = require('../src/services/websocket.service');

let server: any;
let wsUrl: string;

beforeAll(async () => {
  console.log('=== Setting up test server ===');
  // Create test server
  server = createServer(app);
  console.log('Server created');
  
  websocketService.initializeServer(server);
  console.log('WebSocket service initialized');
  
  await new Promise<void>((resolve) => {
    server.listen(0, () => {
      const port = server.address()?.port;
      wsUrl = `ws://localhost:${port}/livechat/ws`;
      console.log('Test server started on port:', port);
      console.log('WebSocket URL:', wsUrl);
      resolve();
    });
  });
});

afterAll(async () => {
  console.log('=== Cleaning up test server ===');
  try {
    // Close websocket service first
    await websocketService.close();
    console.log('WebSocket service closed');
    
    // Close the server
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => {
          console.log('Server closed');
          resolve();
        });
        setTimeout(() => {
          console.log('Server close timeout');
          resolve();
        }, 2000);
      });
      server = null;
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Cleanup completed');
  } catch (error) {
    console.error('Error in afterAll cleanup:', error);
  }
}, 15000);

// Helper function to create a test session (mocked for testing)
function createTestSession(name: string = 'Test User') {
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

// Helper function to wait for a specific message
function waitForMessage(ws: WebSocket, eventType: string, timeout: number = 5000): Promise<any> {
  return new Promise((resolve, reject) => {
    console.log(`Waiting for event: ${eventType}`);
    
    const timeoutId = setTimeout(() => {
      console.log(`Timeout waiting for event: ${eventType}`);
      reject(new Error(`Message timeout for event: ${eventType}`));
    }, timeout);

    const messageHandler = (data: any) => {
      try {
        const message = JSON.parse(data.toString());
        console.log('Received message:', message);
        
        if (message.event === eventType) {
          console.log(`Found expected event: ${eventType}`);
          clearTimeout(timeoutId);
          ws.off('message', messageHandler);
          resolve(message);
        }
      } catch (error) {
        console.log('Error parsing message:', error);
      }
    };

    ws.on('message', messageHandler);
  });
}

describe('WebSocket Simple Message Tests', () => {
  
  it('should receive connection:success message', async () => {
    console.log('=== Testing connection:success message ===');
    const { token } = createTestSession();
    
    const encodedToken = encodeURIComponent(token);
    const connectionUrl = `${wsUrl}?token=${encodedToken}`;
    console.log('Connection URL:', connectionUrl);
    
    const ws = new WebSocket(connectionUrl);
    
    // Setup message listener BEFORE connection opens
    const messagePromise = waitForMessage(ws, 'connection:success', 10000);
    
    // Wait for connection to open
    await new Promise<void>((resolve, reject) => {
      ws.on('open', () => {
        console.log('WebSocket connection opened!');
        resolve();
      });
      
      ws.on('error', (error) => {
        console.log('WebSocket connection error:', error);
        reject(error);
      });
      
      setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 5000);
    });
    
    // Wait for connection:success message
    const message = await messagePromise;
    
    expect(message).toBeDefined();
    expect(message.event).toBe('connection:success');
    expect(message.payload).toBeDefined();
    expect(message.payload.sessionId).toBeDefined();
    expect(message.payload.user).toBeDefined();
    
    console.log('connection:success message test passed!');
    
    // Clean up
    ws.close();
  }, 20000);
  
  it('should handle multiple connections', async () => {
    console.log('=== Testing multiple connections ===');
    
    const connections: WebSocket[] = [];
    
    try {
      // Create 3 connections
      for (let i = 0; i < 3; i++) {
        const { token } = createTestSession(`User ${i + 1}`);
        const encodedToken = encodeURIComponent(token);
        const connectionUrl = `${wsUrl}?token=${encodedToken}`;
        
        const ws = new WebSocket(connectionUrl);
        connections.push(ws);
        
        // Setup message listener BEFORE connection opens
        const messagePromise = waitForMessage(ws, 'connection:success', 10000);
        
        // Wait for connection to open
        await new Promise<void>((resolve, reject) => {
          ws.on('open', () => {
            console.log(`Connection ${i + 1} opened`);
            resolve();
          });
          
          ws.on('error', (error) => {
            console.log(`Connection ${i + 1} error:`, error);
            reject(error);
          });
          
          setTimeout(() => {
            reject(new Error(`Connection ${i + 1} timeout`));
          }, 5000);
        });
        
        // Wait for connection:success message
        const message = await messagePromise;
        expect(message.event).toBe('connection:success');
        
        console.log(`Connection ${i + 1} received connection:success`);
      }
      
      console.log('All connections established successfully!');
      
    } finally {
      // Clean up all connections
      connections.forEach((ws, index) => {
        if (ws.readyState === WebSocket.OPEN) {
          console.log(`Closing connection ${index + 1}`);
          ws.close();
        }
      });
    }
  }, 30000);
});