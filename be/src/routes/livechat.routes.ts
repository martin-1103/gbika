// LivechatRoutes: Route definitions for livechat endpoints
import express from 'express';
import rateLimit from 'express-rate-limit';
import { initiateSession, getApprovedMessagesHistory } from '../controllers/livechat.controller';
import { moderateMessageEndpoint } from '../controllers/moderation.controller';
import { validateSessionInitiation } from '../validators/livechat.validator';
import { validateMessageModeration } from '../validators/moderation.validator';
import { authenticateToken } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/roles.middleware';

const router = express.Router();

// Rate limiting for session initiation
const sessionInitiationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 session creation requests per windowMs
  message: {
    success: false,
    message: 'Too many session creation attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in test environment
    return process.env.NODE_ENV === 'test';
  }
});

// POST /api/livechat/session - Initiate new livechat session
router.post('/session', 
  sessionInitiationRateLimit,
  validateSessionInitiation,
  initiateSession
);

// POST /api/livechat/messages/:id/moderate - Moderate a message (Admin/Penyiar only)
router.post('/messages/:id/moderate',
  authenticateToken,
  authorizeRoles('admin', 'penyiar'),
  validateMessageModeration,
  moderateMessageEndpoint
);

// GET /api/livechat/messages/approved - Get approved messages history
router.get('/messages/approved', getApprovedMessagesHistory);

export default router;