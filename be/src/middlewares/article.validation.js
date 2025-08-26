"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateArticle = exports.validateUpdateArticle = exports.validateListArticles = void 0;
const express_validator_1 = require("express-validator");
const slugify_1 = __importDefault(require("slugify"));
// Validate query parameters for listing articles
exports.validateListArticles = [
    // Debug middleware
    (req, res, next) => {
        console.log('=== ENTERING validateListArticles middleware ===');
        console.log('Query params:', req.query);
        next();
    },
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
        .toInt(),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
        .toInt(),
    (0, express_validator_1.query)('sort_by')
        .optional()
        .isIn(['published_at', 'createdAt', 'title'])
        .withMessage('Sort by must be one of: published_at, createdAt, title'),
    (0, express_validator_1.query)('sort_order')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be either asc or desc'),
    // Handle validation errors
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
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
exports.validateUpdateArticle = [
    // Debug middleware
    (req, res, next) => {
        console.log('=== ENTERING validateUpdateArticle middleware ===');
        console.log('Request params:', req.params);
        console.log('Request body:', req.body);
        next();
    },
    // Validate slug parameter
    (0, express_validator_1.param)('slug')
        .notEmpty()
        .withMessage('Slug parameter is required')
        .matches(/^[a-z0-9-]+$/)
        .withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
    // Validate title (optional for updates)
    (0, express_validator_1.body)('title')
        .optional()
        .isLength({ min: 1, max: 255 })
        .withMessage('Title must be between 1 and 255 characters')
        .trim(),
    // Validate content (optional for updates)
    (0, express_validator_1.body)('content')
        .optional()
        .isLength({ min: 1 })
        .withMessage('Content cannot be empty')
        .trim(),
    // Validate slug (optional for updates)
    (0, express_validator_1.body)('slug')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Slug must not exceed 255 characters')
        .matches(/^[a-z0-9-]+$/)
        .withMessage('Slug must contain only lowercase letters, numbers, and hyphens')
        .custom((value, { req }) => {
        // Auto-generate slug if title is provided but slug is not
        if (!value && req.body.title) {
            req.body.slug = (0, slugify_1.default)(req.body.title, {
                lower: true,
                strict: true,
                remove: /[*+~.()'"\`!:@]/g
            });
        }
        return true;
    }),
    // Validate status (optional for updates)
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['draft', 'published'])
        .withMessage('Status must be either draft or published'),
    // Ensure at least one field is provided for update
    (0, express_validator_1.body)()
        .custom((value, { req }) => {
        const { title, content, slug, status } = req.body;
        if (!title && !content && !slug && !status) {
            throw new Error('At least one field (title, content, slug, or status) must be provided for update');
        }
        return true;
    }),
    // Handle validation errors
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
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
exports.validateCreateArticle = [
    // Debug middleware
    (req, res, next) => {
        console.log('=== ENTERING validateCreateArticle middleware ===');
        console.log('Request body:', req.body);
        next();
    },
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 255 })
        .withMessage('Title must be between 1 and 255 characters')
        .trim(),
    (0, express_validator_1.body)('content')
        .notEmpty()
        .withMessage('Content is required')
        .isLength({ min: 1 })
        .withMessage('Content cannot be empty')
        .trim(),
    (0, express_validator_1.body)('slug')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Slug must not exceed 255 characters')
        .matches(/^[a-z0-9-]+$/)
        .withMessage('Slug must contain only lowercase letters, numbers, and hyphens')
        .custom((value, { req }) => {
        // Auto-generate slug if not provided
        if (!value && req.body.title) {
            req.body.slug = (0, slugify_1.default)(req.body.title, {
                lower: true,
                strict: true,
                remove: /[*+~.()'"`!:@]/g
            });
        }
        return true;
    }),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['draft', 'published'])
        .withMessage('Status must be either draft or published')
        .default('draft'),
    // Handle validation errors
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
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
//# sourceMappingURL=article.validation.js.map