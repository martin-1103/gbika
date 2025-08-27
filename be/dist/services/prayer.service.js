"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrayerRequest = void 0;
// [prayer.service.ts]: Prayer Request business logic
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Import notification service (CommonJS module)
const { notifyPrayerTeam } = require('./notification.service');
// Create a new prayer request
const createPrayerRequest = async (data) => {
    try {
        const prayerRequest = await prisma.prayerRequest.create({
            data,
        });
        // Send notification to prayer team
        try {
            await notifyPrayerTeam(prayerRequest);
            console.log('Prayer team notification sent successfully');
        }
        catch (notificationError) {
            // Log error but don't fail the prayer request creation
            console.error('Failed to send prayer team notification:', notificationError);
        }
        return prayerRequest;
    }
    catch (error) {
        console.error('Error in createPrayerRequest:', error);
        throw error;
    }
};
exports.createPrayerRequest = createPrayerRequest;
//# sourceMappingURL=prayer.service.js.map