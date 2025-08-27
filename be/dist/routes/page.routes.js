"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// PageRoutes: Page-related routes
const express_1 = __importDefault(require("express"));
const page_controller_1 = require("../controllers/page.controller");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = express_1.default.Router();
// Rate limiting for homepage endpoint
const homepageRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: process.env.NODE_ENV === 'test' ? 1000 : 30, // Higher limit for testing
    message: {
        success: false,
        message: 'Too many requests for homepage data, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
// Rate limiting for page content endpoint
const pageContentRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: process.env.NODE_ENV === 'test' ? 1000 : 50, // Higher limit for testing
    message: {
        success: false,
        message: 'Too many requests for page content, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
// GET /api/pages/homepage - Get aggregated homepage data
router.get('/homepage', homepageRateLimit, page_controller_1.getHomepageData);
// GET /api/pages/{slug} - Get page content by slug
router.get('/:slug', pageContentRateLimit, page_controller_1.findBySlug);
exports.default = router;
//# sourceMappingURL=page.routes.js.map