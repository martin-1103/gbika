// LivechatRoutes: Route definitions for livechat endpoints
const express = require('express');
const rateLimit = require('express-rate-limit');
const { initiateSession } = require('../controllers/livechat.controller');
const { moderateMessageEndpoint } = require('../controllers/moderation.controller');
const { validateSessionInitiation } = require('../validators/livechat.validator');
const { validateMessageModeration } = require('../validators/moderation.validator');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/roles.middleware');

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

module.exports = router;