// ModerationService: Handle message moderation operations
import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';

interface MessageWithSession {
  id: string;
  text: string;
  status: string;
  sessionId: string;
  createdAt: Date;
  moderatedAt?: Date;
  moderatedBy?: string;
  session: {
    id: string;
    isActive: boolean;
    guestUser: {
      name: string;
      city: string;
      country: string;
    };
  };
}

interface EventData {
  type: string;
  data: {
    id: string;
    text: string;
    senderName: string;
    city: string;
    country: string;
    createdAt: Date;
    moderatedAt: Date | undefined;
  };
}

type ModerationAction = 'approve' | 'reject' | 'block';
type MessageStatus = 'pending' | 'approved' | 'rejected' | 'blocked';

const prisma = new PrismaClient();
const redisClient = createClient({
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
const moderateMessage = async (
  messageId: string, 
  action: ModerationAction, 
  moderatorId: string
): Promise<MessageWithSession> => {
  try {
    // Validate action
    const validActions: ModerationAction[] = ['approve', 'reject', 'block'];
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
    let newStatus: MessageStatus;
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
    }) as MessageWithSession;

    // Publish moderation event to admin channel
    await publishMessageModerated(updatedMessage, action);

    // If approved, publish to Redis for WebSocket broadcast
    if (action === 'approve') {
      await publishMessageApproved(updatedMessage);
    }

    // If blocked, we might want to block the user session
    if (action === 'block') {
      await blockUserSession(message.sessionId);
    }

    return updatedMessage;
  } catch (error) {
    console.error('Error in moderateMessage:', error);
    throw error;
  }
};

// Publish moderation event to admin channel
const publishMessageModerated = async (message: MessageWithSession, action: ModerationAction): Promise<void> => {
  try {
    const moderationEvent = {
      event: 'message:moderated',
      data: {
        messageId: message.id,
        sessionId: message.sessionId,
        text: message.text,
        sender: 'user',
        status: message.status,
        createdAt: message.createdAt.toISOString(),
        updatedAt: message.moderatedAt?.toISOString() || new Date().toISOString(),
        guestName: message.session.guestUser.name,
        guestCity: message.session.guestUser.city,
        action: action
      }
    };

    // Publish to livechat:admin channel for moderator dashboard
    await redisClient.publish('livechat:admin', JSON.stringify(moderationEvent));
    console.log(`Published moderation event to livechat:admin channel: ${action} for message ${message.id}`);
  } catch (error) {
    console.error('Error publishing moderation event:', error);
    throw error;
  }
};

// Publish approved message to Redis for WebSocket broadcast
const publishMessageApproved = async (message: MessageWithSession): Promise<void> => {
  try {
    const eventData: EventData = {
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
  } catch (error) {
    console.error('Error publishing message approval:', error);
    throw error;
  }
};

// Block user session when message is blocked
const blockUserSession = async (sessionId: string): Promise<void> => {
  try {
    await prisma.session.update({
      where: { id: sessionId },
      data: { isActive: false }
    });
    console.log(`Blocked session: ${sessionId}`);
  } catch (error) {
    console.error('Error blocking user session:', error);
    throw error;
  }
};

// Get pending messages for moderation
const getPendingMessages = async (limit: number = 50, offset: number = 0): Promise<MessageWithSession[]> => {
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
    }) as MessageWithSession[];

    return messages;
  } catch (error) {
    console.error('Error getting pending messages:', error);
    throw error;
  }
};

// Get message by ID
const getMessageById = async (messageId: string): Promise<MessageWithSession | null> => {
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
    }) as MessageWithSession | null;

    return message;
  } catch (error) {
    console.error('Error getting message by ID:', error);
    throw error;
  }
};

export {
  moderateMessage,
  getPendingMessages,
  getMessageById,
  publishMessageApproved,
  publishMessageModerated,
  blockUserSession
};