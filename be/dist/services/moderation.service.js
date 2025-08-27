"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockUserSession = exports.publishMessageApproved = exports.getMessageById = exports.getPendingMessages = exports.moderateMessage = void 0;
// ModerationService: Handle message moderation operations
const client_1 = require("@prisma/client");
const redis_1 = require("redis");
const prisma = new client_1.PrismaClient();
const redisClient = (0, redis_1.createClient)({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379')
    }
});
// Connect to Redis
redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});
redisClient.connect().catch(console.error);
// Moderate message with given action
const moderateMessage = async (messageId, action, moderatorId) => {
    try {
        // Validate action
        const validActions = ['approve', 'reject', 'block'];
        if (!validActions.includes(action)) {
            throw new Error(`Invalid action: ${action}. Must be one of: ${validActions.join(', ')}`);
        }
        // Find the message
        const message = await prisma.message.findUnique({
            where: { id: messageId },
            include: {
                session: {
                    include: {
                        guestUser: true
                    }
                }
            }
        });
        if (!message) {
            throw new Error('Message not found');
        }
        // Check if message is already moderated
        if (message.status !== 'pending') {
            throw new Error(`Message already moderated with status: ${message.status}`);
        }
        // Determine new status based on action
        let newStatus;
        switch (action) {
            case 'approve':
                newStatus = 'approved';
                break;
            case 'reject':
                newStatus = 'rejected';
                break;
            case 'block':
                newStatus = 'blocked';
                break;
        }
        // Update message status
        const updatedMessage = await prisma.message.update({
            where: { id: messageId },
            data: {
                status: newStatus,
                moderatedBy: moderatorId,
                moderatedAt: new Date()
            },
            include: {
                session: {
                    include: {
                        guestUser: true
                    }
                }
            }
        });
        // If approved, publish to Redis for WebSocket broadcast
        if (action === 'approve') {
            await publishMessageApproved(updatedMessage);
        }
        // If blocked, we might want to block the user session
        if (action === 'block') {
            await blockUserSession(message.sessionId);
        }
        return updatedMessage;
    }
    catch (error) {
        console.error('Error in moderateMessage:', error);
        throw error;
    }
};
exports.moderateMessage = moderateMessage;
// Publish approved message to Redis for WebSocket broadcast
const publishMessageApproved = async (message) => {
    try {
        const eventData = {
            type: 'message_approved',
            data: {
                id: message.id,
                text: message.text,
                senderName: message.session.guestUser.name,
                city: message.session.guestUser.city,
                country: message.session.guestUser.country,
                createdAt: message.createdAt,
                moderatedAt: message.moderatedAt || undefined
            }
        };
        // Publish to feed:public channel for homepage widget
        await redisClient.publish('feed:public', JSON.stringify(eventData));
        console.log('Published approved message to feed:public channel');
    }
    catch (error) {
        console.error('Error publishing message approval:', error);
        throw error;
    }
};
exports.publishMessageApproved = publishMessageApproved;
// Block user session when message is blocked
const blockUserSession = async (sessionId) => {
    try {
        await prisma.session.update({
            where: { id: sessionId },
            data: { isActive: false }
        });
        console.log(`Blocked session: ${sessionId}`);
    }
    catch (error) {
        console.error('Error blocking user session:', error);
        throw error;
    }
};
exports.blockUserSession = blockUserSession;
// Get pending messages for moderation
const getPendingMessages = async (limit = 50, offset = 0) => {
    try {
        const messages = await prisma.message.findMany({
            where: {
                status: 'pending',
                sender: 'user' // Only user messages need moderation
            },
            include: {
                session: {
                    include: {
                        guestUser: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc' // Oldest first
            },
            take: limit,
            skip: offset
        });
        return messages;
    }
    catch (error) {
        console.error('Error getting pending messages:', error);
        throw error;
    }
};
exports.getPendingMessages = getPendingMessages;
// Get message by ID
const getMessageById = async (messageId) => {
    try {
        const message = await prisma.message.findUnique({
            where: { id: messageId },
            include: {
                session: {
                    include: {
                        guestUser: true
                    }
                }
            }
        });
        return message;
    }
    catch (error) {
        console.error('Error getting message by ID:', error);
        throw error;
    }
};
exports.getMessageById = getMessageById;
//# sourceMappingURL=moderation.service.js.map