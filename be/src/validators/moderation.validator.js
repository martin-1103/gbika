// ModerationValidator: Input validation for moderation endpoints
const { body, param } = require('express-validator');

// Validate message moderation request
const validateMessageModeration = [
  // Validate message ID parameter
  param('id')
    .notEmpty()
    .withMessage('Message ID is required')
    .isString()
    .withMessage('Message ID must be a string')
    .isLength({ min: 1 })
    .withMessage('Message ID cannot be empty'),

  // Validate action in request body
  body('action')
    .notEmpty()
    .withMessage('Action is required')
    .isString()
    .withMessage('Action must be a string')
    .isIn(['approve', 'reject', 'block'])
    .withMessage('Action must be one of: approve, reject, block')
];

module.exports = {
  validateMessageModeration
};