"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTestimonialSubmission = exports.validateTestimonialListQuery = void 0;
// [testimonial.validator.ts]: Testimonial request validators
const express_validator_1 = require("express-validator");
const isomorphic_dompurify_1 = __importDefault(require("isomorphic-dompurify"));
// Sanitize HTML content to prevent XSS
const sanitizeHtml = (value) => {
    return isomorphic_dompurify_1.default.sanitize(value, { ALLOWED_TAGS: [] });
};
// Validate testimonial list query parameters
exports.validateTestimonialListQuery = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
        .toInt(),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be between 1 and 50')
        .toInt()
];
// Validate testimonial submission
exports.validateTestimonialSubmission = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .customSanitizer(sanitizeHtml),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .isLength({ max: 200 })
        .withMessage('Email must not exceed 200 characters')
        .normalizeEmail(),
    (0, express_validator_1.body)('city')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('City must be between 1 and 100 characters')
        .customSanitizer(sanitizeHtml),
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 5, max: 200 })
        .withMessage('Title must be between 5 and 200 characters')
        .customSanitizer(sanitizeHtml),
    (0, express_validator_1.body)('content')
        .trim()
        .notEmpty()
        .withMessage('Testimonial content is required')
        .isLength({ min: 20, max: 2000 })
        .withMessage('Testimonial content must be between 20 and 2000 characters')
        .customSanitizer(sanitizeHtml)
];
//# sourceMappingURL=testimonial.validator.js.map