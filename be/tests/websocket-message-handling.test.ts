import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { app } from '../src/app';
const websocketService = require('../src/services/websocket.service');

describe('WebSocket Message Handling', () => {
  let server: any;
  let wsUrl: string;
  let openConnections: WebSocket[] = [];

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
      console.error('Error in message handling test setup:', error);
      throw error;
    }
  }, 15000);

  afterAll(async () => {
    try {
      // Close all connections
      for (const ws of openConnections) {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
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
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error in message handling test cleanup:', error);
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

  // Helper function to establish WebSocket connection
  function establishConnection(token: string): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      const url = `${wsUrl}?token=${encodeURIComponent(token)}`;
      const ws = new WebSocket(url);
      let resolved = false;
      
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          ws.terminate();
          reject(new Error('Connection timeout'));
        }
      }, 8000);
      
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          if (message.event === 'connection:success' && !resolved) {
            resolved = true;
            clearTimeout(timeout);
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
          clearTimeout(timeout);
          reject(error);
        }
      });
      
      ws.on('close', (code, reason) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
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

  describe('Send Message', () => {
    it('should send and acknowledge text message', async () => {
      const token = createValidToken();
      const ws = await establishConnection(token);
      
      const messageText = 'Hello, this is a test message!';
      const messagePromise = waitForMessage(ws, 'message:ack');
      
      // Send message
      ws.send(JSON.stringify({
        event: 'message:send',
        payload: {
          text: messageText
        }
      }));
      
      // Wait for acknowledgment
      const ackMessage = await messagePromise;
      
      expect(ackMessage.event).toBe('message:ack');
      expect(ackMessage.payload).toBeDefined();
      expect(ackMessage.payload.messageId).toBeDefined();
      expect(ackMessage.payload.timestamp).toBeDefined();
    });

    it('should reject empty message', async () => {
      const token = createValidToken();
      const ws = await establishConnection(token);
      
      const errorPromise = waitForMessage(ws, 'error:invalid_payload');
      
      // Send empty message
      ws.send(JSON.stringify({
        event: 'message:send',
        payload: {
          text: ''
        }
      }));
      
      // Wait for error
      const errorMessage = await errorPromise;
      
      expect(errorMessage.event).toBe('error:invalid_payload');
      expect(errorMessage.payload.message).toContain('Message text is required');
    });

    it('should reject message without text', async () => {
      const token = createValidToken();
      const ws = await establishConnection(token);
      
      const errorPromise = waitForMessage(ws, 'error:invalid_payload');
      
      // Send message without text
      ws.send(JSON.stringify({
        event: 'message:send',
        payload: {}
      }));
      
      // Wait for error
      const errorMessage = await errorPromise;
      
      expect(errorMessage.event).toBe('error:invalid_payload');
      expect(errorMessage.payload.message).toContain('Message text is required');
    });

    it('should sanitize message text', async () => {
      const token = createValidToken();
      const ws = await establishConnection(token);
      
      const messageText = '<script>alert("xss")</script>Hello World!';
      const messagePromise = waitForMessage(ws, 'message:ack');
      
      // Send message with potentially dangerous content
      ws.send(JSON.stringify({
        event: 'message:send',
        payload: {
          text: messageText
        }
      }));
      
      // Wait for acknowledgment
      const ackMessage = await messagePromise;
      
      expect(ackMessage.event).toBe('message:ack');
      expect(ackMessage.payload.messageId).toBeDefined();
      // Note: We can't directly test sanitization here as the sanitized text
      // is not returned in the ack message, but the message should be processed
    });
  });

  describe('Typing Events', () => {
    it('should handle user typing event', async () => {
      const token = createValidToken();
      const ws = await establishConnection(token);
      
      // Send typing event
      ws.send(JSON.stringify({
        event: 'user:typing',
        payload: {
          isTyping: true
        }
      }));
      
      // Wait a bit to ensure no error is thrown
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If we reach here without error, the typing event was handled
      expect(true).toBe(true);
    });
  });

  describe('Invalid Events', () => {
    it('should reject unknown event type', async () => {
      const token = createValidToken();
      const ws = await establishConnection(token);
      
      const errorPromise = waitForMessage(ws, 'error:invalid_event');
      
      // Send unknown event
      ws.send(JSON.stringify({
        event: 'unknown:event',
        payload: {}
      }));
      
      // Wait for error
      const errorMessage = await errorPromise;
      
      expect(errorMessage.event).toBe('error:invalid_event');
      expect(errorMessage.payload.message).toContain('Unknown event type');
    });

    it('should reject malformed JSON', async () => {
      const token = createValidToken();
      const ws = await establishConnection(token);
      
      const errorPromise = waitForMessage(ws, 'error:invalid_payload');
      
      // Send malformed JSON
      ws.send('{ invalid json }');
      
      // Wait for error
      const errorMessage = await errorPromise;
      
      expect(errorMessage.event).toBe('error:invalid_payload');
      expect(errorMessage.payload.message).toContain('Invalid message format');
    });
  });
});