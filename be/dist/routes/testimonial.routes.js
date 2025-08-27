"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [testimonial.routes.ts]: Testimonial API routes
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_validator_1 = require("express-validator");
const testimonial_controller_1 = require("../controllers/testimonial.controller");
const testimonial_validator_1 = require("../validators/testimonial.validator");
const router = express_1.default.Router();
// Rate limiting for testimonial endpoints
const testimonialRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs for listing
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
const testimonialSubmitRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 submissions per hour
    message: 'Too many testimonial submissions from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};
// GET /api/testimonials - List approved testimonials with pagination
router.get('/', testimonialRateLimit, testimonial_validator_1.validateTestimonialListQuery, handleValidationErrors, testimonial_controller_1.list);
// POST /api/testimonials - Submit new testimonial
router.post('/', testimonialSubmitRateLimit, testimonial_validator_1.validateTestimonialSubmission, handleValidationErrors, testimonial_controller_1.submit);
exports.default = router;
//# sourceMappingURL=testimonial.routes.js.map