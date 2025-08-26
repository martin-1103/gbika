"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSongRequest = exports.validatePrayerRequest = void 0;
// [service.validator.ts]: Service request validators
const express_validator_1 = require("express-validator");
const isomorphic_dompurify_1 = __importDefault(require("isomorphic-dompurify"));
// Sanitize HTML content to prevent XSS
const sanitizeHtml = (value) => {
    return isomorphic_dompurify_1.default.sanitize(value, { ALLOWED_TAGS: [] });
};
// Validate prayer request submission
exports.validatePrayerRequest = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .customSanitizer(sanitizeHtml),
    (0, express_validator_1.body)('contact')
        .trim()
        .notEmpty()
        .withMessage('Contact information is required')
        .isLength({ max: 200 })
        .withMessage('Contact must not exceed 200 characters')
        .customSanitizer(sanitizeHtml),
    (0, express_validator_1.body)('content')
        .trim()
        .notEmpty()
        .withMessage('Prayer content is required')
        .isLength({ min: 10, max: 2000 })
        .withMessage('Prayer content must be between 10 and 2000 characters')
        .customSanitizer(sanitizeHtml),
    (0, express_validator_1.body)('is_anonymous')
        .optional()
        .customSanitizer((value) => {
        if (typeof value === 'string') {
            if (value.toLowerCase() === 'true')
                return true;
            if (value.toLowerCase() === 'false')
                return false;
            return value; // Let validation fail for invalid strings
        }
        return value;
    })
        .isBoolean()
        .withMessage('is_anonymous must be a boolean value')
];
// Validate song request submission
exports.validateSongRequest = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .customSanitizer(sanitizeHtml),
    (0, express_validator_1.body)('city')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('City must be between 1 and 100 characters')
        .customSanitizer(sanitizeHtml),
    (0, express_validator_1.body)('song_title')
        .trim()
        .notEmpty()
        .withMessage('Song title is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Song title must be between 1 and 200 characters')
        .customSanitizer(sanitizeHtml),
    (0, express_validator_1.body)('message')
        .optional()
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Message must be between 1 and 500 characters')
        .customSanitizer(sanitizeHtml)
];
//# sourceMappingURL=service.validator.js.map