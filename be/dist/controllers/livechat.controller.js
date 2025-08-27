"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiateSession = void 0;
const session_service_1 = require("../services/session.service");
const express_validator_1 = require("express-validator");
// Initiate new livechat session
const initiateSession = async (req, res) => {
    try {
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
            return;
        }
        const { name, city, country } = req.body;
        // Create session
        const { session, sessionToken } = await (0, session_service_1.createSession)({
            name,
            ...(city && { city }),
            ...(country && { country })
        });
        // Set user data in cookies
        const cookieOptions = {
            httpOnly: false, // Allow frontend to read these cookies
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        };
        res.cookie('livechat_name', name, cookieOptions);
        if (city)
            res.cookie('livechat_city', city, cookieOptions);
        if (country)
            res.cookie('livechat_country', country, cookieOptions);
        // Return success response
        res.status(201).json({
            success: true,
            message: 'Session created successfully',
            data: {
                sessionToken,
                sessionId: session.id,
                user: {
                    id: session.guestUser.id,
                    name: session.guestUser.name,
                    city: session.guestUser.city,
                    country: session.guestUser.country
                },
                expiresAt: session.expiresAt
            }
        });
    }
    catch (error) {
        console.error('Error in initiateSession:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.initiateSession = initiateSession;
//# sourceMappingURL=livechat.controller.js.map