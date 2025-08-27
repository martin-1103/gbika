"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeRedisConnection = exports.getPrayerTeamMembers = exports.sendEmailNotification = exports.notifyBroadcaster = exports.notifyPrayerTeam = void 0;
// NotificationService: Handle notifications for prayer team and administrators
const client_1 = require("@prisma/client");
const redis_1 = require("redis");
const prisma = new client_1.PrismaClient();
// Initialize Redis client for pub/sub notifications
let redisClient = null;
try {
    redisClient = (0, redis_1.createClient)({
        socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
        }
    });
    redisClient.connect().catch(console.error);
    redisClient.on('error', (err) => {
        console.warn('Redis connection failed for notifications:', err.message);
    });
}
catch (error) {
    console.warn('Redis initialization failed for notifications:', error.message);
}
// Send notification to prayer team about new prayer request
const notifyPrayerTeam = async (prayerRequest) => {
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
            const notificationData = {
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
    }
    catch (error) {
        console.error('Error notifying prayer team:', error);
        throw error;
    }
};
exports.notifyPrayerTeam = notifyPrayerTeam;
// Send email notification (placeholder for future implementation)
const sendEmailNotification = async (prayerRequest) => {
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
    }
    catch (error) {
        console.error('Error sending email notification:', error);
        throw error;
    }
};
exports.sendEmailNotification = sendEmailNotification;
// Get prayer team members (for future email distribution)
const getPrayerTeamMembers = async () => {
    try {
        // TODO: Create a prayer_team table or use user roles
        // For now, return empty array
        return [];
    }
    catch (error) {
        console.error('Error getting prayer team members:', error);
        throw error;
    }
};
exports.getPrayerTeamMembers = getPrayerTeamMembers;
// Close Redis connection gracefully
const closeRedisConnection = async () => {
    try {
        if (redisClient && redisClient.isReady) {
            await redisClient.quit();
            console.log('Notification service Redis connection closed');
        }
    }
    catch (error) {
        console.error('Error closing notification Redis connection:', error);
    }
};
exports.closeRedisConnection = closeRedisConnection;
// Send notification to broadcaster about new song request
const notifyBroadcaster = async (songRequest) => {
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
            const notificationData = {
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
    }
    catch (error) {
        console.error('Error notifying broadcaster:', error);
        throw error;
    }
};
exports.notifyBroadcaster = notifyBroadcaster;
//# sourceMappingURL=notification.service.js.map