// [article.validation.ts]: Validation middleware for article endpoints
import { Request, Response, NextFunction } from 'express';
import { query, body, param, validationResult } from 'express-validator';
import slugify from 'slugify';

// Validate query parameters for listing articles
export const validateListArticles = [
  // Debug middleware
  (req: Request, res: Response, next: NextFunction) => {
    console.log('=== ENTERING validateListArticles middleware ===');
    console.log('Query params:', req.query);
    next();
  },
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  
  query('sort_by')
    .optional()
    .isIn(['published_at', 'createdAt', 'updatedAt', 'title'])
    .withMessage('Sort by must be one of: published_at, createdAt, updatedAt, title'),
  
  query('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc'),
  
  query('admin')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Admin must be either true or false'),
  
  query('search')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Search query must not exceed 255 characters'),
  
  // Handle validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Article validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(error => {
          // Handle different error types from express-validator
          if (error.type === 'field') {
            return {
              field: error.path,
              message: error.msg,
              value: error.value,
              location: error.location
            };
          }
          // For other error types (alternative, etc.), provide basic info
          return {
            field: 'path' in error ? error.path : 'unknown',
            message: error.msg,
            value: undefined,
            location: 'location' in error ? error.location : 'unknown'
          };
        })
      });
    }
    next();
  }
];

// Validate request for updating articles by slug
export const validateUpdateArticle = [
  // Debug middleware
  (req: Request, res: Response, next: NextFunction) => {
    console.log('=== ENTERING validateUpdateArticle middleware ===');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    next();
  },
  
  // Validate slug parameter
  param('slug')
    .notEmpty()
    .withMessage('Slug parameter is required')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
  
  // Validate title (optional for updates)
  body('title')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters')
    .trim(),
  
  // Validate content (optional for updates)
  body('content')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Content cannot be empty')
    .trim(),
  
  // Validate slug (optional for updates)
  body('slug')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Slug must not exceed 255 characters')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must contain only lowercase letters, numbers, and hyphens')
    .custom((value, { req }) => {
      // Auto-generate slug if title is provided but slug is not
      if (!value && req.body.title) {
        req.body.slug = slugify(req.body.title, {
          lower: true,
          strict: true,
          remove: /[*+~.()'"\`!:@]/g
        });
      }
      return true;
    }),
  
  // Validate status (optional for updates)
  body('status')
    .optional()
    .isIn(['draft', 'published', 'scheduled'])
    .withMessage('Status must be either draft, published, or scheduled'),
  
  // Validate published_at for scheduled posts (updates)
  body('published_at')
    .optional()
    .isISO8601()
    .withMessage('Published date must be a valid ISO8601 date string')
    .custom((value, { req }) => {
      if (req.body.status === 'scheduled' && !value) {
        throw new Error('Published date is required for scheduled articles');
      }
      // For updates, allow existing scheduled dates even if they're in the past
      // Only validate future date if we're changing status to scheduled with a new date
      if (value && req.body.status === 'scheduled') {
        const scheduledDate = new Date(value);
        const now = new Date();
        
        // Allow past dates for existing scheduled articles being updated
        // Only require future dates for new scheduled articles (status change from non-scheduled to scheduled)
        if (scheduledDate <= now) {
          // This is more permissive for updates - we'll let the service layer handle the business logic
          console.log(`Warning: Scheduled date ${value} is in the past, but allowing for update`);
        }
      }
      return true;
    }),
  
  // Ensure at least one field is provided for update
  body()
    .custom((value, { req }) => {
      const { title, content, slug, status, published_at } = req.body;
      if (!title && !content && !slug && !status && !published_at) {
        throw new Error('At least one field (title, content, slug, status, or published_at) must be provided for update');
      }
      return true;
    }),
  
  // Handle validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Update article validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(error => {
          // Handle different error types from express-validator
          if (error.type === 'field') {
            return {
              field: error.path,
              message: error.msg,
              value: error.value,
              location: error.location
            };
          }
          // For other error types (alternative, etc.), provide basic info
          return {
            field: 'path' in error ? error.path : 'unknown',
            message: error.msg,
            value: undefined,
            location: 'location' in error ? error.location : 'unknown'
          };
        })
      });
    }
    next();
  }
];

// Validate request body for creating articles
export const validateCreateArticle = [
  // Debug middleware
  (req: Request, res: Response, next: NextFunction) => {
    console.log('=== ENTERING validateCreateArticle middleware ===');
    console.log('Request body:', req.body);
    next();
  },
  
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters')
    .trim(),
  
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 1 })
    .withMessage('Content cannot be empty')
    .trim(),
  
  body('slug')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Slug must not exceed 255 characters')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must contain only lowercase letters, numbers, and hyphens')
    .custom((value, { req }) => {
      // Auto-generate slug if not provided
      if (!value && req.body.title) {
        req.body.slug = slugify(req.body.title, {
          lower: true,
          strict: true,
          remove: /[*+~.()'"`!:@]/g
        });
      }
      return true;
    }),
  
  body('status')
    .optional()
    .isIn(['draft', 'published', 'scheduled'])
    .withMessage('Status must be either draft, published, or scheduled')
    .default('draft'),
  
  // Validate published_at for scheduled posts
  body('published_at')
    .optional()
    .isISO8601()
    .withMessage('Published date must be a valid ISO8601 date string')
    .custom((value, { req }) => {
      if (req.body.status === 'scheduled' && !value) {
        throw new Error('Published date is required for scheduled articles');
      }
      if (value && new Date(value) <= new Date()) {
        throw new Error('Published date must be in the future');
      }
      return true;
    }),
  
  // Handle validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Create article validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(error => {
          // Handle different error types from express-validator
          if (error.type === 'field') {
            return {
              field: error.path,
              message: error.msg,
              value: error.value,
              location: error.location
            };
          }
          // For other error types (alternative, etc.), provide basic info
          return {
            field: 'path' in error ? error.path : 'unknown',
            message: error.msg,
            value: undefined,
            location: 'location' in error ? error.location : 'unknown'
          };
        })
      });
    }
    next();
  }
];