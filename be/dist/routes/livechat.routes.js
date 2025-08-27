"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// LivechatRoutes: Route definitions for livechat endpoints
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const livechat_controller_1 = require("../controllers/livechat.controller");
const moderation_controller_1 = require("../controllers/moderation.controller");
const livechat_validator_1 = require("../validators/livechat.validator");
const moderation_validator_1 = require("../validators/moderation.validator");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const roles_middleware_1 = require("../middlewares/roles.middleware");
const router = express_1.default.Router();
// Rate limiting for session initiation
const sessionInitiationRateLimit = (0, express_rate_limit_1.default)({
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
router.post('/session', sessionInitiationRateLimit, livechat_validator_1.validateSessionInitiation, livechat_controller_1.initiateSession);
// POST /api/livechat/messages/:id/moderate - Moderate a message (Admin/Penyiar only)
router.post('/messages/:id/moderate', auth_middleware_1.authenticateToken, (0, roles_middleware_1.authorizeRoles)('admin', 'penyiar'), moderation_validator_1.validateMessageModeration, moderation_controller_1.moderateMessageEndpoint);
exports.default = router;
//# sourceMappingURL=livechat.routes.js.map