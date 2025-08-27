"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitSongRequest = exports.submitPrayerRequest = void 0;
const prayer_service_1 = require("../services/prayer.service");
const songRequest_service_1 = require("../services/songRequest.service");
// Submit prayer request
const submitPrayerRequest = async (req, res) => {
    try {
        const { name, contact, content, is_anonymous } = req.body;
        const prayerRequest = await (0, prayer_service_1.createPrayerRequest)({
            name,
            contact,
            content,
            isAnonymous: is_anonymous || false
        });
        console.log('Prayer request created:', prayerRequest.id);
        // TODO: Send notification to prayer team
        res.status(201).json({ message: 'Prayer request submitted successfully.' });
    }
    catch (error) {
        console.error('Error submitting prayer request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.submitPrayerRequest = submitPrayerRequest;
// Submit song request
const submitSongRequest = async (req, res) => {
    try {
        const { name, city, song_title, message } = req.body;
        const songRequest = await (0, songRequest_service_1.createSongRequest)({
            name,
            city,
            songTitle: song_title,
            message
        });
        console.log('Song request created:', songRequest.id);
        res.status(201).json({
            message: 'Song request submitted successfully.',
            data: {
                id: songRequest.id,
                name: songRequest.name,
                city: songRequest.city,
                songTitle: songRequest.songTitle,
                message: songRequest.message,
                createdAt: songRequest.createdAt
            }
        });
    }
    catch (error) {
        console.error('Error submitting song request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.submitSongRequest = submitSongRequest;
//# sourceMappingURL=service.controller.js.map