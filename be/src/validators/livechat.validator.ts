// LivechatValidator: Input validation for livechat endpoints
import { body, ValidationChain } from 'express-validator';

// Validate session initiation request
const validateSessionInitiation: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\u00C0-\u017F]+$/)
    .withMessage('Name can only contain letters and spaces'),
    
  body('city')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('City must not exceed 50 characters')
    .matches(/^[a-zA-Z\s\u00C0-\u017F]*$/)
    .withMessage('City can only contain letters and spaces'),
    
  body('country')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Country must not exceed 50 characters')
    .matches(/^[a-zA-Z\s\u00C0-\u017F]*$/)
    .withMessage('Country can only contain letters and spaces')
];

export {
  validateSessionInitiation
};