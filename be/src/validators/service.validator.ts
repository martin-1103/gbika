// [service.validator.ts]: Service request validators
import { body } from 'express-validator';
import DOMPurify from 'isomorphic-dompurify';

// Sanitize HTML content to prevent XSS
const sanitizeHtml = (value: string) => {
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });
};

// Validate prayer request submission
export const validatePrayerRequest = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .customSanitizer(sanitizeHtml),
    
  body('contact')
    .trim()
    .notEmpty()
    .withMessage('Contact information is required')
    .isLength({ max: 200 })
    .withMessage('Contact must not exceed 200 characters')
    .customSanitizer(sanitizeHtml),
    
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Prayer content is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Prayer content must be between 10 and 2000 characters')
    .customSanitizer(sanitizeHtml),
    
  body('is_anonymous')
    .optional()
    .customSanitizer((value) => {
      if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
        return value; // Let validation fail for invalid strings
      }
      return value;
    })
    .isBoolean()
    .withMessage('is_anonymous must be a boolean value')
];

// Validate song request submission
export const validateSongRequest = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .customSanitizer(sanitizeHtml),
    
  body('city')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('City must be between 1 and 100 characters')
    .customSanitizer(sanitizeHtml),
    
  body('song_title')
    .trim()
    .notEmpty()
    .withMessage('Song title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Song title must be between 1 and 200 characters')
    .customSanitizer(sanitizeHtml),
    
  body('message')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters')
    .customSanitizer(sanitizeHtml)
];