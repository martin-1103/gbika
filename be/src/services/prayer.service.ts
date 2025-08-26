// [prayer.service.ts]: Prayer Request business logic
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Import notification service (CommonJS module)
const { notifyPrayerTeam } = require('./notification.service');

// Create a new prayer request
export const createPrayerRequest = async (data: {
  name: string;
  contact: string;
  content: string;
  isAnonymous: boolean;
}) => {
  try {
    const prayerRequest = await prisma.prayerRequest.create({
      data,
    });

    // Send notification to prayer team
    try {
      await notifyPrayerTeam(prayerRequest);
      console.log('Prayer team notification sent successfully');
    } catch (notificationError) {
      // Log error but don't fail the prayer request creation
      console.error('Failed to send prayer team notification:', notificationError);
    }

    return prayerRequest;
  } catch (error) {
    console.error('Error in createPrayerRequest:', error);
    throw error;
  }
};
