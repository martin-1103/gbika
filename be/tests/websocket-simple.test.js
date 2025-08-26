"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const http_1 = require("http");
const app_1 = require("../src/app");
const websocketService = require('../src/services/websocket.service');
const prisma = new client_1.PrismaClient();
describe('WebSocket Basic Test', () => {
    let server;
    let wsUrl;
    beforeAll(async () => {
        server = (0, http_1.createServer)(app_1.app);
        websocketService.initializeServer(server);
        await new Promise((resolve) => {
            server.listen(0, () => {
                const port = server.address()?.port;
                wsUrl = `ws://localhost:${port}/livechat/ws`;
                resolve();
            });
        });
    }, 10000);
    afterAll(async () => {
        try {
            await websocketService.close();
            if (server) {
                await new Promise((resolve) => {
                    server.close(() => resolve());
                });
            }
            await prisma.$disconnect();
        }
        catch (error) {
            console.error('Cleanup error:', error);
        }
    }, 10000);
    it('should create a valid JWT token', async () => {
        // Create test session
        const guestUser = await prisma.guestUser.create({
            data: {
                name: 'Test User',
                city: 'Test City'
            }
        });
        const session = await prisma.session.create({
            data: {
                guestUserId: guestUser.id,
                isActive: true,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        });
        const token = jsonwebtoken_1.default.sign({
            session_id: session.id,
            user_id: guestUser.id,
            name: guestUser.name
        }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '24h' });
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        // Cleanup
        await prisma.session.delete({ where: { id: session.id } });
        await prisma.guestUser.delete({ where: { id: guestUser.id } });
    });
});
//# sourceMappingURL=websocket-simple.test.js.map