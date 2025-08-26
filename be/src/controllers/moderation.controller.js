// ModerationController: Handle message moderation endpoints
const { validationResult } = require('express-validator');
const { moderateMessage, getMessageById } = require('../services/moderation.service');

// Moderate a message
const moderateMessageEndpoint = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id: messageId } = req.params;
    const { action } = req.body;
    const moderatorId = req.user.sub; // From auth middleware

    // Check if message exists
    const message = await getMessageById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if message is already moderated
    if (message.status !== 'pending') {
      return res.status(409).json({
        success: false,
        message: `Message already moderated with status: ${message.status}`
      });
    }

    // Moderate the message
    const moderatedMessage = await moderateMessage(messageId, action, moderatorId);

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

  } catch (error) {
    console.error('Error in moderateMessageEndpoint:', error);
    
    // Handle specific error cases
    if (error.message.includes('Invalid action')) {
      return res.status(422).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('Message not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('already moderated')) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  moderateMessageEndpoint
};