"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// WebSocket Live Chat Tests
const ws_1 = __importDefault(require("ws"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const http_1 = require("http");
const app_1 = require("../src/app");
const websocketService = require('../src/services/websocket.service');
const prisma = new client_1.PrismaClient();
let server;
let wsUrl;
let openConnections = [];
beforeAll(async () => {
    // Create test server
    server = (0, http_1.createServer)(app_1.app);
    websocketService.initializeServer(server);
    await new Promise((resolve) => {
        server.listen(0, () => {
            const port = server.address()?.port;
            wsUrl = `ws://localhost:${port}/livechat/ws`;
            resolve();
        });
    });
});
afterAll(async () => {
    try {
        // Force close any remaining connections
        for (const ws of openConnections) {
            if (ws.readyState === ws_1.default.OPEN || ws.readyState === ws_1.default.CONNECTING) {
                ws.terminate();
            }
        }
        openConnections = [];
        // Close websocket service first
        await websocketService.close();
        // Force close server with aggressive cleanup
        if (server) {
            // Close idle connections first
            if (typeof server.closeIdleConnections === 'function') {
                server.closeIdleConnections();
            }
            // Force close all connections if available
            if (typeof server.closeAllConnections === 'function') {
                server.closeAllConnections();
            }
            // Close the server
            await new Promise((resolve) => {
                server.close(() => {
                    resolve();
                });
                // Force resolve after timeout
                setTimeout(() => {
                    resolve();
                }, 2000);
            });
            server = null;
        }
        // Disconnect from database
        await prisma.$disconnect();
        // Wait for final cleanup
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    catch (error) {
        console.error('Error in afterAll cleanup:', error);
    }
}, 15000);
// Helper function to create a test session (mocked for testing without DB)
async function createTestSession(name = 'Test User') {
    // Mock data for testing without database
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
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
    const token = jsonwebtoken_1.default.sign({ sessionId: mockSession.id, userId: mockGuestUser.id }, jwtSecret, { expiresIn: '24h' });
    console.log('Using JWT secret:', jwtSecret);
    console.log('Current time:', now.toISOString());
    console.log('Token expires at:', expiresAt.toISOString());
    // Decode the token to verify its contents
    const decoded = jsonwebtoken_1.default.decode(token);
    if (decoded && decoded.exp) {
        const tokenExpiresAt = new Date(decoded.exp * 1000);
        console.log('Actual token expiration:', tokenExpiresAt.toISOString());
    }
    console.log('Generated token:', token.substring(0, 50) + '...');
    console.log('Mock session ID:', mockSession.id);
    return { session: mockSession, guestUser: mockGuestUser, token };
}
// Helper function to create WebSocket connection
function createWebSocketConnection(token) {
    return new Promise((resolve, reject) => {
        const encodedToken = encodeURIComponent(token);
        const ws = new ws_1.default(`${wsUrl}?token=${encodedToken}`);
        console.log('Connecting with encoded token:', encodedToken.substring(0, 50) + '...');
        const timeout = setTimeout(() => {
            ws.close();
            reject(new Error('WebSocket connection timeout'));
        }, 5000);
        ws.on('open', () => {
            clearTimeout(timeout);
            resolve(ws);
        });
        ws.on('error', (error) => {
            clearTimeout(timeout);
            reject(error);
        });
    });
}
// Helper function to wait for WebSocket message
function waitForMessage(ws, eventType) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            console.log(`Timeout waiting for event: ${eventType}`);
            reject(new Error('Message timeout'));
        }, 5000);
        ws.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                console.log(`Received message:`, message);
                if (!eventType || message.event === eventType) {
                    clearTimeout(timeout);
                    resolve(message);
                }
            }
            catch (error) {
                console.log('Error parsing message:', error, 'Raw data:', data.toString());
                clearTimeout(timeout);
                reject(error);
            }
        });
    });
}
describe('WebSocket Live Chat', () => {
    // beforeEach(async () => {
    //   // Clean up database before each test
    //   await prisma.message.deleteMany({});
    //   await prisma.session.deleteMany({});
    //   await prisma.guestUser.deleteMany({});
    // });
    afterEach(async () => {
        // Close all open connections after each test
        for (const ws of openConnections) {
            if (ws.readyState === ws_1.default.OPEN || ws.readyState === ws_1.default.CONNECTING) {
                ws.close();
            }
        }
        openConnections = [];
        // Wait longer for cleanup to complete
        await new Promise(resolve => setTimeout(resolve, 500));
    });
    describe('Connection', () => {
        it('should establish connection with valid token', async () => {
            const { token } = await createTestSession();
            const ws = await createWebSocketConnection(token);
            openConnections.push(ws);
            // Wait for connection success event
            const message = await waitForMessage(ws, 'connection:success');
            expect(message.event).toBe('connection:success');
            expect(message.payload).toHaveProperty('sessionId');
      expect(message.payload).toHaveProperty('user');
      expect(message.payload.user).toHaveProperty('name', 'Test User');
        });
        it('should reject connection with invalid token', async () => {
            const invalidToken = 'invalid-token';
            await expect(createWebSocketConnection(invalidToken))
                .rejects.toThrow();
        });
        it('should reject connection with expired token', async () => {
            const { session, guestUser } = await createTestSession();
            // Create expired token
            const expiredToken = jsonwebtoken_1.default.sign({ sessionId: session.id, userId: guestUser.id }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '-1h' } // Expired 1 hour ago
            );
            await expect(createWebSocketConnection(expiredToken))
                .rejects.toThrow();
        });
        it('should reject connection without token', async () => {
            await expect(new Promise((resolve, reject) => {
                const ws = new ws_1.default(wsUrl); // No token
                ws.on('open', resolve);
                ws.on('error', reject);
                setTimeout(() => reject(new Error('Connection should have been rejected')), 2000);
            })).rejects.toThrow();
        });
    });
    describe('Message Sending', () => {
        it('should send and acknowledge message', async () => {
            const { token, session } = await createTestSession('Message Sender');
            const ws = await createWebSocketConnection(token);
            openConnections.push(ws);
            // Wait for connection success
            await waitForMessage(ws, 'connection:success');
            // Send message
            const messageText = 'Hello from test!';
            ws.send(JSON.stringify({
                event: 'message:send',
                payload: { text: messageText }
            }));
            // Wait for acknowledgment
            const ackMessage = await waitForMessage(ws, 'message:ack');
            expect(ackMessage.event).toBe('message:ack');
            expect(ackMessage.payload).toHaveProperty('messageId');
      expect(ackMessage.payload).toHaveProperty('timestamp');
            // Verify message was saved to database
            const savedMessage = await prisma.message.findFirst({
                where: {
                    sessionId: session.id,
                    text: messageText,
                    sender: 'user'
                }
            });
            expect(savedMessage).toBeTruthy();
            expect(savedMessage?.text).toBe(messageText);
        });
        it('should reject empty message', async () => {
            const { token } = await createTestSession();
            const ws = await createWebSocketConnection(token);
            openConnections.push(ws);
            await waitForMessage(ws, 'connection:success');
            // Send empty message
            ws.send(JSON.stringify({
                event: 'message:send',
                payload: { text: '' }
            }));
            // Wait for error
            const errorMessage = await waitForMessage(ws, 'error:invalid_payload');
            expect(errorMessage.event).toBe('error:invalid_payload');
            expect(errorMessage.payload.message).toContain('Message text is required');
        });
        it('should sanitize message text', async () => {
            const { token, session } = await createTestSession();
            const ws = await createWebSocketConnection(token);
            openConnections.push(ws);
            await waitForMessage(ws, 'connection:success');
            // Send message with HTML/script tags
            const maliciousText = '<script>alert("xss")</script>Hello';
            ws.send(JSON.stringify({
                event: 'message:send',
                payload: { text: maliciousText }
            }));
            // Wait for acknowledgment
            await waitForMessage(ws, 'message:ack');
            // Check sanitized message in database
            const savedMessage = await prisma.message.findFirst({
                where: {
                    sessionId: session.id,
                    sender: 'user'
                },
                orderBy: { createdAt: 'desc' }
            });
            expect(savedMessage?.text).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;Hello');
        });
        it('should handle invalid JSON payload', async () => {
            const { token } = await createTestSession();
            const ws = await createWebSocketConnection(token);
            openConnections.push(ws);
            await waitForMessage(ws, 'connection:success');
            // Send invalid JSON
            ws.send('invalid json');
            // Wait for error
            const errorMessage = await waitForMessage(ws, 'error:invalid_payload');
            expect(errorMessage.event).toBe('error:invalid_payload');
            expect(errorMessage.payload.message).toContain('Invalid message format');
        });
        it('should handle unknown event type', async () => {
            const { token } = await createTestSession();
            const ws = await createWebSocketConnection(token);
            openConnections.push(ws);
            await waitForMessage(ws, 'connection:success');
            // Send unknown event
            ws.send(JSON.stringify({
                event: 'unknown:event',
                payload: {}
            }));
            // Wait for error
            const errorMessage = await waitForMessage(ws, 'error:invalid_event');
            expect(errorMessage.event).toBe('error:invalid_event');
            expect(errorMessage.payload.message).toContain('Unknown event type');
        });
    });
    describe('Typing Indicator', () => {
        it('should handle typing event', async () => {
            const { token } = await createTestSession();
            const ws = await createWebSocketConnection(token);
            openConnections.push(ws);
            await waitForMessage(ws, 'connection:success');
            // Send typing event
            ws.send(JSON.stringify({
                event: 'user:typing',
                payload: { isTyping: true }
            }));
            // Wait a bit to ensure no error is sent back
            await new Promise(resolve => setTimeout(resolve, 100));
            // If we reach here without timeout, the test passes
            await new Promise(resolve => setTimeout(resolve, 1000));
        });
    });
    describe('Connection Management', () => {
        it('should handle multiple connections from same session', async () => {
            const { token } = await createTestSession();
            const ws1 = await createWebSocketConnection(token);
            const ws2 = await createWebSocketConnection(token);
            openConnections.push(ws1, ws2);
            await waitForMessage(ws1, 'connection:success');
            await waitForMessage(ws2, 'connection:success');
            // Both connections should be active
            const stats = websocketService.getStats();
            expect(stats.activeConnections).toBeGreaterThanOrEqual(2);
        });
        it('should clean up connection on close', async () => {
            const { token } = await createTestSession();
            const ws = await createWebSocketConnection(token);
            openConnections.push(ws);
            await waitForMessage(ws, 'connection:success');
            const initialConnections = websocketService.getStats().activeConnections;
            ws.close();
            // Wait for cleanup
            await new Promise(resolve => setTimeout(resolve, 1000));
            const finalConnections = websocketService.getStats().activeConnections;
            expect(finalConnections).toBeLessThan(initialConnections);
        });
    });
});
//# sourceMappingURL=websocket.test.js.map