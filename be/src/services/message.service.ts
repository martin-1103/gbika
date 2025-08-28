// MessageService: Database operations for message management
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get approved messages with pagination
const getApprovedMessages = async (limit: number, offset: number) => {
  try {
    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: {
          status: 'approved'
        },
        select: {
          id: true,
          text: true,
          senderName: true,
          createdAt: true,
          moderatedAt: true,
          session: {
            select: {
              id: true,
              guestUser: {
                select: {
                  name: true,
                  city: true
                }
              }
            }
          }
        },
        orderBy: {
          moderatedAt: 'desc'
        },
        take: limit,
        skip: offset
      }),
      prisma.message.count({
        where: {
          status: 'approved'
        }
      })
    ]);

    return { messages, total };
  } catch (error) {
    console.error('Error fetching approved messages:', error);
    throw new Error('Failed to fetch approved messages');
  }
};

export {
  getApprovedMessages
};