// NotificationService: Handle notifications for prayer team and administrators
import { PrismaClient } from '@prisma/client';
import { createClient, RedisClientType } from 'redis';

interface PrayerRequest {
  id: string;
  name: string;
  contact: string;
  content: string;
  isAnonymous: boolean;
  createdAt: Date;
}

interface SongRequest {
  id: string;
  name: string;
  city?: string;
  songTitle: string;
  message?: string;
  createdAt: Date;
}

interface NotificationData {
  type: string;
  data: any;
  timestamp: string;
}

interface NotificationResult {
  success: boolean;
  message: string;
}

const prisma = new PrismaClient();

// Initialize Redis client for pub/sub notifications
let redisClient: RedisClientType | null = null;
try {
  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    }
  });
  
  redisClient.connect().catch(console.error);
  redisClient.on('error', (err) => {
    console.warn('Redis connection failed for notifications:', err.message);
  });
} catch (error) {
  console.warn('Redis initialization failed for notifications:', (error as Error).message);
}

// Send notification to prayer team about new prayer request
const notifyPrayerTeam = async (prayerRequest: PrayerRequest): Promise<NotificationResult> => {
  try {
    // Log notification for now (can be replaced with email service later)
    console.log('=== PRAYER TEAM NOTIFICATION ===');
    console.log(`New prayer request received:`);
    console.log(`ID: ${prayerRequest.id}`);
    console.log(`Name: ${prayerRequest.isAnonymous ? 'Anonymous' : prayerRequest.name}`);
    console.log(`Contact: ${prayerRequest.isAnonymous ? 'Hidden' : prayerRequest.contact}`);
    console.log(`Content: ${prayerRequest.content}`);
    console.log(`Submitted at: ${prayerRequest.createdAt}`);
    console.log('================================');

    // Publish to Redis channel for real-time notifications
    if (redisClient && redisClient.isReady) {
      const notificationData: NotificationData = {
        type: 'new_prayer_request',
        data: {
          id: prayerRequest.id,
          name: prayerRequest.isAnonymous ? 'Anonymous' : prayerRequest.name,
          contact: prayerRequest.isAnonymous ? 'Hidden' : prayerRequest.contact,
          content: prayerRequest.content,
          isAnonymous: prayerRequest.isAnonymous,
          createdAt: prayerRequest.createdAt
        },
        timestamp: new Date().toISOString()
      };

      await redisClient.publish('prayer:notifications', JSON.stringify(notificationData));
      console.log('Prayer request notification published to Redis channel');
    }

    // TODO: Add email notification when email service is configured
    // await sendEmailNotification(prayerRequest);

    return { success: true, message: 'Prayer team notified successfully' };
  } catch (error) {
    console.error('Error notifying prayer team:', error);
    throw error;
  }
};

// Send email notification (placeholder for future implementation)
const sendEmailNotification = async (prayerRequest: PrayerRequest): Promise<NotificationResult> => {
  try {
    // TODO: Implement email notification using nodemailer or similar
    // This would require:
    // 1. Installing nodemailer: npm install nodemailer
    // 2. Adding email configuration to .env:
    //    EMAIL_HOST=smtp.gmail.com
    //    EMAIL_PORT=587
    //    EMAIL_USER=your-email@gmail.com
    //    EMAIL_PASS=your-app-password
    //    PRAYER_TEAM_EMAIL=prayer-team@elshadaifm.com
    // 3. Implementing the actual email sending logic
    
    console.log('Email notification would be sent here when configured');
    return { success: true, message: 'Email notification placeholder' };
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
};

// Get prayer team members (for future email distribution)
const getPrayerTeamMembers = async (): Promise<any[]> => {
  try {
    // TODO: Create a prayer_team table or use user roles
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('Error getting prayer team members:', error);
    throw error;
  }
};

// Close Redis connection gracefully
const closeRedisConnection = async (): Promise<void> => {
  try {
    if (redisClient && redisClient.isReady) {
      await redisClient.quit();
      console.log('Notification service Redis connection closed');
    }
  } catch (error) {
    console.error('Error closing notification Redis connection:', error);
  }
};

// Send notification to broadcaster about new song request
const notifyBroadcaster = async (songRequest: SongRequest): Promise<NotificationResult> => {
  try {
    // Log notification for now
    console.log('=== BROADCASTER NOTIFICATION ===');
    console.log(`New song request received:`);
    console.log(`ID: ${songRequest.id}`);
    console.log(`Name: ${songRequest.name}`);
    console.log(`City: ${songRequest.city || 'Not specified'}`);
    console.log(`Song Title: ${songRequest.songTitle}`);
    console.log(`Message: ${songRequest.message || 'No message'}`);
    console.log(`Submitted at: ${songRequest.createdAt}`);
    console.log('================================');

    // Publish to Redis channel for real-time notifications
    if (redisClient && redisClient.isReady) {
      const notificationData: NotificationData = {
        type: 'new_song_request',
        data: {
          id: songRequest.id,
          name: songRequest.name,
          city: songRequest.city,
          songTitle: songRequest.songTitle,
          message: songRequest.message,
          createdAt: songRequest.createdAt
        },
        timestamp: new Date().toISOString()
      };

      await redisClient.publish('song-requests', JSON.stringify(notificationData));
      console.log('Song request notification published to Redis channel');
    }

    return { success: true, message: 'Broadcaster notified successfully' };
  } catch (error) {
    console.error('Error notifying broadcaster:', error);
    throw error;
  }
};

export {
  notifyPrayerTeam,
  notifyBroadcaster,
  sendEmailNotification,
  getPrayerTeamMembers,
  closeRedisConnection
};