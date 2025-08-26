import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { app } from '../src/app';
const websocketService = require('../src/services/websocket.service');

describe('WebSocket Multiple Connections', () => {
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
      console.error('Error in multiple connections test setup:', error);
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
      console.error('Error in multiple connections test cleanup:', error);
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

  // Helper function to establish WebSocket connection
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

  describe('Concurrent Connections', () => {
    it('should handle multiple simultaneous connections', async () => {
      const connectionPromises = [];
      const numConnections = 5;
      
      // Create multiple connections simultaneously
      for (let i = 0; i < numConnections; i++) {
        const token = createValidToken(`user-${i}`, `mock-session-id-${i}-${Date.now()}`);
        connectionPromises.push(establishConnection(token));
      }
      
      // Wait for all connections to be established
      const connections = await Promise.all(connectionPromises);
      
      expect(connections).toHaveLength(numConnections);
      connections.forEach(ws => {
        expect(ws.readyState).toBe(WebSocket.OPEN);
      });
    }, 15000);

    it('should handle sequential connections', async () => {
      const connections: WebSocket[] = [];
      const numConnections = 3;
      
      // Create connections one by one
      for (let i = 0; i < numConnections; i++) {
        const token = createValidToken(`user-${i}`, `mock-session-id-${i}-${Date.now()}`);
        const ws = await establishConnection(token);
        connections.push(ws);
        
        expect(ws.readyState).toBe(WebSocket.OPEN);
      }
      
      expect(connections).toHaveLength(numConnections);
    }, 15000);

    it('should handle connection and disconnection cycles', async () => {
      const numCycles = 3;
      
      for (let i = 0; i < numCycles; i++) {
        // Establish connection
        const token = createValidToken(`user-${i}`, `mock-session-id-${i}-${Date.now()}`);
        const ws = await establishConnection(token);
        
        expect(ws.readyState).toBe(WebSocket.OPEN);
        
        // Close connection
        ws.close();
        
        // Wait for connection to close
        await new Promise(resolve => {
          ws.on('close', resolve);
        });
        
        expect(ws.readyState).toBe(WebSocket.CLOSED);
      }
    }, 15000);
  });

  describe('Message Broadcasting', () => {
    it('should handle messages from multiple connections independently', async () => {
      const numConnections = 3;
      const connections: WebSocket[] = [];
      
      // Establish multiple connections
      for (let i = 0; i < numConnections; i++) {
        const token = createValidToken(`user-${i}`, `mock-session-id-${i}-${Date.now()}`);
        const ws = await establishConnection(token);
        connections.push(ws);
      }
      
      // Send messages from each connection
      const messagePromises = connections.map((ws, index) => {
        const messagePromise = waitForMessage(ws, 'message:ack');
        
        ws.send(JSON.stringify({
          event: 'message:send',
          payload: {
            text: `Message from user ${index}`
          }
        }));
        
        return messagePromise;
      });
      
      // Wait for all acknowledgments
      const ackMessages = await Promise.all(messagePromises);
      
      expect(ackMessages).toHaveLength(numConnections);
      ackMessages.forEach(ack => {
        expect(ack.event).toBe('message:ack');
        expect(ack.payload.messageId).toBeDefined();
        expect(ack.payload.timestamp).toBeDefined();
      });
    }, 15000);

    it('should handle typing events from multiple users', async () => {
      const numConnections = 3;
      const connections: WebSocket[] = [];
      
      // Establish multiple connections
      for (let i = 0; i < numConnections; i++) {
        const token = createValidToken(`user-${i}`, `mock-session-id-${i}-${Date.now()}`);
        const ws = await establishConnection(token);
        connections.push(ws);
      }
      
      // Send typing events from each connection
      connections.forEach((ws, index) => {
        ws.send(JSON.stringify({
          event: 'user:typing',
          payload: {
            isTyping: true
          }
        }));
      });
      
      // Wait a bit to ensure no errors are thrown
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // All connections should still be open
      connections.forEach(ws => {
        expect(ws.readyState).toBe(WebSocket.OPEN);
      });
    }, 10000);
  });

  describe('Connection Limits and Cleanup', () => {
    it('should handle rapid connection attempts', async () => {
      const connectionPromises = [];
      const numConnections = 10;
      
      // Create many connections rapidly
      for (let i = 0; i < numConnections; i++) {
        const token = createValidToken(`rapid-user-${i}`, `mock-session-id-rapid-${i}-${Date.now()}`);
        connectionPromises.push(
          establishConnection(token).catch(error => {
            // Some connections might fail due to rapid creation
            console.log(`Connection ${i} failed:`, error.message);
            return null;
          })
        );
      }
      
      const results = await Promise.all(connectionPromises);
      const successfulConnections = results.filter(ws => ws !== null);
      
      // At least some connections should succeed
      expect(successfulConnections.length).toBeGreaterThan(0);
      
      successfulConnections.forEach(ws => {
        if (ws) {
          expect(ws.readyState).toBe(WebSocket.OPEN);
        }
      });
    }, 20000);

    it('should properly clean up closed connections', async () => {
      const numConnections = 3;
      const connections: WebSocket[] = [];
      
      // Establish connections
      for (let i = 0; i < numConnections; i++) {
        const token = createValidToken(`cleanup-user-${i}`, `mock-session-id-cleanup-${i}-${Date.now()}`);
        const ws = await establishConnection(token);
        connections.push(ws);
      }
      
      // Close half of the connections
      const connectionsToClose = connections.slice(0, Math.floor(numConnections / 2));
      const remainingConnections = connections.slice(Math.floor(numConnections / 2));
      
      // Close connections
      connectionsToClose.forEach(ws => ws.close());
      
      // Wait for connections to close
      await Promise.all(
        connectionsToClose.map(ws => 
          new Promise(resolve => ws.on('close', resolve))
        )
      );
      
      // Remaining connections should still work
      const messagePromises = remainingConnections.map(ws => {
        const messagePromise = waitForMessage(ws, 'message:ack');
        
        ws.send(JSON.stringify({
          event: 'message:send',
          payload: {
            text: 'Test message after cleanup'
          }
        }));
        
        return messagePromise;
      });
      
      const ackMessages = await Promise.all(messagePromises);
      
      expect(ackMessages).toHaveLength(remainingConnections.length);
      ackMessages.forEach(ack => {
        expect(ack.event).toBe('message:ack');
      });
    }, 15000);
  });
});