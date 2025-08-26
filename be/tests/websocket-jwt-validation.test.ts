// WebSocket JWT Token Validation Tests: Isolated tests for JWT token validation scenarios
import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { app } from '../src/app';
const websocketService = require('../src/services/websocket.service');

describe('WebSocket JWT Token Validation', () => {
  let server: any;
  let wsUrl: string;
  const openConnections: WebSocket[] = [];

  beforeAll(async () => {
    server = createServer(app);
    websocketService.initializeServer(server);
    
    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        const port = server.address()?.port;
        wsUrl = `ws://localhost:${port}/livechat/ws`;
        console.log('JWT validation test server started on port:', port);
        resolve();
      });
    });
  });

  afterAll(async () => {
    try {
      // Close all connections
      for (const ws of openConnections) {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.terminate();
        }
      }
      openConnections.length = 0;
      
      // Close websocket service
      await websocketService.close();
      
      // Close server
      if (server) {
        await new Promise<void>((resolve) => {
          server.close(() => resolve());
          setTimeout(() => resolve(), 2000);
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error in JWT validation test cleanup:', error);
    }
  }, 15000);

  afterEach(async () => {
    // Close connections after each test
    for (const ws of openConnections) {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    }
    openConnections.length = 0;
    await new Promise(resolve => setTimeout(resolve, 300));
  });

  // Helper function to create valid JWT token
  function createValidToken(payload: any = {}) {
    const defaultPayload = {
      sessionId: 'mock-session-id-' + Date.now(),
      userId: 'test-user-' + Date.now(),
      ...payload
    };
    
    const jwtSecret = process.env.JWT_SECRET || 'test-secret';
    return jwt.sign(defaultPayload, jwtSecret, { expiresIn: '24h' });
  }

  // Helper function to create expired JWT token
  function createExpiredToken(payload: any = {}) {
    const defaultPayload = {
      sessionId: 'mock-session-id-' + Date.now(),
      userId: 'test-user-' + Date.now(),
      ...payload
    };
    
    const jwtSecret = process.env.JWT_SECRET || 'test-secret';
    return jwt.sign(defaultPayload, jwtSecret, { expiresIn: '-1h' });
  }

  // Helper function to attempt WebSocket connection
  function attemptConnection(token?: string): Promise<{ success: boolean; error?: any }> {
    return new Promise((resolve) => {
      const url = token ? `${wsUrl}?token=${encodeURIComponent(token)}` : wsUrl;
      console.log('Attempting connection to:', url.substring(0, 100) + '...');
      const ws = new WebSocket(url);
      let resolved = false;
      
      const timeout = setTimeout(() => {
        if (!resolved) {
          console.log('Connection timeout for token:', token ? token.substring(0, 20) + '...' : 'none');
          resolved = true;
          ws.terminate();
          resolve({ success: false, error: new Error('Connection timeout') });
        }
      }, 8000); // Increased timeout
      
      ws.on('open', () => {
        console.log('Connection opened successfully, waiting for connection:success message');
        openConnections.push(ws);
      });
      
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          console.log('Received message:', message);
          if (message.event === 'connection:success' && !resolved) {
            console.log('Received connection:success, resolving as successful');
            resolved = true;
            clearTimeout(timeout);
            resolve({ success: true });
          }
        } catch (error) {
          console.log('Failed to parse message:', data.toString());
        }
      });
      
      ws.on('error', (error) => {
        console.log('Connection error:', error.message);
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          resolve({ success: false, error });
        }
      });
      
      ws.on('close', (code, reason) => {
        console.log('Connection closed with code:', code, 'reason:', reason.toString());
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          if (code === 1002 || code === 1003 || code === 1007 || code === 1008 || code === 1011) {
            // These codes indicate rejection by server
            resolve({ success: false, error: new Error(`Connection rejected with code ${code}: ${reason}`) });
          } else {
            resolve({ success: false, error: new Error(`Connection closed with code ${code}: ${reason}`) });
          }
        }
      });
    });
  }

  describe('Valid Token Scenarios', () => {
    it('should accept connection with valid JWT token', async () => {
      const token = createValidToken();
      const result = await attemptConnection(token);
      
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept token with custom payload', async () => {
      const token = createValidToken({
        sessionId: 'mock-session-id-custom-123',
        userId: 'custom-user-456',
        role: 'guest'
      });
      
      const result = await attemptConnection(token);
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid Token Scenarios', () => {
    it('should reject connection with malformed token', async () => {
      const result = await attemptConnection('invalid-malformed-token');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject connection with expired token', async () => {
      const expiredToken = createExpiredToken();
      const result = await attemptConnection(expiredToken);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject connection with token signed with wrong secret', async () => {
      const wrongToken = jwt.sign(
        { sessionId: 'test-session', userId: 'test-user' },
        'wrong-secret',
        { expiresIn: '24h' }
      );
      
      const result = await attemptConnection(wrongToken);
      expect(result.success).toBe(false);
    });

    it('should reject connection without token', async () => {
      const result = await attemptConnection();
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject connection with empty token', async () => {
      const result = await attemptConnection('');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Token Structure Validation', () => {
    it('should accept token missing sessionId (handled by mock logic)', async () => {
      const tokenWithoutSessionId = jwt.sign(
        { userId: 'test-user' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '24h' }
      );
      
      // Note: Current implementation doesn't strictly validate token structure
      // It relies on mock session logic for testing
      const result = await attemptConnection(tokenWithoutSessionId);
      expect(result.success).toBe(true);
    });

    it('should accept token missing userId (handled by mock logic)', async () => {
      const tokenWithoutUserId = jwt.sign(
        { sessionId: 'mock-session-id-' + Date.now() },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '24h' }
      );
      
      // Note: Current implementation doesn't strictly validate token structure
      const result = await attemptConnection(tokenWithoutUserId);
      expect(result.success).toBe(true);
    });
  });
});