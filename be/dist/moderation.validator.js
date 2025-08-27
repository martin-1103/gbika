"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMessageModeration = void 0;
// ModerationValidator: Input validation for moderation endpoints
var express_validator_1 = require("express-validator");
// Validate message moderation request
var validateMessageModeration = [
    // Validate message ID parameter
    (0, express_validator_1.param)('id')
        .notEmpty()
        .withMessage('Message ID is required')
        .isString()
        .withMessage('Message ID must be a string')
        .isLength({ min: 1 })
        .withMessage('Message ID cannot be empty'),
    // Validate action in request body
    (0, express_validator_1.body)('action')
        .notEmpty()
        .withMessage('Action is required')
        .isString()
        .withMessage('Action must be a string')
        .isIn(['approve', 'reject', 'block'])
        .withMessage('Action must be one of: approve, reject, block')
];
exports.validateMessageModeration = validateMessageModeration;
