"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ModerationTest: Test cases for message moderation endpoints
const request = require('supertest');
const { app } = require('../src/app');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
describe('Message Moderation API', () => {
    let adminToken, penyiarToken, userToken;
    let adminUser, penyiarUser, regularUser;
    let testSession, testMessage;
    beforeAll(async () => {
        // Create test users
        const hashedPassword = await bcrypt.hash('testpassword', 10);
        adminUser = await prisma.user.create({
            data: {
                email: 'admin@test.com',
                password: hashedPassword,
                name: 'Admin Test',
                role: 'admin'
            }
        });
        penyiarUser = await prisma.user.create({
            data: {
                email: 'penyiar@test.com',
                password: hashedPassword,
                name: 'Penyiar Test',
                role: 'penyiar'
            }
        });
        regularUser = await prisma.user.create({
            data: {
                email: 'user@test.com',
                password: hashedPassword,
                name: 'Regular User',
                role: 'user'
            }
        });
        // Generate tokens
        adminToken = jwt.sign({ sub: adminUser.id, role: adminUser.role, jti: 'admin-test-token' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        penyiarToken = jwt.sign({ sub: penyiarUser.id, role: penyiarUser.role, jti: 'penyiar-test-token' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        userToken = jwt.sign({ sub: regularUser.id, role: regularUser.role, jti: 'user-test-token' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Create test guest user and session
        const guestUser = await prisma.guestUser.create({
            data: {
                name: 'Test Guest',
                city: 'Test City',
                country: 'Test Country'
            }
        });
        testSession = await prisma.session.create({
            data: {
                guestUserId: guestUser.id,
                isActive: true,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
            }
        });
        // Create test message
        testMessage = await prisma.message.create({
            data: {
                sessionId: testSession.id,
                text: 'Test message for moderation',
                sender: 'user',
                status: 'pending'
            }
        });
    });
    afterAll(async () => {
        // Clean up test data
        await prisma.message.deleteMany({ where: { sessionId: testSession.id } });
        await prisma.session.deleteMany({ where: { id: testSession.id } });
        await prisma.guestUser.deleteMany({ where: { name: 'Test Guest' } });
        await prisma.user.deleteMany({
            where: {
                email: { in: ['admin@test.com', 'penyiar@test.com', 'user@test.com'] }
            }
        });
        await prisma.$disconnect();
    });
    describe('POST /api/livechat/messages/:id/moderate', () => {
        it('should allow admin to approve a message', async () => {
            const response = await request(app)
                .post(`/api/livechat/messages/${testMessage.id}/moderate`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ action: 'approve' })
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Message approved successfully');
            expect(response.body.data.status).toBe('approved');
            expect(response.body.data.moderatedBy).toBe(adminUser.id);
            // Reset message status for other tests
            await prisma.message.update({
                where: { id: testMessage.id },
                data: {
                    status: 'pending',
                    moderatedBy: null,
                    moderatedAt: null
                }
            });
        });
        it('should allow penyiar to reject a message', async () => {
            const response = await request(app)
                .post(`/api/livechat/messages/${testMessage.id}/moderate`)
                .set('Authorization', `Bearer ${penyiarToken}`)
                .send({ action: 'reject' })
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Message rejected successfully');
            expect(response.body.data.status).toBe('rejected');
            expect(response.body.data.moderatedBy).toBe(penyiarUser.id);
            // Reset message status for other tests
            await prisma.message.update({
                where: { id: testMessage.id },
                data: {
                    status: 'pending',
                    moderatedBy: null,
                    moderatedAt: null
                }
            });
        });
        it('should return 401 for unauthenticated requests', async () => {
            const response = await request(app)
                .post(`/api/livechat/messages/${testMessage.id}/moderate`)
                .send({ action: 'approve' })
                .expect(401);
            expect(response.body.message).toBe('Access token required.');
        });
        it('should return 403 for unauthorized role (regular user)', async () => {
            const response = await request(app)
                .post(`/api/livechat/messages/${testMessage.id}/moderate`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ action: 'approve' })
                .expect(403);
            expect(response.body.message).toBe('Forbidden access.');
        });
        it('should return 404 for non-existent message', async () => {
            const response = await request(app)
                .post('/api/livechat/messages/non-existent-id/moderate')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ action: 'approve' })
                .expect(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Message not found');
        });
        it('should return 422 for invalid action', async () => {
            const response = await request(app)
                .post(`/api/livechat/messages/${testMessage.id}/moderate`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ action: 'delete' })
                .expect(422);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
            expect(response.body.errors).toBeDefined();
        });
        it('should return 422 for missing action', async () => {
            const response = await request(app)
                .post(`/api/livechat/messages/${testMessage.id}/moderate`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({})
                .expect(422);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
        });
        it('should return 409 for already moderated message', async () => {
            // First, moderate the message
            await prisma.message.update({
                where: { id: testMessage.id },
                data: {
                    status: 'approved',
                    moderatedBy: adminUser.id,
                    moderatedAt: new Date()
                }
            });
            // Try to moderate again
            const response = await request(app)
                .post(`/api/livechat/messages/${testMessage.id}/moderate`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ action: 'reject' })
                .expect(409);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('already moderated');
            // Reset for cleanup
            await prisma.message.update({
                where: { id: testMessage.id },
                data: {
                    status: 'pending',
                    moderatedBy: null,
                    moderatedAt: null
                }
            });
        });
    });
});
//# sourceMappingURL=moderation.test.js.map