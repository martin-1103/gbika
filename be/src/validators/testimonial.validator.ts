// [testimonial.validator.ts]: Testimonial request validators
import { body, query } from 'express-validator';
import DOMPurify from 'isomorphic-dompurify';

// Sanitize HTML content to prevent XSS
const sanitizeHtml = (value: string) => {
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });
};

// Validate testimonial list query parameters
export const validateTestimonialListQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
    .toInt()
];

// Validate testimonial submission
export const validateTestimonialSubmission = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .customSanitizer(sanitizeHtml),
    
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .isLength({ max: 200 })
    .withMessage('Email must not exceed 200 characters')
    .normalizeEmail(),
    
  body('city')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('City must be between 1 and 100 characters')
    .customSanitizer(sanitizeHtml),
    
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters')
    .customSanitizer(sanitizeHtml),
    
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Testimonial content is required')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Testimonial content must be between 20 and 2000 characters')
    .customSanitizer(sanitizeHtml)
];