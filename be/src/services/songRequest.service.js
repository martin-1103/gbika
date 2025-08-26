"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentSongRequests = exports.createSongRequest = void 0;
// [songRequest.service.ts]: Song Request business logic
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Import notification service (CommonJS module)
const { notifyBroadcaster } = require('./notification.service');
// Create a new song request
const createSongRequest = async (data) => {
    try {
        // Sanitize input data
        const sanitizedData = {
            name: data.name.trim(),
            city: data.city?.trim() || null,
            songTitle: data.songTitle.trim(),
            message: data.message?.trim() || null,
        };
        const songRequest = await prisma.songRequest.create({
            data: sanitizedData,
        });
        // Send notification to broadcaster
        try {
            await notifyBroadcaster(songRequest);
            console.log('Broadcaster notification sent successfully');
        }
        catch (notificationError) {
            // Log error but don't fail the song request creation
            console.error('Failed to send broadcaster notification:', notificationError);
        }
        return songRequest;
    }
    catch (error) {
        console.error('Error in createSongRequest:', error);
        throw error;
    }
};
exports.createSongRequest = createSongRequest;
// Get recent song requests (for broadcaster dashboard)
const getRecentSongRequests = async (limit = 10) => {
    try {
        const songRequests = await prisma.songRequest.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });
        return songRequests;
    }
    catch (error) {
        console.error('Error in getRecentSongRequests:', error);
        throw error;
    }
};
exports.getRecentSongRequests = getRecentSongRequests;
//# sourceMappingURL=songRequest.service.js.map