// ModerationController: Handle message moderation endpoints
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { moderateMessage, getMessageById } from '../services/moderation.service';

interface AuthenticatedUser {
  sub: string;
  [key: string]: any;
}

interface ModerationRequestBody {
  action: 'approve' | 'reject' | 'block';
}

interface ModerationParams {
  id: string;
}

// Moderate a message
const moderateMessageEndpoint = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { id: messageId } = req.params as unknown as ModerationParams;
    const { action } = req.body as unknown as ModerationRequestBody;
    const moderatorId = (req as any).user.sub; // From auth middleware (guaranteed by authenticateToken)

    // Check if message exists
    const message = await getMessageById(messageId);
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
    const moderatedMessage = await moderateMessage(messageId, action, moderatorId);

    // Return success response
    let successMessage: string;
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
    
    const errorMessage = (error as Error).message;
    
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

export {
  moderateMessageEndpoint
};