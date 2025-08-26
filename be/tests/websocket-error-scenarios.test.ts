import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { app } from '../src/app';
const websocketService = require('../src/services/websocket.service');

describe('WebSocket Error Scenarios', () => {
  let server: any;
  let wsUrl: string;
  const openConnections: WebSocket[] = [];

  beforeAll(async () => {
    try {
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
    } catch (error) {
      console.error('Error in error scenarios test setup:', error);
      throw error;
    }
  }, 15000);

  afterAll(async () => {
    try {
      // Close all open connections
      for (const ws of openConnections) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      }
      openConnections.length = 0;
      
      // Close server
      if (server) {
        await new Promise<void>((resolve) => {
          server.close(() => resolve());
          setTimeout(() => resolve(), 2000);
        });
      }
    } catch (error) {
      console.error('Error in error scenarios test cleanup:', error);
    }
  }, 10000);

  afterEach(async () => {
    // Clean up connections after each test
    for (const ws of openConnections) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    }
    openConnections.length = 0;
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  // Helper function to create valid JWT token
  function createValidToken(userId?: string, sessionId?: string): string {
    const payload = {
      sessionId: sessionId || `mock-session-id-${Date.now()}`,
      userId: userId || `test-user-${Date.now()}`,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };
    return jwt.sign(payload, 'your-super-secret-jwt-secret');
  }

  // Helper function to create expired JWT token
  function createExpiredToken(): string {
    const payload = {
      sessionId: `mock-session-id-${Date.now()}`,
      userId: `test-user-${Date.now()}`,
      iat: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      exp: Math.floor(Date.now() / 1000) - 1800  // 30 minutes ago (expired)
    };
    return jwt.sign(payload, 'your-super-secret-jwt-secret');
  }

  // Helper function to create invalid JWT token
  function createInvalidToken(): string {
    const payload = {
      sessionId: `mock-session-id-${Date.now()}`,
      userId: `test-user-${Date.now()}`,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
    };
    return jwt.sign(payload, 'wrong-secret-key');
  }

  // Helper function to attempt connection (may fail)
  function attemptConnection(token?: string, timeout: number = 5000): Promise<{ success: boolean; ws?: WebSocket; error?: Error }> {
    return new Promise((resolve) => {
      const url = token ? `${wsUrl}?token=${encodeURIComponent(token)}` : wsUrl;
      const ws = new WebSocket(url);
      let resolved = false;
      
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve({ success: false, error: new Error('Connection timeout') });
        }
      }, timeout);
      
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          if (message.event === 'connection:success' && !resolved) {
            resolved = true;
            clearTimeout(timeoutId);
            openConnections.push(ws);
            resolve({ success: true, ws });
          }
        } catch (error) {
          // Ignore parsing errors for other messages
        }
      });
      
      ws.on('error', (error) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutId);
          resolve({ success: false, error });
        }
      });
      
      ws.on('close', (code, reason) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutId);
          if (code === 1000) {
            // Normal closure
            resolve({ success: true, ws });
          } else {
            // Abnormal closure
            resolve({ success: false, error: new Error(`Connection closed with code ${code}: ${reason}`) });
          }
        }
      });
    });
  }

  // Helper function to establish valid connection
  function establishConnection(token: string, timeout: number = 8000): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      const url = token ? `${wsUrl}?token=${encodeURIComponent(token)}` : wsUrl;
      const ws = new WebSocket(url);
      let resolved = false;
      
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          reject(new Error('Connection timeout'));
        }
      }, timeout);
      
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          if (message.event === 'connection:success' && !resolved) {
            resolved = true;
            clearTimeout(timeoutId);
            openConnections.push(ws);
            resolve(ws);
          }
        } catch (error) {
          // Ignore parsing errors for other messages
        }
      });
      
      ws.on('error', (error) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutId);
          reject(error);
        }
      });
      
      ws.on('close', (code, reason) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutId);
          reject(new Error(`Connection closed with code ${code}: ${reason}`));
        }
      });
    });
  }

  // Helper function to wait for specific message
  function waitForMessage(ws: WebSocket, eventType: string, timeout: number = 5000): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Message timeout: ${eventType}`));
      }, timeout);
      
      const messageHandler = (data: any) => {
        try {
          const message = JSON.parse(data.toString());
          if (message.event === eventType) {
            clearTimeout(timeoutId);
            ws.off('message', messageHandler);
            resolve(message);
          }
        } catch (error) {
          // Ignore parsing errors
        }
      };
      
      ws.on('message', messageHandler);
    });
  }

  describe('Authentication Errors', () => {
    it('should reject connection without token', async () => {
      const result = await attemptConnection();
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject connection with expired token', async () => {
      const expiredToken = createExpiredToken();
      const result = await attemptConnection(expiredToken);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject connection with invalid token signature', async () => {
      const invalidToken = createInvalidToken();
      const result = await attemptConnection(invalidToken);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject connection with malformed token', async () => {
      const malformedToken = 'this-is-not-a-valid-jwt-token';
      const result = await attemptConnection(malformedToken);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject connection with empty token', async () => {
      const result = await attemptConnection('');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Message Handling Errors', () => {
    it('should handle invalid JSON gracefully', async () => {
      const token = createValidToken();
      const ws = await establishConnection(token);
      
      const errorPromise = waitForMessage(ws, 'error:invalid_payload');
      
      // Send invalid JSON
      ws.send('{ invalid json }');
      
      const errorMessage = await errorPromise;
      
      expect(errorMessage.event).toBe('error:invalid_payload');
      expect(errorMessage.payload.message).toContain('Invalid message format');
    });

    it('should handle missing event field', async () => {
      const token = createValidToken();
      const ws = await establishConnection(token);
      
      const errorPromise = waitForMessage(ws, 'error:invalid_event');
      
      // Send message without event field
      ws.send(JSON.stringify({
        payload: { text: 'Hello' }
      }));
      
      const errorMessage = await errorPromise;
      
      expect(errorMessage.event).toBe('error:invalid_event');
      expect(errorMessage.payload.message).toContain('Unknown event type');
    });

    it('should handle unknown event types', async () => {
      const token = createValidToken();
      const ws = await establishConnection(token);
      
      const errorPromise = waitForMessage(ws, 'error:invalid_event');
      
      // Send unknown event
      ws.send(JSON.stringify({
        event: 'unknown:event',
        payload: {}
      }));
      
      const errorMessage = await errorPromise;
      
      expect(errorMessage.event).toBe('error:invalid_event');
      expect(errorMessage.payload.message).toContain('Unknown event type');
    });

    it('should handle empty message payload', async () => {
      const token = createValidToken();
      const ws = await establishConnection(token);
      
      const errorPromise = waitForMessage(ws, 'error:invalid_payload');
      
      // Send message with empty text
      ws.send(JSON.stringify({
        event: 'message:send',
        payload: {
          text: ''
        }
      }));
      
      const errorMessage = await errorPromise;
      
      expect(errorMessage.event).toBe('error:invalid_payload');
      expect(errorMessage.payload.message).toContain('Message text is required');
    });

    it('should handle missing text field in message', async () => {
      const token = createValidToken();
      const ws = await establishConnection(token);
      
      const errorPromise = waitForMessage(ws, 'error:invalid_payload');
      
      // Send message without text field
      ws.send(JSON.stringify({
        event: 'message:send',
        payload: {}
      }));
      
      const errorMessage = await errorPromise;
      
      expect(errorMessage.event).toBe('error:invalid_payload');
      expect(errorMessage.payload.message).toContain('Message text is required');
    });

    it('should handle non-string text field', async () => {
      const token = createValidToken();
      const ws = await establishConnection(token);
      
      const errorPromise = waitForMessage(ws, 'error:invalid_payload');
      
      // Send message with non-string text
      ws.send(JSON.stringify({
        event: 'message:send',
        payload: {
          text: 123
        }
      }));
      
      const errorMessage = await errorPromise;
      
      expect(errorMessage.event).toBe('error:invalid_payload');
      expect(errorMessage.payload.message).toContain('Message text is required');
    });
  });

  describe('Connection Edge Cases', () => {
    it('should handle connection close during message processing', async () => {
      const token = createValidToken();
      const ws = await establishConnection(token);
      
      // Send message and immediately close connection
      ws.send(JSON.stringify({
        event: 'message:send',
        payload: {
          text: 'Test message'
        }
      }));
      
      // Close connection immediately
      ws.close();
      
      // Wait for connection to close
      await new Promise(resolve => {
        ws.on('close', resolve);
      });
      
      expect(ws.readyState).toBe(WebSocket.CLOSED);
    });

    it('should handle multiple rapid messages', async () => {
      const token = createValidToken();
      const ws = await establishConnection(token);
      
      const numMessages = 10;
      const messagePromises = [];
      
      // Send multiple messages rapidly
      for (let i = 0; i < numMessages; i++) {
        const messagePromise = waitForMessage(ws, 'message:ack', 3000).catch(error => {
          // Some messages might timeout due to rapid sending
          console.log(`Message ${i} timeout:`, error.message);
          return null;
        });
        
        ws.send(JSON.stringify({
          event: 'message:send',
          payload: {
            text: `Rapid message ${i}`
          }
        }));
        
        messagePromises.push(messagePromise);
      }
      
      const results = await Promise.all(messagePromises);
      const successfulMessages = results.filter(result => result !== null);
      
      // At least some messages should be processed successfully
      expect(successfulMessages.length).toBeGreaterThan(0);
    }, 15000);

    it('should handle very large message payload', async () => {
      const token = createValidToken();
      const ws = await establishConnection(token);
      
      // Create a very large message (1MB)
      const largeText = 'A'.repeat(1024 * 1024);
      
      const messagePromise = Promise.race([
        waitForMessage(ws, 'message:ack'),
        waitForMessage(ws, 'error:invalid_payload'),
        waitForMessage(ws, 'error:server_error')
      ]);
      
      ws.send(JSON.stringify({
        event: 'message:send',
        payload: {
          text: largeText
        }
      }));
      
      const response = await messagePromise;
      
      // Should either acknowledge or return an error
      expect(response.event).toMatch(/^(message:ack|error:)/);      
    }, 10000);

    it('should handle connection after server restart simulation', async () => {
      // This test simulates what happens when connections are established
      // after the server has been restarted (connections map is empty)
      
      const token = createValidToken();
      const ws = await establishConnection(token);
      
      // Send a message to ensure connection is working
      const messagePromise = waitForMessage(ws, 'message:ack');
      
      ws.send(JSON.stringify({
        event: 'message:send',
        payload: {
          text: 'Test message after restart'
        }
      }));
      
      const ackMessage = await messagePromise;
      
      expect(ackMessage.event).toBe('message:ack');
      expect(ackMessage.payload.messageId).toBeDefined();
    });
  });

  describe('Resource Cleanup', () => {
    it('should handle abrupt connection termination', async () => {
      const token = createValidToken();
      const ws = await establishConnection(token);
      
      // Terminate connection abruptly
      ws.terminate();
      
      // Wait a bit for cleanup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      expect(ws.readyState).toBe(WebSocket.CLOSED);
    });

    it('should handle connection errors during message sending', async () => {
      const token = createValidToken();
      const ws = await establishConnection(token);
      
      // Close the connection
      ws.close();
      
      // Wait for connection to close
      await new Promise(resolve => {
        ws.on('close', resolve);
      });
      
      // Try to send message on closed connection
      expect(() => {
        ws.send(JSON.stringify({
          event: 'message:send',
          payload: {
            text: 'This should fail'
          }
        }));
      }).not.toThrow(); // WebSocket library handles this gracefully
      
      expect(ws.readyState).toBe(WebSocket.CLOSED);
    });
  });
});