// LivechatController: Handle livechat session endpoints
import { Request, Response } from 'express';
import { createSession } from '../services/session.service';
import { getApprovedMessages } from '../services/message.service';
import { validationResult } from 'express-validator';

interface SessionRequestBody {
  name: string;
  city?: string;
  country?: string;
}

// Initiate new livechat session
const initiateSession = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }
    
    const { name, city, country } = req.body as SessionRequestBody;
    
    // Create session
    const { session, sessionToken } = await createSession({
      name,
      ...(city && { city }),
      ...(country && { country })
    });
    
    // Set user data in cookies
    const cookieOptions = {
      httpOnly: false, // Allow frontend to read these cookies
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    };
    
    res.cookie('livechat_name', name, cookieOptions);
    if (city) res.cookie('livechat_city', city, cookieOptions);
    if (country) res.cookie('livechat_country', country, cookieOptions);
    
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
    
  } catch (error) {
    console.error('Error in initiateSession:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

// Get approved messages history
const getApprovedMessagesHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const { messages, total } = await getApprovedMessages(limit, offset);

    res.status(200).json({
      success: true,
      message: 'Approved messages retrieved successfully',
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting approved messages:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export {
  initiateSession,
  getApprovedMessagesHistory
};