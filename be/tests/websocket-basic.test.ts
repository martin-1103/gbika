// WebSocket Basic Connection Test - Minimal
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
  console.log('JWT Secret used:', jwtSecret);
  console.log('Token (first 50 chars):', token.substring(0, 50));
  
  return { session: mockSession, guestUser: mockGuestUser, token };
}

describe('WebSocket Basic Tests', () => {
  
  it('should create server and initialize WebSocket service', () => {
    console.log('=== Testing server initialization ===');
    expect(server).toBeDefined();
    expect(wsUrl).toBeDefined();
    expect(wsUrl).toContain('ws://localhost:');
    console.log('Server initialization test passed');
  });
  
  it('should generate valid JWT token', () => {
    console.log('=== Testing JWT token generation ===');
    const { token, session } = createTestSession();
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
    
    // Verify token can be decoded
    const decoded = jwt.decode(token) as any;
    expect(decoded).toBeDefined();
    expect(decoded.sessionId).toBe(session.id);
    
    console.log('JWT token generation test passed');
  });
  
  it('should attempt WebSocket connection (without waiting for messages)', async () => {
    console.log('=== Testing basic WebSocket connection ===');
    const { token } = createTestSession();
    
    const encodedToken = encodeURIComponent(token);
    const connectionUrl = `${wsUrl}?token=${encodedToken}`;
    console.log('Connection URL:', connectionUrl);
    
    const ws = new WebSocket(connectionUrl);
    
    // Test that WebSocket object is created
    expect(ws).toBeDefined();
    expect(ws.url).toBe(connectionUrl);
    
    // Wait a bit and check connection state
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('WebSocket readyState:', ws.readyState);
    console.log('WebSocket states: CONNECTING=0, OPEN=1, CLOSING=2, CLOSED=3');
    
    // Clean up
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
    
    console.log('Basic WebSocket connection test completed');
  }, 15000);
  
  it('should test WebSocket connection with event listeners', async () => {
    console.log('=== Testing WebSocket connection with events ===');
    const { token } = createTestSession();
    
    const encodedToken = encodeURIComponent(token);
    const connectionUrl = `${wsUrl}?token=${encodedToken}`;
    console.log('Connection URL:', connectionUrl);
    
    let connectionOpened = false;
    let connectionError = null;
    let connectionClosed = false;
    
    const ws = new WebSocket(connectionUrl);
    
    ws.on('open', () => {
      console.log('WebSocket connection opened!');
      connectionOpened = true;
    });
    
    ws.on('error', (error) => {
      console.log('WebSocket connection error:', error);
      connectionError = error;
    });
    
    ws.on('close', (code, reason) => {
      console.log('WebSocket connection closed:', code, reason.toString());
      connectionClosed = true;
    });
    
    ws.on('message', (data) => {
      console.log('WebSocket message received:', data.toString());
    });
    
    // Wait for connection events
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('Connection opened:', connectionOpened);
    console.log('Connection error:', connectionError);
    console.log('Connection closed:', connectionClosed);
    console.log('Final readyState:', ws.readyState);
    
    // Clean up
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
    
    console.log('WebSocket connection with events test completed');
  }, 15000);
});