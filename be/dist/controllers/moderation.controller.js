"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderateMessageEndpoint = void 0;
const express_validator_1 = require("express-validator");
const moderation_service_1 = require("../services/moderation.service");
// Moderate a message
const moderateMessageEndpoint = async (req, res) => {
    try {
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
            return;
        }
        const { id: messageId } = req.params;
        const { action } = req.body;
        const moderatorId = req.user.sub; // From auth middleware (guaranteed by authenticateToken)
        // Check if message exists
        const message = await (0, moderation_service_1.getMessageById)(messageId);
        if (!message) {
            res.status(404).json({
                success: false,
                message: 'Message not found'
            });
            return;
        }
        // Check if message is already moderated
        if (message.status !== 'pending') {
            res.status(409).json({
                success: false,
                message: `Message already moderated with status: ${message.status}`
            });
            return;
        }
        // Moderate the message
        const moderatedMessage = await (0, moderation_service_1.moderateMessage)(messageId, action, moderatorId);
        // Return success response
        let successMessage;
        switch (action) {
            case 'approve':
                successMessage = 'Message approved successfully';
                break;
            case 'reject':
                successMessage = 'Message rejected successfully';
                break;
            case 'block':
                successMessage = 'Message blocked successfully';
                break;
            default:
                successMessage = 'Message moderated successfully';
        }
        res.status(200).json({
            success: true,
            message: successMessage,
            data: {
                id: moderatedMessage.id,
                status: moderatedMessage.status,
                moderatedBy: moderatedMessage.moderatedBy,
                moderatedAt: moderatedMessage.moderatedAt,
                action: action
            }
        });
    }
    catch (error) {
        console.error('Error in moderateMessageEndpoint:', error);
        const errorMessage = error.message;
        // Handle specific error cases
        if (errorMessage.includes('Invalid action')) {
            res.status(422).json({
                success: false,
                message: errorMessage
            });
            return;
        }
        if (errorMessage.includes('Message not found')) {
            res.status(404).json({
                success: false,
                message: errorMessage
            });
            return;
        }
        if (errorMessage.includes('already moderated')) {
            res.status(409).json({
                success: false,
                message: errorMessage
            });
            return;
        }
        // Generic server error
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        });
    }
};
exports.moderateMessageEndpoint = moderateMessageEndpoint;
//# sourceMappingURL=moderation.controller.js.map